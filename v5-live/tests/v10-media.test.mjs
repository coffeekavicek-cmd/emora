import test from 'node:test';
import assert from 'node:assert/strict';
import {validateFile,uploadPrivate,refreshPrivate,publishPrivate} from '../templates/v10-media.js';
const user='d3b07341-9508-4e77-b6b3-d74658fda11d',project='0cf64f69-3fce-4df5-bacb-7ec1d9070b19';
function mock(){
 const calls=[];return{calls,storage:{from(bucket){return{
  async upload(path,data,options){calls.push({kind:'upload',bucket,path,options,size:data.size});return{data:{path},error:null}},
  async createSignedUrl(path,expiry){calls.push({kind:'signed',bucket,path,expiry});return{data:{signedUrl:'https://example.supabase.co/storage/sign/'+path+'?token=fake-preview'},error:null}},
  async download(path){calls.push({kind:'download',bucket,path});return{data:new Blob(['original-media'],{type:'image/jpeg'}),error:null}},
  getPublicUrl(path){calls.push({kind:'public',bucket,path});return{data:{publicUrl:'https://example.supabase.co/storage/v1/object/public/'+bucket+'/'+path}}}
 }}}}
}
test('rejects files that cannot safely be published',()=>{
 assert.throws(()=>validateFile({type:'image/svg+xml',size:300},'photo1'),/format/i);
 assert.throws(()=>validateFile({type:'image/jpeg',size:9*1024*1024},'photo1'),/8 MB/);
 assert.throws(()=>validateFile({type:'video/webm',size:10},'videoUrl'),/format/i);
 assert.throws(()=>validateFile({type:'video/mp4',size:41*1024*1024},'videoUrl'),/40 MB/);
 assert.equal(validateFile({type:'audio/mpeg',size:1000},'musicUrl'),'mp3');
});
test('draft file remains in owner-private bucket until explicit publish',async()=>{
 const db=mock();const file=new Blob(['private-preview'],{type:'image/jpeg'});file.name='ceremony.jpg';
 const u=await uploadPrivate(db,user,'photo1',file);
 assert.ok(u.record.path.startsWith(user+'/'));
 assert.ok(u.url.includes('/storage/sign/'));
 assert.equal(db.calls.length,2);
 assert.equal(db.calls[0].bucket,'emora-media');
 assert.equal(db.calls[1].expiry,3600);
 assert.equal(db.calls.some(c=>c.bucket==='emora-published'),false);
});
test('private preview URLs refresh only for owner-prefixed records',async()=>{
 const db=mock(),media={photo1:{path:user+'/abc.jpg',mime:'image/jpeg'},photo2:{path:'other-account/stolen.jpg',mime:'image/jpeg'}};
 const signed=await refreshPrivate(db,user,media);
 assert.ok(signed.photo1.includes('abc.jpg'));assert.equal(signed.photo2,undefined);
 assert.equal(db.calls.length,1);
});
test('publication copies into own stable public bucket and scrubs private metadata',async()=>{
 const db=mock(),rec={path:user+'/12345678-1234-1234-1234-123456789abc.jpg',mime:'image/jpeg',size:1000};
 const content={name1:'Dilnoza',photos:['https://old.example/file','',''],music:'',video:'',media:{photo1:rec}};
 const out=await publishPrivate(db,user,project,content,{photo1:rec});
 assert.equal(db.calls.filter(c=>c.kind==='download').length,1);
 assert.ok(out.publicContent.photos[0].includes('/emora-published/'+user+'/'+project+'/'));
 assert.equal(out.publicContent.media,undefined);
 assert.ok(content.media.photo1);
 assert.equal(out.publicContent.name1,'Dilnoza');
});
test('cross-account source cannot be promoted to published media',async()=>{
 const db=mock();
 await assert.rejects(()=>publishPrivate(db,user,project,{photos:[]},{photo1:{path:'someone-else/file.jpg',mime:'image/jpeg'}}),/egasi/i);
 assert.equal(db.calls.length,0);
});
