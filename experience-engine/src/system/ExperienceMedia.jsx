import { useEffect, useMemo, useRef, useState } from 'react';
import './experienceMedia.css';

export const SOUND_PRESETS=Object.freeze({
  Nocturne:{label:'Nocturne',root:146.83,mode:'minor',tempo:48,texture:'air'},
  Cinema:{label:'Cinema',root:110.00,mode:'minor',tempo:54,texture:'pulse'},
  Dream:{label:'Dream',root:196.00,mode:'major',tempo:58,texture:'glass'},
  Heritage:{label:'Heritage',root:164.81,mode:'minor',tempo:52,texture:'silk'},
});

const SCALE={major:[0,4,7,11],minor:[0,3,7,10]};
const ratio=semi=>Math.pow(2,semi/12);

export function useObjectUrl(value){
  const url=useMemo(()=>{
    if(!value)return null;
    return typeof value==='string'?value:URL.createObjectURL(value);
  },[value]);
  useEffect(()=>()=>{if(value&&typeof value!=='string'&&url)URL.revokeObjectURL(url)},[value,url]);
  return url;
}

export function useObjectUrls(values=[]){
  const list=useMemo(()=>values.map(x=>typeof x==='string'?x:URL.createObjectURL(x)),[values]);
  useEffect(()=>()=>list.forEach((u,i)=>{if(values[i]&&typeof values[i]!=='string')URL.revokeObjectURL(u)}),[values,list]);
  return list;
}

function createProceduralBed(preset='Nocturne',volume=.26){
  const cfg=SOUND_PRESETS[preset]||SOUND_PRESETS.Nocturne;
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
  const ctx=new C();
  const master=ctx.createGain();master.gain.value=.0001;master.connect(ctx.destination);
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=cfg.texture==='glass'?1800:cfg.texture==='pulse'?900:1250;filter.Q.value=.55;filter.connect(master);
  const oscillators=[];const now=ctx.currentTime;
  const semis=SCALE[cfg.mode];
  semis.forEach((semi,i)=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=i===0?'sine':cfg.texture==='glass'?'triangle':'sine';
    o.frequency.value=cfg.root*ratio(semi+(i===3?12:0));
    g.gain.value=i===0?.5:.17;
    o.connect(g).connect(filter);o.start(now);oscillators.push(o);
  });
  const lfo=ctx.createOscillator(),lfoGain=ctx.createGain();
  lfo.type='sine';lfo.frequency.value=cfg.texture==='pulse'?cfg.tempo/60:0.075;lfoGain.gain.value=cfg.texture==='pulse'?.055:.02;
  lfo.connect(lfoGain).connect(master.gain);lfo.start(now);oscillators.push(lfo);
  master.gain.exponentialRampToValueAtTime(Math.max(.015,volume*.11),now+1.6);
  return{
    ctx,master,oscillators,
    stop(){try{const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(Math.max(.0001,master.gain.value),t);master.gain.exponentialRampToValueAtTime(.0001,t+.65);setTimeout(()=>{oscillators.forEach(o=>{try{o.stop()}catch{}});ctx.close()},760)}catch{ctx.close()}},
    setVolume(v){master.gain.setTargetAtTime(Math.max(.0001,v*.11),ctx.currentTime,.18)},
  };
}

export function useExperienceSoundtrack({media,content,autoStart=false,active=true}){
  const customUrl=useObjectUrl(media?.music||null);
  const audioRef=useRef(null),bedRef=useRef(null);
  const [playing,setPlaying]=useState(false);
  const preset=content?.musicPreset||'Nocturne';
  const volume=Math.max(0,Math.min(1,Number(content?.musicVolume??.55)));

  useEffect(()=>()=>{bedRef.current?.stop?.();if(audioRef.current){audioRef.current.pause();audioRef.current.src=''}},[]);
  useEffect(()=>{if(!active)stop()},[active]);

  const play=async()=>{
    if(playing)return;
    if(customUrl){
      const audio=audioRef.current||new Audio();audioRef.current=audio;audio.src=customUrl;audio.loop=true;audio.volume=volume;
      try{await audio.play();setPlaying(true)}catch{}
      return;
    }
    try{bedRef.current=createProceduralBed(preset,volume);setPlaying(Boolean(bedRef.current))}catch{}
  };
  const stop=()=>{
    audioRef.current?.pause();
    if(audioRef.current)audioRef.current.currentTime=0;
    bedRef.current?.stop?.();bedRef.current=null;setPlaying(false);
  };
  const toggle=()=>playing?stop():play();
  useEffect(()=>{if(autoStart&&active){/* browsers require gesture; exposed control remains ready */}},[autoStart,active]);
  useEffect(()=>{if(audioRef.current)audioRef.current.volume=volume;bedRef.current?.setVolume?.(volume)},[volume]);
  return{playing,toggle,play,stop,preset,custom:Boolean(customUrl)};
}

export function MediaChrome({soundtrack,videoUrl=null,onVideo=null,label='sound'}){
  return <div className="em-media-chrome">
    <button className={soundtrack?.playing?'is-on':''} aria-label={soundtrack?.playing?'Musiqani to‘xtatish':'Musiqani yoqish'} onClick={soundtrack?.toggle}>
      <i/>{soundtrack?.playing?'sound on':'sound off'}<b>{soundtrack?.custom?'custom':soundtrack?.preset||label}</b>
    </button>
    {videoUrl&&<button className="em-media-video" aria-label="Videoni ochish" onClick={onVideo}><span>▶</span> video</button>}
  </div>;
}

export function CinematicVideo({src,open,onClose,poster=null,title='Private film'}){
  if(!src||!open)return null;
  return <div className="em-video-modal" role="dialog" aria-modal="true" aria-label={title}>
    <button className="em-video-close" onClick={onClose} aria-label="Videoni yopish">×</button>
    <div className="em-video-frame"><video src={src} poster={poster||undefined} controls playsInline autoPlay/><i/><b/></div>
    <p>{title}</p>
  </div>;
}
