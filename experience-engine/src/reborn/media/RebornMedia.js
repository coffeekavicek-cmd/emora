import { useEffect, useMemo, useRef, useState } from 'react';

const PRESETS={
  Nocturne:{root:146.83,third:174.61,fifth:220,tempo:7.2,filter:720,gain:.035},
  Cinema:{root:110,third:138.59,fifth:164.81,tempo:5.8,filter:980,gain:.04},
  Dream:{root:196,third:246.94,fifth:293.66,tempo:8.6,filter:1350,gain:.027},
  Heritage:{root:130.81,third:164.81,fifth:196,tempo:6.6,filter:860,gain:.032},
};

function fileUrl(file){
  if(!file)return null;
  if(typeof file==='string')return file;
  return URL.createObjectURL(file);
}

export function useMediaAssets(media={}){
  const [urls,setUrls]=useState({cover:null,portrait:null,photos:[],video:null,extraVideo:null,music:null});
  useEffect(()=>{
    const created=[];
    const make=value=>{
      if(!value)return null;
      if(typeof value==='string')return value;
      const u=URL.createObjectURL(value);created.push(u);return u;
    };
    const next={
      cover:make(media.cover||media.coverImage),
      portrait:make(media.portrait),
      photos:(media.photos||[]).map(make).filter(Boolean),
      video:make(media.video),
      extraVideo:make(media.extraVideo),
      music:make(media.music),
    };
    setUrls(next);
    return()=>created.forEach(u=>URL.revokeObjectURL(u));
  },[media.cover,media.coverImage,media.portrait,media.photos,media.video,media.extraVideo,media.music]);
  return urls;
}

class AmbientPreset{
  constructor(name='Nocturne'){
    this.name=PRESETS[name]?name:'Nocturne';this.ctx=null;this.master=null;this.nodes=[];this.timer=null;this.started=false;
  }
  async start(){
    if(this.started)return;this.started=true;
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const cfg=PRESETS[this.name];
    const ctx=new C();this.ctx=ctx;
    const master=ctx.createGain();master.gain.value=.0001;master.connect(ctx.destination);this.master=master;
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=cfg.filter;filter.Q.value=.6;filter.connect(master);this.nodes.push(filter);
    const comp=ctx.createDynamicsCompressor();comp.threshold.value=-28;comp.knee.value=18;comp.ratio.value=3;comp.attack.value=.05;comp.release.value=.7;comp.connect(filter);this.nodes.push(comp);
    const freqs=[cfg.root,cfg.third,cfg.fifth,cfg.root/2];
    freqs.forEach((f,i)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();o.type=i===3?'sine':'triangle';o.frequency.value=f;g.gain.value=i===3?.055:.018;
      o.connect(g).connect(comp);o.start();this.nodes.push(o,g);
    });
    const lfo=ctx.createOscillator(),lfoGain=ctx.createGain();lfo.frequency.value=1/cfg.tempo;lfoGain.gain.value=.014;lfo.connect(lfoGain).connect(master.gain);lfo.start();this.nodes.push(lfo,lfoGain);
    master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(.0001,ctx.currentTime);master.gain.exponentialRampToValueAtTime(cfg.gain,ctx.currentTime+1.8);
  }
  fadeTo(value=.035,duration=.8){
    if(!this.ctx||!this.master)return;const now=this.ctx.currentTime;const v=Math.max(.0001,value);this.master.gain.cancelScheduledValues(now);this.master.gain.setTargetAtTime(v,now,Math.max(.03,duration/4));
  }
  stop(duration=.7){
    if(!this.ctx)return;const ctx=this.ctx,master=this.master;try{master?.gain.setTargetAtTime(.0001,ctx.currentTime,Math.max(.03,duration/4))}catch{}
    setTimeout(()=>{try{this.nodes.forEach(n=>n.stop?.());ctx.close()}catch{}},Math.max(120,duration*1000));this.started=false;
  }
}

export function useRebornSoundtrack({media={},preset='Nocturne',startAt=0}={}){
  const audioRef=useRef(null),ambientRef=useRef(null),[state,setState]=useState({playing:false,muted:false,kind:media.music?'custom':'preset'});

  useEffect(()=>()=>{
    try{audioRef.current?.pause()}catch{}ambientRef.current?.stop(.15);
  },[]);

  const start=async()=>{
    if(state.playing)return;
    if(media.music){
      const src=fileUrl(media.music);const audio=new Audio(src);audio.loop=true;audio.preload='auto';audio.volume=0;audio.currentTime=Math.max(0,Number(startAt)||0);audioRef.current=audio;
      try{await audio.play();let n=0;const t=setInterval(()=>{n++;audio.volume=Math.min(.62,n/14*.62);if(n>=14)clearInterval(t)},60)}catch{}
      setState(s=>({...s,playing:true,kind:'custom'}));return;
    }
    const ambient=new AmbientPreset(preset);ambientRef.current=ambient;await ambient.start();setState(s=>({...s,playing:true,kind:'preset'}));
  };

  const setMuted=muted=>{
    if(audioRef.current)audioRef.current.volume=muted?0:.62;
    ambientRef.current?.fadeTo(muted?.0001:(PRESETS[preset]?.gain||.03),.5);
    setState(s=>({...s,muted}));
  };

  const stop=()=>{
    const a=audioRef.current;if(a){let n=8;const t=setInterval(()=>{n--;a.volume=Math.max(0,n/8*.62);if(n<=0){clearInterval(t);a.pause()}},60)}
    ambientRef.current?.stop(.55);setState(s=>({...s,playing:false}));
  };

  return {state,start,stop,setMuted,toggleMute:()=>setMuted(!state.muted)};
}

export function RebornMediaButton({soundtrack,className=''}){
  if(!soundtrack)return null;
  const {state}=soundtrack;
  return <button className={'rb-media-button '+className} aria-label={state.playing?(state.muted?'Musiqani yoqish':'Musiqani o‘chirish'):'Musiqani boshlash'} onClick={()=>state.playing?soundtrack.toggleMute():soundtrack.start()}>
    <span>{!state.playing?'♪':state.muted?'×':'♫'}</span><i>{!state.playing?'sound':state.muted?'muted':state.kind}</i>
  </button>;
}

export function RebornVideoPortal({src,poster,onClose,title='A private film'}){
  if(!src)return null;
  return <div className="rb-video-portal" role="dialog" aria-modal="true" aria-label={title}>
    <button className="rb-video-close" onClick={onClose} aria-label="Videoni yopish">×</button>
    <div className="rb-video-frame"><video src={src} poster={poster||undefined} controls playsInline autoPlay/></div>
    <span>{title}</span>
  </div>;
}
