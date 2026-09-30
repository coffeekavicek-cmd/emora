import { useEffect, useMemo, useRef, useState } from 'react';

export function useMediaUrls(media={}){
  const urls=useMemo(()=>{
    const make=v=>{
      if(!v)return null;
      if(typeof v==='string')return v;
      try{return URL.createObjectURL(v)}catch{return null}
    };
    return {
      photos:(media.photos||[]).map(make).filter(Boolean),
      portrait:make(media.portrait),
      music:make(media.music),
      video:make(media.video),
    };
  },[media]);

  useEffect(()=>()=>{
    const revoke=u=>{if(u&&u.startsWith('blob:'))try{URL.revokeObjectURL(u)}catch{}};
    urls.photos.forEach(revoke);revoke(urls.portrait);revoke(urls.music);revoke(urls.video);
  },[urls]);

  return urls;
}

const PRESETS={
  Nocturne:{root:146.83,intervals:[0,7,12],tempo:0.145,wave:'sine'},
  Cinema:{root:110,intervals:[0,5,12],tempo:0.115,wave:'triangle'},
  Dream:{root:174.61,intervals:[0,4,9],tempo:0.18,wave:'sine'},
  Heritage:{root:130.81,intervals:[0,7,10],tempo:0.13,wave:'triangle'},
};

function freq(root,semitones){return root*Math.pow(2,semitones/12)}

export function ExperienceSoundtrack({preset='Nocturne',file=null,startAt=0,className=''}){
  const audioRef=useRef(null),ctxRef=useRef(null),nodesRef=useRef([]),pulseRef=useRef(null);
  const [on,setOn]=useState(false);

  const stopSynth=()=>{
    if(pulseRef.current)clearInterval(pulseRef.current);pulseRef.current=null;
    nodesRef.current.forEach(n=>{try{n.stop?.();n.disconnect?.()}catch{}});nodesRef.current=[];
    try{ctxRef.current?.close?.()}catch{}ctxRef.current=null;
  };

  const startSynth=()=>{
    stopSynth();
    try{
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
      const ctx=new C();ctxRef.current=ctx;
      const cfg=PRESETS[preset]||PRESETS.Nocturne;
      const master=ctx.createGain(),filter=ctx.createBiquadFilter();
      master.gain.value=.028;filter.type='lowpass';filter.frequency.value=900;filter.Q.value=.5;
      master.connect(filter).connect(ctx.destination);
      cfg.intervals.forEach((semi,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();o.type=cfg.wave;o.frequency.value=freq(cfg.root,semi);g.gain.value=.16/(i+1);o.connect(g).connect(master);o.start();nodesRef.current.push(o,g);
      });
      let step=0;
      pulseRef.current=setInterval(()=>{
        if(!ctxRef.current)return;step++;
        const now=ctx.currentTime;
        master.gain.cancelScheduledValues(now);master.gain.setValueAtTime(master.gain.value,now);
        master.gain.linearRampToValueAtTime(.04+(step%3)*.004,now+.45);
        master.gain.linearRampToValueAtTime(.022,now+2.8);
        filter.frequency.cancelScheduledValues(now);filter.frequency.setValueAtTime(760,now);filter.frequency.linearRampToValueAtTime(1050+(step%4)*90,now+1.6);
      },Math.round(5200*(1.15-cfg.tempo)));
    }catch{}
  };

  const toggle=async()=>{
    if(file){
      const a=audioRef.current;if(!a)return;
      if(on){a.pause();setOn(false)}else{try{a.currentTime=Math.max(0,Number(startAt)||0);await a.play();setOn(true)}catch{}}
      return;
    }
    if(on){stopSynth();setOn(false)}else{startSynth();setOn(true)}
  };

  useEffect(()=>()=>stopSynth(),[]);
  useEffect(()=>{if(!file||!audioRef.current)return;const a=audioRef.current;const end=()=>setOn(false);a.addEventListener('ended',end);return()=>a.removeEventListener('ended',end)},[file]);

  return <div className={'emora-soundtrack '+className}>
    {file&&<audio ref={audioRef} src={file} preload="metadata"/>}
    <button type="button" className={on?'is-on':''} onClick={toggle} aria-label={on?'Musiqani to‘xtatish':'Musiqani yoqish'}>
      <i/><span>{on?'sound on':'sound off'}</span><b>{file?'CUSTOM':preset.toUpperCase()}</b>
    </button>
  </div>;
}

export function MediaVideo({src,poster=null,className='',onEnded}){
  if(!src)return null;
  return <video className={className} src={src} poster={poster||undefined} playsInline controls preload="metadata" onEnded={onEnded}/>;
}
