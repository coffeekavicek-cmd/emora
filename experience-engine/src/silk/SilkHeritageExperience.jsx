import { useEffect, useMemo, useRef, useState } from 'react';
import './silkHeritage.css';

const ART='https://emora-v10-fifteen-experiences-production.up.railway.app/assets/silk-heritage-original.jpg';

function formatDate(value){
  if(!value)return {day:'18',month:'OKTABR',time:'18:00',year:'2026'};
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return {day:'18',month:'OKTABR',time:'18:00',year:'2026'};
  const months=['YANVAR','FEVRAL','MART','APREL','MAY','IYUN','IYUL','AVGUST','SENTABR','OKTABR','NOYABR','DEKABR'];
  return {
    day:String(d.getDate()).padStart(2,'0'),
    month:months[d.getMonth()],
    time:d.toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit',hour12:false}),
    year:String(d.getFullYear()),
  };
}

export function SilkHeritageExperience({content,media=null,embedded=false}){
  const cfg=content||{};
  const root=useRef(null);
  const pointer=useRef(null);
  const [veil,setVeil]=useState(0);
  const [opened,setOpened]=useState(false);
  const [page,setPage]=useState(0);
  const [rsvp,setRsvp]=useState('');
  const date=useMemo(()=>formatDate(cfg.eventDate),[cfg.eventDate]);
  const photo=media?.photos?.[0];
  const photoUrl=useMemo(()=>{
    if(!photo)return '';
    return typeof photo==='string'?photo:URL.createObjectURL(photo);
  },[photo]);
  useEffect(()=>()=>{if(photo&&typeof photo!=='string'&&photoUrl)URL.revokeObjectURL(photoUrl)},[photo,photoUrl]);

  const calendarHref=useMemo(()=>{
    if(!cfg.eventDate)return '#';
    const start=new Date(cfg.eventDate);
    if(Number.isNaN(start.getTime()))return '#';
    const end=new Date(start.getTime()+3*60*60*1000);
    const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
      'DTSTART:'+stamp(start),'DTEND:'+stamp(end),
      'SUMMARY:'+(cfg.coupleNames||'EMORA Wedding'),
      'LOCATION:'+((cfg.venueName||'')+' '+(cfg.venueAddress||'')),
      'END:VEVENT','END:VCALENDAR'].join('\r\n');
    return 'data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);
  },[cfg.eventDate,cfg.coupleNames,cfg.venueName,cfg.venueAddress]);

  const down=e=>{
    if(opened||page!==0)return;
    pointer.current={x:e.clientX,start:veil};
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move=e=>{
    if(!pointer.current||opened)return;
    const dx=pointer.current.x-e.clientX;
    setVeil(Math.max(0,Math.min(1,pointer.current.start+dx/230)));
  };
  const up=()=>{
    if(!pointer.current)return;
    pointer.current=null;
    if(veil>.62){setVeil(1);setOpened(true);try{navigator.vibrate?.([10,16,10])}catch{}}
    else setVeil(0);
  };

  const swipe=useRef(null);
  const pageDown=e=>{
    if(!opened)return;
    swipe.current=e.clientX;
  };
  const pageUp=e=>{
    if(swipe.current==null)return;
    const dx=e.clientX-swipe.current;swipe.current=null;
    if(Math.abs(dx)<55)return;
    setPage(p=>Math.max(0,Math.min(3,p+(dx<0?1:-1))));
  };

  useEffect(()=>{
    const onKey=e=>{
      if(!opened)return;
      if(e.key==='ArrowRight')setPage(p=>Math.min(3,p+1));
      if(e.key==='ArrowLeft')setPage(p=>Math.max(0,p-1));
    };
    window.addEventListener('keydown',onKey);
    return()=>window.removeEventListener('keydown',onKey);
  },[opened]);

  const mapHref=cfg.mapLocation
    ? 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(cfg.mapLocation)
    : cfg.venueAddress
      ? 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(cfg.venueAddress)
      : '#';

  return <main ref={root} className={'silk-heritage '+(embedded?'is-embedded ':'')+(opened?' is-open':'')} style={{'--veil':veil,'--page':page}}
    onPointerDown={pageDown} onPointerUp={pageUp}>
    <div className="sh-base" style={{backgroundImage:`linear-gradient(#09221db8,#09221dcc),url(${ART})`}}/>
    <div className="sh-weave"/><div className="sh-light"/>

    <header className="sh-chrome">
      <a href="?">emora<span>.</span></a>
      <small>SILK HERITAGE</small>
      <b>{opened?String(page+1).padStart(2,'0')+'/04':'00'}</b>
    </header>

    <div className="sh-track">
      <section className="sh-page sh-cover">
        <div className="sh-cover-content">
          <p>BIR KUN · BIR AHD · BIR NAQSH</p>
          <div className="sh-embroidered-frame">
            <svg viewBox="0 0 360 520" aria-hidden="true">
              <path d="M34 112 C52 34 130 24 180 62 C230 24 308 34 326 112 M326 112 C345 205 320 290 292 350 C270 398 242 448 180 482 C118 448 90 398 68 350 C40 290 15 205 34 112"/>
              <path d="M66 137 C115 100 142 118 180 157 C218 118 245 100 294 137"/>
              <path d="M87 380 C123 350 151 365 180 399 C209 365 237 350 273 380"/>
            </svg>
            <span className="sh-kicker">TO‘Y TAKLIFNOMASI</span>
            <h1>{cfg.coupleNames||'Aziz & Dilnoza'}</h1>
            <em>{date.day} · {date.month} · {date.year}</em>
          </div>
          <span className="sh-pull-note">{opened?'chapga suring':'ipak chetini chapga suring'}</span>
        </div>

        <div className="sh-veil" style={{transform:'translateX('+(-veil*88)+'%)'}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <div className="sh-veil-fold"/><div className="sh-veil-edge"><i/><i/><i/><i/><i/></div>
          <span>{Math.round(veil*100)}%</span>
        </div>
      </section>

      <section className="sh-page sh-letter">
        <div className="sh-editorial-column">
          <p className="sh-eyebrow">SIZGA ATALGAN TAKLIF</p>
          <h2>Ikki yo‘l bir naqshda uchrashadigan kun.</h2>
          <p className="sh-body">{cfg.message||'Yaqinlarimiz duosi va mehrli nigohi bilan hayotimizning yangi bobini boshlaymiz. Bu kunning qadrli guvohi bo‘lishingizni istaymiz.'}</p>
          <div className="sh-sign">{cfg.coupleNames||'Aziz & Dilnoza'}</div>
        </div>
        <div className="sh-portrait">
          {photoUrl?<img src={photoUrl} alt=""/>:<><span>{(cfg.coupleNames||'A & D').split(/[&+]/).map(x=>x.trim().charAt(0)).join(' · ')}</span><i/></>}
        </div>
      </section>

      <section className="sh-page sh-details">
        <div className="sh-date-block"><strong>{date.day}</strong><span>{date.month}<br/>{date.year}</span></div>
        <div className="sh-detail-copy">
          <p className="sh-eyebrow">MAROSIM</p>
          <h2>{date.time}</h2>
          <h3>{cfg.venueName||'Silk Garden'}</h3>
          <p>{cfg.venueAddress||'Toshkent'}</p>
          <a href={mapHref} target="_blank" rel="noreferrer">xaritada ochish ↗</a>
        </div>
        <div className="sh-thread-orbit" aria-hidden="true"><i/><i/><i/></div>
      </section>

      <section className="sh-page sh-presence">
        <div className="sh-final-ornament" aria-hidden="true"><i/><i/><i/><i/></div>
        <p className="sh-eyebrow">{cfg.guestGreeting||'SIZNI KUTAMIZ'}</p>
        <h2>Bu naqsh siz kelganingizda to‘liq bo‘ladi.</h2>
        {cfg.rsvpEnabled!==false&&<div className="sh-rsvp">
          <span>Ishtirokingizni belgilang</span>
          <div><button className={rsvp==='yes'?'active':''} onClick={()=>setRsvp('yes')}>Albatta</button><button className={rsvp==='no'?'active':''} onClick={()=>setRsvp('no')}>Afsuski yo‘q</button></div>
          {rsvp&&<em>{rsvp==='yes'?'Sizni kutamiz.':'Javobingiz uchun rahmat.'}</em>}
        </div>}
        <div className="sh-actions">
          {cfg.calendarEnabled!==false&&<a href={calendarHref} download="emora-wedding.ics">kalendar +</a>}
          <a href={mapHref} target="_blank" rel="noreferrer">manzil ↗</a>
        </div>
      </section>
    </div>

    {opened&&<nav className="sh-pages" aria-label="Silk pages">{[0,1,2,3].map(i=><button key={i} className={page===i?'active':''} onClick={()=>setPage(i)} aria-label={(i+1)+'-sahifa'}/>)}</nav>}
  </main>;
}
