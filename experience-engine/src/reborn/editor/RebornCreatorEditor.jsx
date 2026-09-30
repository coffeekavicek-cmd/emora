import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { TEMPLATE_BY_ID } from '../../system/templateManifest.js';
import { readUrlContent } from '../../system/contentModel.js';
import { supabaseConfigured } from '../../system/supabaseClient.js';
import { beginCheckout, getCloudSession, loadDraft, loadPlans, listOrders, onCloudAuthChange, publishPaidSite, saveDraft, saveDraftMedia, sendMagicLink, signOutCloud } from '../../system/projectPersistence.js';
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
  const [siteStatus,setSiteStatus]=useState('draft');
  const [saving,setSaving]=useState(false);
  const [savedAt,setSavedAt]=useState(null);
  const [plans,setPlans]=useState([]);
  const [orders,setOrders]=useState([]);
  const [planCode,setPlanCode]=useState('starter');
  const [checkoutBusy,setCheckoutBusy]=useState(false);
  const [publishedUrl,setPublishedUrl]=useState(null);

  const set=(key,value)=>setContent(p=>({...p,[key]:value}));
  const setArray=(key,index,value)=>setContent(p=>({...p,[key]:(p[key]||[]).map((v,i)=>i===index?value:v)}));
  const previewName=PREVIEW_NAME[activeTemplateId]||template.name;
  const mediaReady=Boolean(media.music||content.musicPreset)&&media.photos.length>0&&Boolean(media.video);
  const paidOrder=orders.find(x=>x.status==='paid');
  const processingOrder=orders.find(x=>x.status==='processing');
  const projectLocked=siteStatus==='published'||Boolean(processingOrder);

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
    let alive=true;setCloudNote('Draft yuklanmoqda…');
    Promise.all([loadDraft(siteId),listOrders(siteId)]).then(([draft,orderRows])=>{
      if(!alive)return;
      if(draft.site.edition!==activeTemplateId){setCloudNote('Bu draft boshqa flagship uchun yaratilgan');return}
      setContent(p=>({...p,...draft.site.content,templateId:activeTemplateId,musicVolume:p.musicVolume??.55}));
      setMedia(draft.media);
      setSiteSlug(draft.site.slug);
      setSiteStatus(draft.site.status||'draft');
      setOrders(orderRows);
      setSavedAt(draft.site.updated_at);
      if(draft.site.status==='published')setPublishedUrl(`${location.origin}${location.pathname}?site=${encodeURIComponent(draft.site.slug)}`);
      else setPublishedUrl(null);
      const returned=new URLSearchParams(location.search).get('checkout')==='return';
      const active=orderRows.find(x=>x.status==='processing');
      const paid=orderRows.find(x=>x.status==='paid');
      if(draft.site.status==='published')setCloudNote('Published · loyiha read-only');
      else if(paid)setCloudNote('Payment tasdiqlangan · publish tayyor');
      else if(active)setCloudNote('Payment processing · edit vaqtincha qulflangan');
      else setCloudNote(returned?'Payment status yangilandi':'Draft cloud’dan yuklandi');
    }).catch(e=>alive&&setCloudNote(e.message));
    return()=>{alive=false};
  },[session,siteId,activeTemplateId]);

  const login=async()=>{try{const sent=await sendMagicLink(email);setCloudNote(`${sent} ga kirish linki yuborildi`)}catch(e){setCloudNote(e.message)}};
  const logout=async()=>{try{await signOutCloud();setSession(null);setCloudNote('Accountdan chiqildi')}catch(e){setCloudNote(e.message)}};
  const save=async()=>{
    if(projectLocked){setCloudNote(siteStatus==='published'?'Published loyiha read-only.':'Payment processing paytida edit yopiq.');return}
    if(!session){setCloudNote('Saqlash uchun avval email bilan kiring');return}
    setSaving(true);setCloudNote('Cloud’ga saqlanmoqda…');
    try{
      const row=await saveDraft({siteId,templateId:activeTemplateId,content:{...content,templateId:activeTemplateId}});
      const nextMedia=await saveDraftMedia({siteId:row.id,media});
      setSiteId(row.id);setSiteSlug(row.slug);setSiteStatus(row.status||'draft');setSavedAt(row.updated_at);setMedia(nextMedia);
      const q=new URLSearchParams(location.search);q.set('site',row.id);history.replaceState(null,'',location.pathname+'?'+q.toString());
      setOrders(await listOrders(row.id));setCloudNote('Draft va media real cloud’da saqlandi ✓');
    }catch(e){setCloudNote(e.message)}finally{setSaving(false)}
  };
  const checkout=async provider=>{
    if(projectLocked){setCloudNote(siteStatus==='published'?'Bu loyiha allaqachon published.':'Aktiv payment tugamaguncha yangi checkout ochilmaydi.');return}
    if(!session){setCloudNote('To‘lov uchun avval email bilan kiring');return}
    if(!siteId){setCloudNote('To‘lovdan oldin draftni saqlang');return}
    if(!mediaReady){setCloudNote('To‘lovdan oldin rasm + video + musiqa tayyor bo‘lsin');return}
    setCheckoutBusy(true);setCloudNote(`${provider.toUpperCase()} checkout tayyorlanmoqda…`);
    try{const data=await beginCheckout({siteId,planCode,provider});location.assign(data.checkoutUrl)}catch(e){setCloudNote(e.message);setCheckoutBusy(false)}
  };
  const publish=async()=>{
    if(!siteId||!paidOrder||siteStatus==='published')return;
    setCheckoutBusy(true);setCloudNote('Media public storage’ga ko‘chirilmoqda…');
    try{
      const data=await publishPaidSite(siteId);
      setPublishedUrl(data.url);setSiteStatus('published');setCloudNote('Published ✓ unique link tayyor');setOrders(await listOrders(siteId));
    }catch(e){setCloudNote(e.message)}finally{setCheckoutBusy(false)}
  };

  const lockClass=siteStatus==='published'?' is-published':processingOrder?' is-processing':'';
  return <main className={'reborn-editor tab-'+tab+lockClass}>
    <nav className="re-tabs"><button className={tab==='edit'?'active':''} onClick={()=>setTab('edit')}>Edit</button><button className={tab==='preview'?'active':''} onClick={()=>setTab('preview')}>Preview</button></nav>
    <aside className="re-panel">
      <header><a href="?">emora<span>.</span></a><div><small>FLAGSHIP CREATOR · 5/5</small><b>{previewName}</b></div></header>
      <div className="re-scroll">
        <section className="re-cloud"><h3>Cloud project</h3>
          {!supabaseConfigured&&<p>Production Supabase env topilmadi. Preview local ishlaydi.</p>}
          {supabaseConfigured&&!session&&<><label><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><button type="button" onClick={login}>Kirish linkini yuborish</button></>}
          {session&&<div className="re-cloud-user"><span>{session.user.email||'EMORA user'}</span><button type="button" onClick={logout}>Chiqish</button></div>}
          {projectLocked&&<div className={'re-lock-note '+(siteStatus==='published'?'published':'processing')}><b>{siteStatus==='published'?'PUBLISHED · READ ONLY':'PAYMENT PROCESSING'}</b><span>{siteStatus==='published'?'Live versiya o‘zgarmaydi. Yangi tahrir uchun keyingi revision flow ishlatiladi.':'Provider tranzaksiyasi tugamaguncha story va media o‘zgarmaydi.'}</span></div>}
          <div className="re-cloud-status"><b>{cloudNote}</b>{siteId&&<span>ID · {siteId.slice(0,8)}…</span>}{siteSlug&&<span>slug · {siteSlug}</span>}{savedAt&&<span>saved · {new Date(savedAt).toLocaleString()}</span>}</div>
          <button type="button" className="re-save" onClick={save} disabled={!supabaseConfigured||saving||projectLocked}>{projectLocked?'Project locked':saving?'Saqlanmoqda…':'Save real draft'}</button>
        </section>

        <section><h3>Story</h3><label><span>Qabul qiluvchi</span><input value={content.recipient||''} onChange={e=>set('recipient',e.target.value)}/></label><label><span>Asosiy matn</span><textarea value={content.message||''} onChange={e=>set('message',e.target.value)}/></label>{(content.paragraphs||[]).slice(0,3).map((x,i)=><label key={i}><span>{i+1}-beat</span><textarea value={x||''} onChange={e=>setArray('paragraphs',i,e.target.value)}/></label>)}<label><span>Final</span><textarea value={content.final||''} onChange={e=>set('final',e.target.value)}/></label></section>
        {template.category==='wedding'&&<section><h3>Event</h3><label><span>Sana / vaqt</span><input type="datetime-local" value={content.eventDate||''} onChange={e=>set('eventDate',e.target.value)}/></label><label><span>Joy nomi</span><input value={content.venueName||''} onChange={e=>set('venueName',e.target.value)}/></label><label><span>Manzil</span><input value={content.venueAddress||''} onChange={e=>set('venueAddress',e.target.value)}/></label></section>}
        <section className="re-media"><h3>Media · required</h3>
          <label><span>Musiqa preset</span><select value={content.musicPreset} onChange={e=>set('musicPreset',e.target.value)}>{MUSIC_PRESETS.map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="file"><span>Custom musiqa</span><input type="file" accept="audio/*" onChange={e=>setMedia(p=>({...p,music:e.target.files?.[0]||null}))}/><em>{typeof media.music==='string'?'cloud music ✓':media.music?.name||'preset ishlaydi · MP3/M4A optional'}</em></label>
          <label><span>Music start (sec)</span><input type="number" min="0" value={content.musicStart||0} onChange={e=>set('musicStart',Number(e.target.value)||0)}/></label>
          <label><span>Music volume</span><input type="range" min="0" max="1" step="0.05" value={content.musicVolume??.55} onChange={e=>set('musicVolume',Number(e.target.value))}/><em>{Math.round((content.musicVolume??.55)*100)}%</em></label>
          <label className="file"><span>Rasmlar</span><input type="file" accept="image/*" multiple onChange={e=>setMedia(p=>({...p,photos:Array.from(e.target.files||[]).slice(0,10)}))}/><em>{media.photos.length}/10 · kamida 3 tavsiya</em></label>
          <label className="file"><span>Asosiy video</span><input type="file" accept="video/*" onChange={e=>setMedia(p=>({...p,video:e.target.files?.[0]||null}))}/><em>{typeof media.video==='string'?'cloud video ✓':media.video?.name||'MP4 / MOV · 1 video'}</em></label>
          <label className="file"><span>Final portret</span><input type="file" accept="image/*" onChange={e=>setMedia(p=>({...p,portrait:e.target.files?.[0]||null}))}/><em>{typeof media.portrait==='string'?'cloud portrait ✓':media.portrait?.name||'optional'}</em></label>
          <div className={'re-media-check '+(mediaReady?'ready':'')}><span>Musiqa {media.music||content.musicPreset?'✓':'—'}</span><span>Rasm {media.photos.length?'✓':'—'}</span><span>Video {media.video?'✓':'—'}</span><b>{mediaReady?'MEDIA READY':'MEDIA TO‘LDIRING'}</b></div>
        </section>
        <section><h3>Captions</h3>{(content.captions||[]).slice(0,3).map((x,i)=><label key={i}><span>{i+1}-caption</span><input value={x||''} onChange={e=>setArray('captions',i,e.target.value)}/></label>)}</section>

        <section className="re-checkout"><h3>Checkout</h3>
          <p>{siteStatus==='published'?'Published. Unique recipient link tayyor.':paidOrder?'To‘lov tasdiqlangan. Publish gate ochiq.':processingOrder?`${processingOrder.provider?.toUpperCase()} payment processing. Edit vaqtincha qulflangan.`:siteId?'Draft tayyor. Provider order serverda yaratiladi.':'Avval draftni saqlang.'}</p>
          {siteStatus!=='published'&&!processingOrder&&!paidOrder&&<label><span>Tarif</span><select value={planCode} onChange={e=>setPlanCode(e.target.value)}>{plans.length?plans.map(x=><option value={x.code} key={x.code}>{x.name} · {money(x.price_uzs)}</option>):<><option value="starter">Template · 49 990 UZS</option><option value="plus">Template + AI · 69 990 UZS</option><option value="custom">Custom AI · 199 990 UZS</option></>}</select></label>}
          {siteStatus!=='published'&&!paidOrder&&!processingOrder&&<div className="re-pay-providers"><button type="button" disabled={!siteId||!session||!mediaReady||checkoutBusy} onClick={()=>checkout('click')}>CLICK</button><button type="button" disabled={!siteId||!session||!mediaReady||checkoutBusy} onClick={()=>checkout('payme')}>PAYME</button></div>}
          {processingOrder&&<div className="re-payment-state"><b>PROCESSING</b><span>{processingOrder.provider?.toUpperCase()} · {money(processingOrder.amount_uzs)}</span></div>}
          {paidOrder&&siteStatus!=='published'&&<button type="button" className="re-publish" disabled={checkoutBusy} onClick={publish}>{checkoutBusy?'Publishing…':'Publish paid site'}</button>}
          {publishedUrl&&<a className="re-live-link" href={publishedUrl} target="_blank" rel="noreferrer">OPEN UNIQUE LINK ↗</a>}
          <small>{siteStatus==='published'?'Live versiya client edit’dan himoyalangan.':paidOrder?`PAID · ${money(paidOrder.amount_uzs)} · ${paidOrder.provider?.toUpperCase()}`:processingOrder?'Provider callback statusni yakunlaydi.':'Merchant credential bo‘lmasa server payment URL bermaydi — fake success yo‘q.'}</small>
        </section>
      </div>
    </aside>
    <section className="re-preview"><div className="re-preview-head"><div><small>LIVE RECIPIENT PREVIEW · FLAGSHIP</small><b>390 × 844</b></div><span>{content.musicPreset} · {media.photos.length} photos · {media.video?'video ✓':'video —'}</span></div><div className="re-phone"><div className="re-screen"><Suspense fallback={<div className="re-loading">EMORA FLAGSHIP</div>}><Preview templateId={activeTemplateId} content={content} media={media}/></Suspense></div></div></section>
  </main>;
}
