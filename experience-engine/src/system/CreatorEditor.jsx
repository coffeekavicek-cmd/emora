import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { TEMPLATE_BY_ID } from './templateManifest.js';
import { editorSectionsFor } from './editorContract.js';
import { contentToSearchParams, readUrlContent } from './contentModel.js';
import { EXPERIENCE_MAP } from '../rituals/registry.js';
const PearlArchiveExperience=lazy(()=>import('../reborn/pearl/PearlArchiveExperience.jsx').then(m=>({default:m.PearlArchiveExperience})));
const PearlPromiseExperience=lazy(()=>import('../proposal/PearlPromiseExperience.jsx').then(m=>({default:m.PearlPromiseExperience})));
const CinemaProposalExperience=lazy(()=>import('../proposal/CinemaProposalExperience.jsx').then(m=>({default:m.CinemaProposalExperience})));
const SkyPromiseExperience=lazy(()=>import('../proposal/SkyPromiseExperience.jsx').then(m=>({default:m.SkyPromiseExperience})));
const GalaxyExperience=lazy(()=>import('../galaxy/GalaxyExperience.jsx').then(m=>({default:m.GalaxyExperience})));
const SilkHeritageExperience=lazy(()=>import('../wedding/SilkHeritageExperience.jsx').then(m=>({default:m.SilkHeritageExperience})));
const MemoryReelExperience=lazy(()=>import('../birthday/MemoryReelExperience.jsx').then(m=>({default:m.MemoryReelExperience})));
const AuroraPaperExperience=lazy(()=>import('../birthday/AuroraPaperExperience.jsx').then(m=>({default:m.AuroraPaperExperience})));
const BalloonDreamExperience=lazy(()=>import('../birthday/BalloonDreamExperience.jsx').then(m=>({default:m.BalloonDreamExperience})));
const QuietRoomExperience=lazy(()=>import('../apology/QuietRoomExperience.jsx').then(m=>({default:m.QuietRoomExperience})));
const AfterRainExperience=lazy(()=>import('../apology/AfterRainExperience.jsx').then(m=>({default:m.AfterRainExperience})));
const InkRegretExperience=lazy(()=>import('../apology/InkRegretExperience.jsx').then(m=>({default:m.InkRegretExperience})));
const RoseTheatreExperience=lazy(()=>import('../love/RoseTheatreExperience.jsx').then(m=>({default:m.RoseTheatreExperience})));
const NightGardenExperience=lazy(()=>import('../wedding/NightGardenExperience.jsx').then(m=>({default:m.NightGardenExperience})));
const HeritageNaqshExperience=lazy(()=>import('../wedding/HeritageNaqshExperience.jsx').then(m=>({default:m.HeritageNaqshExperience})));
const CinematicExperience=lazy(()=>import('../cinematic/CinematicExperience.jsx').then(m=>({default:m.CinematicExperience})));
import './creatorEditor.css';

function Field({field,value,onChange,onMedia}){
  const common={id:'field-'+field.key};
  if(field.type==='textarea'){
    return <label className="ce-field" htmlFor={common.id}><span>{field.label}</span>
      <textarea {...common} maxLength={field.max} value={value||''} onChange={e=>onChange(field.key,e.target.value)}/>
    </label>;
  }
  if(field.type==='boolean'){
    return <label className="ce-toggle"><span>{field.label}</span>
      <input type="checkbox" checked={value!==false} onChange={e=>onChange(field.key,e.target.checked)}/><i/>
    </label>;
  }
  if(field.type==='images'){
    return <label className="ce-field ce-file"><span>{field.label}</span><em>3 tagacha</em>
      <input {...common} type="file" accept="image/*" multiple onChange={e=>onMedia('photos',Array.from(e.target.files||[]).slice(0,3))}/>
    </label>;
  }
  if(field.type==='image'){
    return <label className="ce-field ce-file"><span>{field.label}</span><em>1 ta</em>
      <input {...common} type="file" accept="image/*" onChange={e=>onMedia('portrait',e.target.files?.[0]||null)}/>
    </label>;
  }
  if(field.type==='audio'){
    return <label className="ce-field ce-file"><span>{field.label}</span><em>audio</em>
      <input {...common} type="file" accept="audio/*" onChange={e=>onMedia('music',e.target.files?.[0]||null)}/>
    </label>;
  }
  if(field.type==='select'){
    return <label className="ce-field" htmlFor={common.id}><span>{field.label}</span>
      <select {...common} value={value||field.options?.[0]||''} onChange={e=>onChange(field.key,e.target.value)}>
        {(field.options||[]).map(x=><option key={x} value={x}>{x}</option>)}
      </select>
    </label>;
  }
  if(field.type==='text-list')return null;
  if(field.type==='language'){
    return <label className="ce-field" htmlFor={common.id}><span>{field.label}</span>
      <select {...common} value={value||'uz'} onChange={e=>onChange(field.key,e.target.value)}>
        <option value="uz">O‘zbek</option><option value="ru">Русский</option><option value="en">English</option>
      </select>
    </label>;
  }
  return <label className="ce-field" htmlFor={common.id}><span>{field.label}</span>
    <input {...common} type={field.type==='number'?'number':field.type==='datetime'?'datetime-local':'text'}
      maxLength={field.max} value={value||''} onChange={e=>onChange(field.key,e.target.value)}/>
  </label>;
}

function Section({title,fields,content,onChange,onMedia}){
  if(!fields.length)return null;
  return <section className="ce-section"><div className="ce-section-title"><span>{title}</span><i/></div>
    {fields.map(f=><Field key={f.key} field={f} value={content[f.key]} onChange={onChange} onMedia={onMedia}/>)}
  </section>;
}

function PreviewRuntime({template,content,media}){
  if(template.id==='love-pearl')return <Suspense fallback={<div className="ce-runtime-loading">Pearl Archive preview</div>}><PearlArchiveExperience content={content} embedded/></Suspense>;
  if(template.id==='proposal-pearl')return <Suspense fallback={<div className="ce-runtime-loading">3D preview</div>}><PearlPromiseExperience content={content} embedded/></Suspense>;
  if(template.id==='proposal-cinema')return <Suspense fallback={<div className="ce-runtime-loading">Cinema preview</div>}><CinemaProposalExperience content={content} media={media} embedded/></Suspense>;
  if(template.id==='proposal-sky')return <Suspense fallback={<div className="ce-runtime-loading">Sky preview</div>}><SkyPromiseExperience content={content} embedded/></Suspense>;
  if(template.id==='love-galaxy')return <Suspense fallback={<div className="ce-runtime-loading">WebGL preview</div>}><GalaxyExperience content={content} embedded/></Suspense>;
  if(template.id==='wedding-silk')return <Suspense fallback={<div className="ce-runtime-loading">Silk preview</div>}><SilkHeritageExperience content={content} embedded/></Suspense>;
  if(template.id==='birthday-memory')return <Suspense fallback={<div className="ce-runtime-loading">Film preview</div>}><MemoryReelExperience content={content} media={media} embedded/></Suspense>;
  if(template.id==='birthday-aurora')return <Suspense fallback={<div className="ce-runtime-loading">Aurora preview</div>}><AuroraPaperExperience content={content} embedded/></Suspense>;
  if(template.id==='birthday-balloon')return <Suspense fallback={<div className="ce-runtime-loading">Balloon preview</div>}><BalloonDreamExperience content={content} media={media} embedded/></Suspense>;
  if(template.id==='apology-quiet')return <Suspense fallback={<div className="ce-runtime-loading">Quiet preview</div>}><QuietRoomExperience content={content} embedded/></Suspense>;
  if(template.id==='apology-rain')return <Suspense fallback={<div className="ce-runtime-loading">Rain preview</div>}><AfterRainExperience content={content} definition={EXPERIENCE_MAP[template.id]} embedded/></Suspense>;
  if(template.id==='apology-ink')return <Suspense fallback={<div className="ce-runtime-loading">Ink preview</div>}><InkRegretExperience content={content} embedded/></Suspense>;
  if(template.id==='love-rose')return <Suspense fallback={<div className="ce-runtime-loading">Theatre preview</div>}><RoseTheatreExperience content={content} media={media} embedded/></Suspense>;
  if(template.id==='wedding-garden')return <Suspense fallback={<div className="ce-runtime-loading">Garden preview</div>}><NightGardenExperience content={content} embedded/></Suspense>;
  if(template.id==='wedding-naqsh')return <Suspense fallback={<div className="ce-runtime-loading">Naqsh preview</div>}><HeritageNaqshExperience content={content} embedded/></Suspense>;
  const definition=EXPERIENCE_MAP[template.id];
  if(!definition)return <div className="ce-runtime-loading">Runtime unavailable</div>;
  return <Suspense fallback={<div className="ce-runtime-loading">Experience preview</div>}><CinematicExperience definition={definition} content={content} embedded/></Suspense>;
}

export function CreatorEditor({templateId='love-pearl'}){
  const template=TEMPLATE_BY_ID[templateId]||TEMPLATE_BY_ID['love-pearl'];
  const sections=useMemo(()=>editorSectionsFor(template),[template]);
  const base=useMemo(()=>readUrlContent(template.id),[template.id]);
  const [content,setContent]=useState(()=>({
    ...base,
    title:base.title||template.name,
    recipient:base.recipient||'Dilnoza',
    message:base.message||'Senga aytolmay yurgan bir nechta gapim bor.',
    photos:undefined,
    portrait:undefined,
    portraitParticle:'hearts',
    musicStart:0,
    responseEnabled:true,
    saveEnabled:true,
    shareEnabled:true,
  }));
  const [media,setMedia]=useState({photos:[],portrait:null,music:null});
  const [copied,setCopied]=useState(false);
  const [mobileView,setMobileView]=useState('edit');
  const [savedAt,setSavedAt]=useState(null);

  useEffect(()=>{
    const key='emora:draft:'+template.id;
    try{
      const raw=localStorage.getItem(key);
      if(raw){
        const draft=JSON.parse(raw);
        if(draft&&draft.content)setContent(prev=>({...prev,...draft.content}));
      }
    }catch{}
  },[template.id]);

  useEffect(()=>{
    const key='emora:draft:'+template.id;
    const timer=setTimeout(()=>{
      try{
        localStorage.setItem(key,JSON.stringify({content,updatedAt:Date.now()}));
        setSavedAt(new Date());
      }catch{}
    },420);
    return()=>clearTimeout(timer);
  },[content,template.id]);

  const update=(key,value)=>{
    if(key==='photoCaptions')return;
    setContent(prev=>{
      if(key==='recipient')return {...prev,recipient:value};
      if(key==='message')return {...prev,message:value};
      return {...prev,[key]:value};
    });
  };
  const updateMedia=(key,value)=>setMedia(prev=>({...prev,[key]:value}));

  const guestLink=useMemo(()=>{
    const p=contentToSearchParams(content);
    return location.origin+location.pathname+'?'+p.toString();
  },[content]);

  const copyLink=async()=>{
    try{await navigator.clipboard.writeText(guestLink);setCopied(true);setTimeout(()=>setCopied(false),1300)}
    catch{}
  };

  return <main className={'creator-editor mobile-'+mobileView}>
    <nav className="ce-mobile-tabs" aria-label="Editor view">
      <button className={mobileView==='edit'?'active':''} onClick={()=>setMobileView('edit')}>Edit</button>
      <button className={mobileView==='preview'?'active':''} onClick={()=>setMobileView('preview')}>Preview</button>
    </nav>
    <aside className="ce-panel">
      <header className="ce-header"><a href="?">emora<span>.</span></a><div><small>REFERENCE EDITOR</small><b>{template.name}</b><em>{savedAt?'Draft saqlandi':'Draft'}</em></div></header>
      <div className="ce-manifest">
        <span>{template.archetype}</span><span>{template.navigation}</span><span className="ce-release">{template.releaseStatus||'concept'}</span>
        <p>{template.signatureMoment}</p>
      </div>
      <div className="ce-scroll">
        <Section title="Content" fields={sections.content.filter(f=>!['title'].includes(f.key))} content={content} onChange={update} onMedia={updateMedia}/>
        <section className="ce-section">
          <div className="ce-section-title"><span>{template.id==='love-pearl'?'Pearl letter':template.id==='proposal-pearl'?'Proposal story':'Story beats'}</span><i/></div>
          {content.paragraphs.map((x,i)=><label className="ce-field" key={'m'+i}><span>{i+1}-paragraf</span><textarea value={x} onChange={e=>setContent(p=>({...p,paragraphs:p.paragraphs.map((v,n)=>n===i?e.target.value:v)}))}/></label>)}
          {content.captions.map((x,i)=><label className="ce-field" key={'c'+i}><span>{i+1}-vizual caption</span><input value={x} onChange={e=>setContent(p=>({...p,captions:p.captions.map((v,n)=>n===i?e.target.value:v)}))}/></label>)}
          <label className="ce-field"><span>Final jumla</span><textarea value={content.final} onChange={e=>setContent(p=>({...p,final:e.target.value}))}/></label>
        </section>
        <Section title="Media" fields={sections.media.filter(f=>!['photoCaptions'].includes(f.key))} content={content} onChange={update} onMedia={updateMedia}/>
        {(media.photos.length||media.portrait||media.music)&&<div className="ce-media-status"><p>Media hozir live preview uchun local. Publish pipeline ulangach recipient linkka upload qilinadi.</p>
          <div><span>Xotira rasmlari</span><b>{media.photos.length||0}/3</b></div>
          <div><span>Final portret</span><b>{media.portrait?'tayyor':'—'}</b></div>
          <div><span>Musiqa</span><b>{media.music?'tayyor':'—'}</b></div>
        </div>}
        <Section title="Guest actions" fields={sections.guests} content={content} onChange={update} onMedia={updateMedia}/>
        <Section title="Access" fields={sections.access} content={content} onChange={update} onMedia={updateMedia}/>
      </div>
      <footer className="ce-footer">
        <button className="ce-copy" onClick={copyLink}>{copied?'Nusxalandi ✓':'Preview linkni nusxalash'}</button>
        <a className="ce-open" href={guestLink} target="_blank" rel="noreferrer">Recipient preview ↗</a>
      </footer>
    </aside>

    <section className="ce-preview-zone">
      <div className="ce-preview-head"><div><small>LIVE RECIPIENT PREVIEW</small><b>390 × 844</b></div><span>manifest-driven</span></div>
      <div className="ce-phone">
        <div className="ce-phone-screen"><PreviewRuntime template={template} content={content} media={media}/></div>
      </div>
      <div className="ce-preview-note">
        <b>Signature moment</b>
        <p>{template.signatureMoment}</p>
      </div>
    </section>
  </main>;
}
