import { useEffect, useMemo, useRef, useState } from 'react';
import './experienceMedia.css';

export const MUSIC_PRESETS=['Nocturne','Cinema','Dream','Heritage'];

function fileUrl(file){
  if(!file)return null;
  if(typeof file==='string')return file;
  return URL.createObjectURL(file);
}

export function useExperienceMedia(media={}){
  const photos=useMemo(()=>{
    const list=Array.isArray(media.photos)?media.photos.slice(0,10):[];
    return list.map(fileUrl).filter(Boolean);
  },[media.photos]);
  const portrait=useMemo(()=>fileUrl(media.portrait),[media.portrait]);
  const video=useMemo(()=>fileUrl(media.video),[media.video]);
  const music=useMemo(()=>fileUrl(media.music),[media.music]);

  useEffect(()=>()=>{
    const revoke=x=>{if(x&&String(x).startsWith('blob:'))URL.revokeObjectURL(x)};
    photos.forEach(revoke);revoke(portrait);revoke(video);revoke(music);
  },[photos,portrait,video,music]);

  return {photos,portrait,video,music};
}

function presetVoices(ctx,preset){
  const master=ctx.createGain();master.gain.value=.0001;master.connect(ctx.destination);
  const nodes=[];
  const add=(type,freq,gain,detune=0,filterFreq=1200)=>{
    const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();
    o.type=type;o.frequency.value=freq;o.detune.value=detune;
    f.type='lowpass';f.frequency.value=filterFreq;g.gain.value=gain;
    o.connect(f).connect(g).connect(master);o.start();nodes.push(o,g,f);return {o,g,f};
  };
  const map={
    Nocturne:[['sine',110,.13,-7,720],['triangle',165,.055,4,900],['sine',220,.025,0,520]],
    Cinema:[['sawtooth',82.4,.055,-5,420],['triangle',123.5,.075,5,700],['sine',246.9,.025,0,1050]],
    Dream:[['sine',130.8,.085,-9,1100],['sine',196,.065,9,1400],['triangle',261.6,.022,0,1800]],
    Heritage:[['triangle',146.8,.08,-4,800],['sine',220,.05,4,1050],['sine',293.7,.02,0,1600]],
  };
  const defs=map[preset]||map.Nocturne;defs.forEach(d=>add(...d));
  return {master,nodes};
}

export function ExperienceSoundscape({preset='Nocturne',customUrl=null,active=true,startAt=0,volume=.42,className=''}){
  const audioRef=useRef(null),ctxRef=useRef(null),voiceRef=useRef(null);const [muted,setMuted]=useState(false);
  useEffect(()=>{
    if(!active||muted)return;
    if(customUrl){
      const a=new Audio(customUrl);audioRef.current=a;a.loop=true;a.volume=Math.max(0,Math.min(1,volume));a.currentTime=Math.max(0,Number(startAt)||0);
      const play=()=>a.play().catch(()=>{});play();
      const unlock=()=>{play();window.removeEventListener('pointerdown',unlock)};window.addEventListener('pointerdown',unlock,{once:true});
      return()=>{window.removeEventListener('pointerdown',unlock);a.pause();a.src='';audioRef.current=null};
    }
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C();ctxRef.current=ctx;const voices=presetVoices(ctx,preset);voiceRef.current=voices;
    const now=ctx.currentTime;voices.master.gain.cancelScheduledValues(now);voices.master.gain.setValueAtTime(.0001,now);voices.master.gain.exponentialRampToValueAtTime(Math.max(.003,volume*.09),now+1.6);
    const unlock=()=>ctx.resume().catch(()=>{});window.addEventListener('pointerdown',unlock,{once:true});
    return()=>{window.removeEventListener('pointerdown',unlock);try{voices.master.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.2)}catch{};setTimeout(()=>ctx.close().catch(()=>{}),260);ctxRef.current=null;voiceRef.current=null};
  },[preset,customUrl,active,muted,startAt,volume]);

  const toggle=()=>{
    if(audioRef.current)audioRef.current.muted=!audioRef.current.muted;
    if(ctxRef.current){if(muted)ctxRef.current.resume().catch(()=>{});else ctxRef.current.suspend().catch(()=>{})}
    setMuted(x=>!x);
  };
  return <button className={'experience-sound '+className} onClick={toggle} aria-label={muted?'Musiqani yoqish':'Musiqani o‘chirish'}><i className={muted?'muted':''}/><span>{customUrl?'CUSTOM':preset.toUpperCase()}</span></button>;
}

export function ExperienceVideo({src,poster=null,title='Video xotira',autoReveal=false,onEnded,className=''}){
  const [open,setOpen]=useState(autoReveal);
  if(!src)return null;
  return <div className={'experience-video '+(open?'is-open ':'')+className}>
    {!open&&<button className="experience-video-cover" onClick={()=>setOpen(true)} style={poster?{backgroundImage:`url(${poster})`}:undefined} aria-label={title+'ni ochish'}><i/><span>{title}</span><b>PLAY</b></button>}
    {open&&<video src={src} poster={poster||undefined} playsInline controls autoPlay onEnded={onEnded}/>} 
  </div>;
}

export function MediaFilmstrip({photos=[],captions=[],activeIndex=0,className=''}){
  if(!photos.length)return null;
  return <div className={'media-filmstrip '+className}>{photos.slice(0,10).map((src,i)=><figure key={src+i} className={i===activeIndex?'active':''}><img src={src} alt=""/><figcaption><b>{String(i+1).padStart(2,'0')}</b><span>{captions[i]||'Xotira'}</span></figcaption></figure>)}</div>;
}
