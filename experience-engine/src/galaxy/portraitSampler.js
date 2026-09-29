const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

export function createHeartPoints(width,height,count=900){
  const points=[];
  const scale=Math.min(width,height)*0.028;
  for(let i=0;i<count;i++){
    const t=Math.random()*Math.PI*2;
    const r=Math.sqrt(Math.random());
    const x=16*Math.sin(t)**3;
    const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    points.push({x:x*scale*r,y:-y*scale*r,alpha:.58+Math.random()*.42,tint:Math.random()>.76?0xffd5e0:0xfff4e9});
  }
  return points;
}

async function decodeImage(source){
  if(typeof source==='string'){
    const img=new Image();
    img.decoding='async';
    img.crossOrigin='anonymous';
    img.src=source;
    await img.decode();
    return img;
  }
  if('createImageBitmap' in window)return createImageBitmap(source);
  const url=URL.createObjectURL(source);
  try{
    const img=new Image();
    img.decoding='async';
    img.src=url;
    await img.decode();
    return img;
  }finally{URL.revokeObjectURL(url)}
}

export async function samplePortraitFile(source,{width,height,count=1100}){
  const image=await decodeImage(source);
  const canvas=document.createElement('canvas');
  const side=clamp(Math.round(Math.min(width,height)*.72),280,720);
  canvas.width=side;canvas.height=side;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const iw=image.width,ih=image.height,ratio=Math.max(side/iw,side/ih);
  const dw=iw*ratio,dh=ih*ratio;
  ctx.fillStyle='#02030a';ctx.fillRect(0,0,side,side);
  ctx.drawImage(image,(side-dw)/2,(side-dh)/2,dw,dh);
  const data=ctx.getImageData(0,0,side,side).data;
  const candidates=[];
  const step=Math.max(2,Math.floor(side/95));
  for(let y=0;y<side;y+=step){
    for(let x=0;x<side;x+=step){
      const k=(y*side+x)*4,a=data[k+3]/255;
      if(a<.4)continue;
      const r=data[k],g=data[k+1],b=data[k+2];
      const lum=(r*.2126+g*.7152+b*.0722)/255;
      if(lum<.08)continue;
      const saturation=Math.max(r,g,b)-Math.min(r,g,b);
      const tint=(r<<16)|(g<<8)|b;
      candidates.push({x:x-side/2,y:y-side/2,alpha:clamp(.35+lum*.8,.35,1),tint,saturation});
    }
  }
  if(!candidates.length)return createHeartPoints(width,height,count);
  const points=[];
  const stride=Math.max(1,candidates.length/count);
  for(let i=0;i<count;i++){
    const p=candidates[Math.floor((i*stride+Math.random()*stride)%candidates.length)];
    points.push({x:p.x,y:p.y,alpha:p.alpha,tint:p.tint});
  }
  return points;
}
