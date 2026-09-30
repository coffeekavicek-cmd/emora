import { lazy, Suspense, useEffect, useState } from 'react';
import { loadPublishedSite } from '../../system/publicSite.js';

const PearlArchiveReborn=lazy(()=>import('../pearl/PearlArchiveReborn.jsx').then(m=>({default:m.PearlArchiveReborn})));
const BalloonDreamReborn=lazy(()=>import('../birthday/BalloonDreamReborn.jsx').then(m=>({default:m.BalloonDreamReborn})));
const AfterRainReborn=lazy(()=>import('../rain/AfterRainReborn.jsx').then(m=>({default:m.AfterRainReborn})));
const SilkHeritageReborn=lazy(()=>import('../silk/SilkHeritageReborn.jsx').then(m=>({default:m.SilkHeritageReborn})));
const PearlPromiseReborn=lazy(()=>import('../proposal/PearlPromiseReborn.jsx').then(m=>({default:m.PearlPromiseReborn})));

function Experience({templateId,content,media}){
  if(templateId==='love-pearl')return <PearlArchiveReborn content={content} media={media}/>;
  if(templateId==='wedding-silk')return <SilkHeritageReborn content={content} media={media}/>;
  if(templateId==='birthday-balloon')return <BalloonDreamReborn content={content} media={media}/>;
  if(templateId==='apology-rain')return <AfterRainReborn content={content} media={media}/>;
  if(templateId==='proposal-pearl')return <PearlPromiseReborn content={content} media={media}/>;
  return <div className="published-site-state">Bu flagship mavjud emas.</div>;
}

export function PublishedSite({slug}){
  const [state,setState]=useState({loading:true,data:null,error:null});
  useEffect(()=>{
    let alive=true;
    loadPublishedSite(slug).then(data=>{
      if(!alive)return;
      document.title=`EMORA · ${data.site.title||'Story'}`;
      setState({loading:false,data,error:null});
    }).catch(error=>alive&&setState({loading:false,data:null,error:error.message||'Link ochilmadi'}));
    return()=>{alive=false};
  },[slug]);
  if(state.loading)return <div className="published-site-state">EMORA · opening…</div>;
  if(state.error)return <div className="published-site-state"><b>EMORA</b><span>{state.error}</span></div>;
  const {site,content,media}=state.data;
  return <Suspense fallback={<div className="published-site-state">EMORA · loading flagship…</div>}><Experience templateId={site.edition} content={content} media={media}/></Suspense>;
}
