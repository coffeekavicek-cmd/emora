import { useMemo, useState } from 'react';
import { TEMPLATE_BY_ID } from './templateManifest.js';
import { editorSectionsFor } from './editorContract.js';
import { contentToSearchParams, readUrlContent } from './contentModel.js';
import { PearlMotionExperience } from '../pearl/PearlMotionExperience.jsx';
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

  return <main className="creator-editor">
    <aside className="ce-panel">
      <header className="ce-header"><a href="?">emora<span>.</span></a><div><small>REFERENCE EDITOR</small><b>{template.name}</b></div></header>
      <div className="ce-manifest">
        <span>{template.archetype}</span><span>{template.navigation}</span>
        <p>{template.signatureMoment}</p>
      </div>
      <div className="ce-scroll">
        <Section title="Content" fields={sections.content.filter(f=>!['title'].includes(f.key))} content={content} onChange={update} onMedia={updateMedia}/>
        <section className="ce-section">
          <div className="ce-section-title"><span>Pearl letter</span><i/></div>
          {content.paragraphs.map((x,i)=><label className="ce-field" key={'m'+i}><span>{i+1}-paragraf</span><textarea value={x} onChange={e=>setContent(p=>({...p,paragraphs:p.paragraphs.map((v,n)=>n===i?e.target.value:v)}))}/></label>)}
          {content.captions.map((x,i)=><label className="ce-field" key={'c'+i}><span>{i+1}-polaroid izohi</span><input value={x} onChange={e=>setContent(p=>({...p,captions:p.captions.map((v,n)=>n===i?e.target.value:v)}))}/></label>)}
          <label className="ce-field"><span>Final jumla</span><textarea value={content.final} onChange={e=>setContent(p=>({...p,final:e.target.value}))}/></label>
        </section>
        <Section title="Media" fields={sections.media.filter(f=>!['photoCaptions'].includes(f.key))} content={content} onChange={update} onMedia={updateMedia}/>
        <Section title="Guest actions" fields={sections.guests} content={content} onChange={update} onMedia={updateMedia}/>
        <Section title="Access" fields={sections.access} content={content} onChange={update} onMedia={updateMedia}/>
      </div>
      <footer className="ce-footer">
        <button className="ce-copy" onClick={copyLink}>{copied?'Nusxalandi ✓':'Guest linkni nusxalash'}</button>
        <a className="ce-open" href={guestLink} target="_blank" rel="noreferrer">Recipient mode ↗</a>
      </footer>
    </aside>

    <section className="ce-preview-zone">
      <div className="ce-preview-head"><div><small>LIVE RECIPIENT PREVIEW</small><b>390 × 844</b></div><span>manifest-driven</span></div>
      <div className="ce-phone">
        <div className="ce-phone-screen"><PearlMotionExperience content={content} media={media}/></div>
      </div>
      <div className="ce-preview-note">
        <b>Signature moment</b>
        <p>{template.signatureMoment}</p>
      </div>
    </section>
  </main>;
}
