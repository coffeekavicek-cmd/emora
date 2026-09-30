import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { TEMPLATE_BY_ID } from '../../system/templateManifest.js';
import { readUrlContent } from '../../system/contentModel.js';
import { supabaseConfigured } from '../../system/supabaseClient.js';
import { getCloudSession, loadDraft, loadPlans, listOrders, onCloudAuthChange, saveDraft, saveDraftMedia, sendMagicLink, signOutCloud } from '../../system/projectPersistence.js';
import { MUSIC_PRESETS } from '../media/ExperienceMedia.jsx';
import { FLAGSHIP_SET } from '../flagships.js';
import './rebornCreatorEditor.css';

const PearlArchiveReborn=lazy(()=>import('../pearl/PearlArchiveReborn.jsx').then(m=>({default:m.PearlArchiveReborn})));
const BalloonDreamReborn=lazy(()=>import('../birthday/BalloonDreamReborn.jsx').then(m=>({default:m.BalloonDreamReborn})));
const AfterRainReborn=lazy(()=>import('../rain/AfterRainReborn.jsx').then(m=>({default:m.AfterRainReborn})));
const SilkHeritageReborn=lazy(()=>import('../silk/SilkHeritageReborn.jsx').then(m=>({default:m.SilkHeritageReborn})));
const PearlPromiseReborn=lazy(()=>import('../proposal/PearlPromiseReborn.jsx').then(m=>({default:m.PearlPromiseReborn})));

function Preview({templateId,content,media}){
  if(templateId==='love-pearl')return <PearlArchiveReborn content={content} media={media} embedded/>;
  if(templateId==='birthday-balloon')return <BalloonDreamReborn content={content} media={media} embedded/>;
  if(templateId==='apology-rain')return <AfterRainReborn content={content} media={media} embedded/>;
  if(templateId==='wedding-silk')return <SilkHeritageReborn content={content} media={media} embedded/>;
  if(templateId==='proposal-pearl')return <PearlPromiseReborn content={content} media={media} embedded/>;
  return <PearlArchiveReborn content={content} media={media} embedded/>;
}

const PRESET={'love-pearl':'Nocturne','wedding-silk':'Heritage','birthday-balloon':'Dream','apology-rain':'Nocturne','proposal-pearl':'Cinema'};
const PREVIEW_NAME={'love-pearl':'Pearl Linen · Private Archive','wedding-silk':'Silk Heritage · The Loom','birthday-balloon':'Balloon Dream · The Room','apology-rain':'After Rain · Glass Confession','proposal-pearl':'Pearl Promise · Private Vault'};
const money=n=>new Intl.NumberFormat('uz-UZ').format(Number(n)||0)+' UZS';

export function RebornCreatorEditor({templateId='love-pearl'}){
  const activeTemplateId=FLAGSHIP_SET.has(templateId)?templateId:'love-pearl';
  const template=TEMPLATE_BY_ID[activeTemplateId]||TEMPLATE_BY_ID['love-pearl'];
  const base=useMemo(()=>readUrlContent(activeTemplateId),[activeTemplateId]);
  const initialSiteId=useMemo(()=>new URLSearchParams(location.search).get('site')||null,[]);
  const [content,setContent]=useState(()=>({...base,musicPreset:base.musicPreset||PRESET[activeTemplateId]||'Dream',musicVolume:base.musicVolume??.55}));
  const [media,setMedia]=useState({photos:[],portrait:null,music:null,video:null});
  const [tab,setTab]=useState('edit');
  const [session,setSession]=useState(null);
  const [email,setEmail]=useState('');
  const [cloudNote,setCloudNote]=useState(supabaseConfigured?'Cloud tekshirilmoqda…':'Cloud env yo‘q · local preview');
  const [siteId,setSiteId]=useState(initialSiteId);
  const [siteSlug,setSiteSlug]=useState(null);
  const [saving,setSaving]=useState(false);
  const [savedAt,setSavedAt]=useState(null);
  const [plans,setPlans]=useState([]);
  const [orders,setOrders]=useState([]);
  const [planCode,setPlanCode]=useState('starter');

  const set=(key,value)=>setContent(p=>({...p,[key]:value}));
  const setArray=(key,index,value)=>setContent(p=>({...p,[key]:(p[key]||[]).map((v,i)=>i===index?value:v)}));
  const previewName=PREVIEW_NAME[activeTemplateId]||template.name;
  const mediaReady=Boolean(media.music||content.musicPreset)&&media.photos.length>0&&Boolean(media.video);
  const paidOrder=orders.find(x=>x.status==='paid');

  useEffect(()=>{
    if(!supabaseConfigured)return;
    let alive=true;
    getCloudSession().then(s=>{if(alive){setSession(s);setCloudNote(s?'Cloud account ulangan':'Email bilan kiring')}}).catch(e=>alive&&setCloudNote(e.message));
    loadPlans().then(x=>alive&&setPlans(x)).catch(()=>{});
    const off=onCloudAuthChange(s=>{if(alive){setSession(s);setCloudNote(s?'Cloud account ulangan':'Email bilan kiring')}});
    return()=>{alive=false;off?.()};
  },[]);

  useEffect(()=>{
    if(!session||!siteId||!supabaseConfigured)return;
    let alive=true;
    setCloudNote('Draft yuklanmoqda…');
    Promise.all([loadDraft(siteId),listOrders(siteId)]).then(([draft,orderRows])=>{
      if(!alive)return;
      if(draft.site.edition!==activeTemplateId){setCloudNote('Bu draft boshqa flagship uchun yaratilgan');return}
      setContent(p=>({...p,...draft.site.content,templateId:activeTemplateId,musicVolume:p.musicVolume??.55}));
      setMedia(draft.media);
      setSiteSlug(draft.site.slug);
      setOrders(orderRows);
      setSavedAt(draft.site.updated_at);
      setCloudNote('Draft cloud’dan yuklandi');
    }).catch(e=>alive&&setCloudNote(e.message));
    return()=>{alive=false};
  },[session,siteId,activeTemplateId]);

  const login=async()=>{
    try{const sent=await sendMagicLink(email);setCloudNote(`${sent} ga kirish linki yuborildi`)}catch(e){setCloudNote(e.message)}
  };
  const logout=async()=>{try{await signOutCloud();setSession(null);setCloudNote('Accountdan chiqildi')}catch(e){setCloudNote(e.message)}};
  const save=async()=>{
    if(!session){setCloudNote('Saqlash uchun avval email bilan kiring');return}
    setSaving(true);setCloudNote('Cloud’ga saqlanmoqda…');
    try{
      const row=await saveDraft({siteId,templateId:activeTemplateId,content:{...content,templateId:activeTemplateId}});
      const nextMedia=await saveDraftMedia({siteId:row.id,media});
      setSiteId(row.id);setSiteSlug(row.slug);setSavedAt(row.updated_at);setMedia(nextMedia);
      const q=new URLSearchParams(location.search);q.set('site',row.id);history.replaceState(null,'',location.pathname+'?'+q.toString());
      const orderRows=await listOrders(row.id);setOrders(orderRows);
      setCloudNote('Draft va media real cloud’da saqlandi ✓');
    }catch(e){setCloudNote(e.message)}finally{setSaving(false)}
  };

  return <main className={'reborn-editor tab-'+tab}>
    <nav className="re-tabs"><button className={tab==='edit'?'active':''} onClick={()=>setTab('edit')}>Edit</button><button className={tab==='preview'?'active':''} onClick={()=>setTab('preview')}>Preview</button></nav>
    <aside className="re-panel">
      <header><a href="?">emora<span>.</span></a><div><small>FLAGSHIP CREATOR · 5/5</small><b>{previewName}</b></div></header>
      <div className="re-scroll">
        <section className="re-cloud"><h3>Cloud project</h3>
          {!supabaseConfigured&&<p>Production Supabase env topilmadi. Preview local ishlaydi.</p>}
          {supabaseConfigured&&!session&&<><label><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><button type="button" onClick={login}>Kirish linkini yuborish</button></>}
          {session&&<div className="re-cloud-user"><span>{session.user.email||'EMORA user'}</span><button type="button" onClick={logout}>Chiqish</button></div>}
          <div className="re-cloud-status"><b>{cloudNote}</b>{siteId&&<span>ID · {siteId.slice(0,8)}…</span>}{siteSlug&&<span>slug · {siteSlug}</span>}{savedAt&&<span>saved · {new Date(savedAt).toLocaleString()}</span>}</div>
          <button type="button" className="re-save" onClick={save} disabled={!supabaseConfigured||saving}>{saving?'Saqlanmoqda…':'Save real draft'}</button>
        </section>

        <section><h3>Story</h3><label><span>Qabul qiluvchi</span><input value={content.recipient||''} onChange={e=>set('recipient',e.target.value)}/></label><label><span>Asosiy matn</span><textarea value={content.message||''} onChange={e=>set('message',e.target.value)}/></label>{(content.paragraphs||[]).slice(0,3).map((x,i)=><label key={i}><span>{i+1}-beat</span><textarea value={x||''} onChange={e=>setArray('paragraphs',i,e.target.value)}/></label>)}<label><span>Final</span><textarea value={content.final||''} onChange={e=>set('final',e.target.value)}/></label></section>
        {template.category==='wedding'&&<section><h3>Event</h3><label><span>Sana / vaqt</span><input type="datetime-local" value={content.eventDate||''} onChange={e=>set('eventDate',e.target.value)}/></label><label><span>Joy nomi</span><input value={content.venueName||''} onChange={e=>set('venueName',e.target.value)}/></label><label><span>Manzil</span><input value={content.venueAddress||''} onChange={e=>set('venueAddress',e.target.value)}/></label></section>}
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

        <section className="re-checkout"><h3>Checkout</h3>
          <p>{paidOrder?'To‘lov tasdiqlangan. Publish gate ochiq.':siteId?'Draft tayyor. Real payment order backend orqali yaratiladi.':'Avval draftni saqlang.'}</p>
          <label><span>Tarif</span><select value={planCode} onChange={e=>setPlanCode(e.target.value)}>{plans.length?plans.map(x=><option value={x.code} key={x.code}>{x.name} · {money(x.price_uzs)}</option>):<><option value="starter">Template · 49 990 UZS</option><option value="plus">Template + AI · 69 990 UZS</option><option value="custom">Custom AI · 199 990 UZS</option></>}</select></label>
          <div className="re-pay-providers"><button type="button" disabled>CLICK</button><button type="button" disabled>PAYME</button></div>
          <small>{paidOrder?`PAID · ${money(paidOrder.amount_uzs)}`:'Merchant credentials ulanmaguncha payment tugmalari aktiv bo‘lmaydi — fake success yo‘q.'}</small>
        </section>
      </div>
    </aside>
    <section className="re-preview"><div className="re-preview-head"><div><small>LIVE RECIPIENT PREVIEW · FLAGSHIP</small><b>390 × 844</b></div><span>{content.musicPreset} · {media.photos.length} photos · {media.video?'video ✓':'video —'}</span></div><div className="re-phone"><div className="re-screen"><Suspense fallback={<div className="re-loading">EMORA FLAGSHIP</div>}><Preview templateId={activeTemplateId} content={content} media={media}/></Suspense></div></div></section>
  </main>;
}
