import { Suspense, lazy, useMemo, useState } from 'react';
import { TEMPLATE_BY_ID } from '../../system/templateManifest.js';
import { readUrlContent } from '../../system/contentModel.js';
import { MUSIC_PRESETS } from '../media/ExperienceMedia.jsx';
import './rebornCreatorEditor.css';

const LegacyCreatorEditor=lazy(()=>import('../../system/CreatorEditor.jsx').then(m=>({default:m.CreatorEditor})));
const PearlArchiveReborn=lazy(()=>import('../pearl/PearlArchiveReborn.jsx').then(m=>({default:m.PearlArchiveReborn})));
const GalaxyConfessionReborn=lazy(()=>import('../galaxy/GalaxyConfessionReborn.jsx').then(m=>({default:m.GalaxyConfessionReborn})));
const MemoryReelReborn=lazy(()=>import('../memory/MemoryReelReborn.jsx').then(m=>({default:m.MemoryReelReborn})));
const InkRegretReborn=lazy(()=>import('../ink/InkRegretReborn.jsx').then(m=>({default:m.InkRegretReborn})));
const QuietRoomReborn=lazy(()=>import('../quiet/QuietRoomReborn.jsx').then(m=>({default:m.QuietRoomReborn})));
const SilkHeritageReborn=lazy(()=>import('../silk/SilkHeritageReborn.jsx').then(m=>({default:m.SilkHeritageReborn})));
const PearlPromiseReborn=lazy(()=>import('../proposal/PearlPromiseReborn.jsx').then(m=>({default:m.PearlPromiseReborn})));

const REBORN_IDS=new Set(['love-pearl','love-galaxy','birthday-memory','apology-ink','apology-quiet','wedding-silk','proposal-pearl']);

function Preview({templateId,content,media}){
  if(templateId==='love-pearl')return <PearlArchiveReborn content={content} media={media} embedded/>;
  if(templateId==='love-galaxy')return <GalaxyConfessionReborn content={content} media={media} embedded/>;
  if(templateId==='birthday-memory')return <MemoryReelReborn content={content} media={media} embedded/>;
  if(templateId==='apology-ink')return <InkRegretReborn content={content} media={media} embedded/>;
  if(templateId==='apology-quiet')return <QuietRoomReborn content={content} media={media} embedded/>;
  if(templateId==='wedding-silk')return <SilkHeritageReborn content={content} media={media} embedded/>;
  if(templateId==='proposal-pearl')return <PearlPromiseReborn content={content} media={media} embedded/>;
  return null;
}

export function RebornCreatorEditor({templateId='love-pearl'}){
  if(!REBORN_IDS.has(templateId))return <LegacyCreatorEditor templateId={templateId}/>;
  const template=TEMPLATE_BY_ID[templateId];
  const base=useMemo(()=>readUrlContent(templateId),[templateId]);
  const [content,setContent]=useState(()=>({...base,musicPreset:base.musicPreset||({
    'love-pearl':'Nocturne','love-galaxy':'Dream','birthday-memory':'Cinema','apology-ink':'Nocturne','apology-quiet':'Nocturne','wedding-silk':'Heritage','proposal-pearl':'Cinema'
  }[templateId]||'Dream'),musicVolume:base.musicVolume??.55}));
  const [media,setMedia]=useState({photos:[],portrait:null,music:null,video:null});
  const [tab,setTab]=useState('edit');
  const set=(key,value)=>setContent(p=>({...p,[key]:value}));
  const setArray=(key,index,value)=>setContent(p=>({...p,[key]:(p[key]||[]).map((v,i)=>i===index?value:v)}));
  const previewName={
    'love-pearl':'Pearl Archive','love-galaxy':'Galaxy Confession','birthday-memory':'Memory Reel','apology-ink':'Ink Regret','apology-quiet':'Quiet Room','wedding-silk':'Silk Heritage','proposal-pearl':'Pearl Promise'
  }[templateId];
  const mediaReady=Boolean(media.music||content.musicPreset)&&media.photos.length>0&&Boolean(media.video);

  return <main className={'reborn-editor tab-'+tab}>
    <nav className="re-tabs"><button className={tab==='edit'?'active':''} onClick={()=>setTab('edit')}>Edit</button><button className={tab==='preview'?'active':''} onClick={()=>setTab('preview')}>Preview</button></nav>
    <aside className="re-panel">
      <header><a href="?">emora<span>.</span></a><div><small>REBORN CREATOR</small><b>{previewName}</b></div></header>
      <div className="re-scroll">
        <section><h3>Story</h3><label><span>Qabul qiluvchi</span><input value={content.recipient||''} onChange={e=>set('recipient',e.target.value)}/></label><label><span>Asosiy matn</span><textarea value={content.message||''} onChange={e=>set('message',e.target.value)}/></label>{(content.paragraphs||[]).slice(0,3).map((x,i)=><label key={i}><span>{i+1}-beat</span><textarea value={x||''} onChange={e=>setArray('paragraphs',i,e.target.value)}/></label>)}<label><span>Final</span><textarea value={content.final||''} onChange={e=>set('final',e.target.value)}/></label></section>
        {template.category==='wedding'&&<section><h3>Event</h3><label><span>Sana / vaqt</span><input type="datetime-local" value={content.eventDate||''} onChange={e=>set('eventDate',e.target.value)}/></label><label><span>Joy nomi</span><input value={content.venueName||''} onChange={e=>set('venueName',e.target.value)}/></label></section>}
        <section className="re-media"><h3>Media · required</h3>
          <label><span>Musiqa preset</span><select value={content.musicPreset} onChange={e=>set('musicPreset',e.target.value)}>{MUSIC_PRESETS.map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="file"><span>Custom musiqa</span><input type="file" accept="audio/*" onChange={e=>setMedia(p=>({...p,music:e.target.files?.[0]||null}))}/><em>{media.music?.name||'preset ishlaydi · MP3/M4A optional'}</em></label>
          <label><span>Music start (sec)</span><input type="number" min="0" value={content.musicStart||0} onChange={e=>set('musicStart',Number(e.target.value)||0)}/></label>
          <label><span>Music volume</span><input type="range" min="0" max="1" step="0.05" value={content.musicVolume??.55} onChange={e=>set('musicVolume',Number(e.target.value))}/><em>{Math.round((content.musicVolume??.55)*100)}%</em></label>
          <label className="file"><span>Rasmlar</span><input type="file" accept="image/*" multiple onChange={e=>setMedia(p=>({...p,photos:Array.from(e.target.files||[]).slice(0,10)}))}/><em>{media.photos.length}/10 · kamida 3 tavsiya</em></label>
          <label className="file"><span>Asosiy video</span><input type="file" accept="video/*" onChange={e=>setMedia(p=>({...p,video:e.target.files?.[0]||null}))}/><em>{media.video?.name||'MP4 / MOV · 1 video'}</em></label>
          <label className="file"><span>Final portret</span><input type="file" accept="image/*" onChange={e=>setMedia(p=>({...p,portrait:e.target.files?.[0]||null}))}/><em>{media.portrait?.name||'optional'}</em></label>
          <div className={'re-media-check '+(mediaReady?'ready':'')}><span>Musiqa {media.music||content.musicPreset?'✓':'—'}</span><span>Rasm {media.photos.length?'✓':'—'}</span><span>Video {media.video?'✓':'—'}</span><b>{mediaReady?'MEDIA READY':'MEDIA TO‘LDIRING'}</b></div>
        </section>
        <section><h3>Captions</h3>{(content.captions||[]).slice(0,3).map((x,i)=><label key={i}><span>{i+1}-caption</span><input value={x||''} onChange={e=>setArray('captions',i,e.target.value)}/></label>)}</section>
      </div>
    </aside>
    <section className="re-preview"><div className="re-preview-head"><div><small>LIVE RECIPIENT PREVIEW</small><b>390 × 844</b></div><span>{content.musicPreset} · {media.photos.length} photos · {media.video?'video ✓':'video —'}</span></div><div className="re-phone"><div className="re-screen"><Suspense fallback={<div className="re-loading">EMORA REBORN</div>}><Preview templateId={templateId} content={content} media={media}/></Suspense></div></div></section>
  </main>;
}
