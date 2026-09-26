/* EMORA V9 · seven signature cinematic experiences; no paid video required */
(function () {
  'use strict';
  const key = (location.pathname.match(/\/templates\/([a-z-]+)\.html$/) || [])[1];
  const designs = {
    'love-rose': {scene:'rose',eyebrow:'LOVE CINEMA / 01',title:'Har bir sevgi — alohida film.',subtitle:'Parda ochilgach, faqat sizga tegishli hikoya boshlanadi.',cta:'Filmni boshlash'},
    'love-pearl': {scene:'linen',eyebrow:'LOVE CINEMA / 02',title:'Eng samimiy gaplar maktubda.',subtitle:'Yorug‘ qog‘oz, marvarid ranglar va yurakdan kelgan so‘zlar.',cta:'Maktubni ochish'},
    'wedding-silk': {scene:'silk',eyebrow:'WEDDING / 01',title:'Eng go‘zal kunimizga xush kelibsiz.',subtitle:'Ipak, oltin muhr va mehmoningiz uchun shaxsiy taklifnoma.',cta:'Muhrni ochish'},
    'wedding-garden': {scene:'garden',eyebrow:'WEDDING / 02',title:'Yulduzlar ostida uchrashguncha.',subtitle:'Bog‘ eshiklari ochiladi. Sizni unutilmas oqshom kutmoqda.',cta:'Bog‘ga kirish'},
    'birthday-aurora': {scene:'aurora',eyebrow:'BIRTHDAY / 01',title:'Bir quti quvonch. Mingta tilak.',subtitle:'Sovg‘ani oching va bayram hikoyasiga qadam qo‘ying.',cta:'Sovg‘ani ochish'},
    'apology-rain': {scene:'rain',eyebrow:'APOLOGY / 01',title:'Yomg‘irdan keyin ham yorug‘lik bor.',subtitle:'Har bir so‘zga vaqt va e’tibor ajratilgan samimiy maktub.',cta:'Maktubni o‘qish'},
    'proposal-pearl': {scene:'promise',eyebrow:'PROPOSAL / 01',title:'Bitta savol. Butun umr.',subtitle:'Uzuk qutisi ochilganda eng muhim savol boshlanadi.',cta:'Qutini ochish'}
  };
  const spec = designs[key];
  if (!spec) return;
  const $ = (selector, parent=document) => parent.querySelector(selector);
  const $$ = (selector, parent=document) => Array.from(parent.querySelectorAll(selector));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isWedding = key.indexOf('wedding-') === 0;
  const state = {config:{},current:0,opened:false,audio:null,musicButton:null,target:null,timer:null};
  const scenes = $$('.scene');
  function artifact() {
    switch(spec.scene) {
      case 'silk': return '<div class="em-xp-envelope-back"></div><div class="em-xp-envelope-front"></div><div class="em-xp-envelope-flap"></div><div class="em-xp-wax"></div>';
      case 'garden': return '<div class="em-xp-garden-arch"></div><div class="em-xp-garden-gate left"></div><div class="em-xp-garden-gate right"></div>';
      case 'rose': return '<div class="em-xp-film"></div><div class="em-xp-curtain left"></div><div class="em-xp-curtain right"></div>';
      case 'linen': return '<div class="em-xp-letter"></div><div class="em-xp-letter-flap"></div>';
      case 'aurora': return '<div class="em-xp-gift-box"></div><div class="em-xp-gift-lid"></div>';
      case 'rain': return '<div class="em-xp-rain-glass"></div>';
      case 'promise': return '<div class="em-xp-jewel-base"></div><div class="em-xp-jewel-ring"></div><div class="em-xp-jewel-lid"></div>';
    }
    return '';
  }
  function safeMedia(value) {
    if (typeof value !== 'string') return '';
    try {
      const u = new URL(value, location.href);
      return u.protocol === 'https:' || (u.protocol === 'blob:' && u.origin === location.origin) ? u.href : '';
    } catch { return ''; }
  }
  function safeMap(value) {
    if (typeof value !== 'string') return '';
    try {
      const u=new URL(value);
      const host=u.hostname.toLowerCase();
      return u.protocol === 'https:' && (
        host==='google.com' || host.endsWith('.google.com') ||
        host==='maps.app.goo.gl' || host==='yandex.uz' ||
        host==='yandex.com' || host.endsWith('.yandex.com') ||
        host==='2gis.uz' || host==='2gis.com' || host.endsWith('.2gis.com')
      ) ? u.href : '';
    } catch { return ''; }
  }
  const portal = document.createElement('div');
  portal.className='em-xp-portal';
  portal.dataset.scene=spec.scene;
  portal.setAttribute('role','dialog');
  portal.setAttribute('aria-modal','true');
  portal.setAttribute('aria-label',spec.title);
  portal.innerHTML='<div class="em-xp-backdrop"></div><div class="em-xp-scrim"></div>' +
    '<div class="em-xp-particles" aria-hidden="true"></div>' +
    '<div class="em-xp-topline"><strong>emora</strong><small>'+spec.eyebrow+'</small><button type="button" class="em-xp-skip">O‘tkazib yuborish ↗</button></div>' +
    '<div class="em-xp-center"><div class="em-xp-artifact" aria-hidden="true">'+artifact()+'</div></div>' +
    '<div class="em-xp-caption"><div class="em-xp-kicker">'+spec.eyebrow+'</div><h2>'+spec.title+'</h2><p>'+spec.subtitle+'</p><button type="button" class="em-xp-open">'+spec.cta+' ↗</button></div>';
  const heroPhoto = $('.hero-media');
  if (heroPhoto) {
    const current=getComputedStyle(heroPhoto).backgroundImage;
    if(current && current !== 'none') portal.style.setProperty('--xp-photo',current);
  }
  const particles=$('.em-xp-particles',portal);
  for(let i=0;i<(reduceMotion?0:22);i++){
    const p=document.createElement('i');
    p.style.setProperty('--x',(3+(i*37)%94)+'%');
    p.style.setProperty('--y',(7+(i*23)%88)+'%');
    p.style.setProperty('--sz',(2+i%5)+'px');
    p.style.setProperty('--alpha',String(.18+(i%7)*.09));
    p.style.setProperty('--blur',i%4===0?'2px':'0px');
    p.style.setProperty('--tx',((i%2?-1:1)*(10+i*3))+'px');
    p.style.setProperty('--dur',(3+(i%5))+'s');
    p.style.setProperty('--delay',(-i*.37)+'s');
    particles.appendChild(p);
  }
  document.body.appendChild(portal);
  const beforeOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const startButton=$('.em-xp-open',portal);
  function finish(skip) {
    if(state.opened)return;
    state.opened=true;
    const art=$('.em-xp-artifact',portal);
    art.classList.add('is-open');
    portal.classList.add('is-open');
    const wait=skip||reduceMotion?0:spec.scene==='silk'||spec.scene==='promise'?1450:1150;
    setTimeout(()=>{
      portal.classList.add('is-finished');
      document.body.style.overflow=beforeOverflow;
      setTimeout(()=>{portal.hidden=true;const first=$('.hero h1');if(first){first.setAttribute('tabindex','-1');first.focus({preventScroll:true})}},reduceMotion?0:850);
    },wait);
  }
  startButton.addEventListener('click',()=>finish(false));
  $('.em-xp-skip',portal).addEventListener('click',()=>finish(true));
  document.addEventListener('keydown',e=>{
    if(!portal.hidden && e.key==='Escape')finish(true);
  });
  startButton.focus({preventScroll:true});
  function replay(){
    portal.hidden=false;portal.classList.remove('is-finished','is-open');
    $('.em-xp-artifact',portal).classList.remove('is-open');
    state.opened=false;document.body.style.overflow='hidden';
    startButton.focus({preventScroll:true});
  }
  // A six-chapter navigation rail; content is visible without JavaScript as well.
  if(scenes.length){
    const nav=document.createElement('div');
    nav.className='em-xp-chapter';
    nav.setAttribute('aria-label','Hikoya navigatsiyasi');
    nav.innerHTML='<button type="button" class="em-xp-next em-xp-replay" style="background:transparent;border:1px solid var(--accent);color:var(--accent)" aria-label="Introni qayta ko‘rish" title="Introni qayta ko‘rish">↻</button>' +
      '<small class="em-xp-chapter-count">01 / '+String(scenes.length).padStart(2,'0')+'</small>' +
      '<button type="button" class="em-xp-next em-xp-scroll-next" aria-label="Keyingi sahna">↓</button>';
    document.body.appendChild(nav);
    $('.em-xp-replay',nav).addEventListener('click',replay);
    $('.em-xp-scroll-next',nav).addEventListener('click',()=>{
      const next=scenes[Math.min(state.current+1,scenes.length-1)];
      next.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
    });
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{
        for(const e of entries){
          if(e.isIntersecting){
            const i=scenes.indexOf(e.target);
            if(i<0)continue;
            state.current=i;
            $('.em-xp-chapter-count',nav).textContent=String(i+1).padStart(2,'0')+' / '+String(scenes.length).padStart(2,'0');
            e.target.classList.add('em-xp-visible');
          }
        }
      },{threshold:.35});
      scenes.forEach(s=>observer.observe(s));
      document.documentElement.classList.add('em-xp-ready');
      scenes[0].classList.add('em-xp-visible');
    }
  }
  function music(url){
    if(state.audio){state.audio.pause();state.audio.remove();state.audio=null}
    if(state.musicButton){state.musicButton.remove();state.musicButton=null}
    const source=safeMedia(url);
    if(!source)return;
    const audio=document.createElement('audio');
    audio.src=source;audio.loop=true;audio.preload='none';
    document.body.appendChild(audio);
    const b=document.createElement('button');
    b.type='button';b.className='em-xp-music';b.textContent='♫';
    b.title='Musiqani yoqish';b.setAttribute('aria-label','Musiqani yoqish');
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click',async()=>{
      if(audio.paused){
        try { await audio.play();b.textContent='Ⅱ';b.title='Musiqani to‘xtatish';b.setAttribute('aria-pressed','true') }
        catch {b.title='Audio formatini ochib bo‘lmadi'}
      } else {audio.pause();b.textContent='♫';b.title='Musiqani yoqish';b.setAttribute('aria-pressed','false')}
    });
    document.body.appendChild(b);state.audio=audio;state.musicButton=b;
  }
  function video(url){
    const old=$('.em-xp-media');if(old)old.remove();
    const source=safeMedia(url);if(!source)return;
    const target=$('#s3 .scene-inner')||$('#s5 .scene-inner');
    if(!target)return;
    const v=document.createElement('video');
    v.className='em-xp-media';v.controls=true;v.preload='none';v.playsInline=true;
    v.setAttribute('aria-label','Shaxsiy video');
    v.src=source;
    v.addEventListener('play',()=>{if(state.audio&&!state.audio.paused)state.audio.volume=.15});
    v.addEventListener('pause',()=>{if(state.audio)state.audio.volume=.8});
    v.addEventListener('ended',()=>{if(state.audio)state.audio.volume=.8});
    target.appendChild(v);
  }
  function updateCountdown(value) {
    const dt=value ? new Date(value) : new Date('2027-06-25T18:00:00+05:00');
    if(Number.isNaN(dt.getTime()))return;
    state.target=dt.getTime();
    const tick=()=>{
      if(!document.getElementById('countdown'))return;
      const ms=Math.max(0,state.target-Date.now());
      const obj={d:Math.floor(ms/86400000),h:Math.floor(ms/3600000)%24,m:Math.floor(ms/60000)%60,s:Math.floor(ms/1000)%60};
      Object.keys(obj).forEach(id=>{const n=document.getElementById(id);if(n)n.textContent=String(obj[id]).padStart(2,'0')});
      let note=$('.em-xp-count-note');
      if(!note){note=document.createElement('p');note.className='em-xp-count-note';$('#countdown').after(note)}
      note.textContent=ms<=0?'Bayram kuni keldi!':'';
    };
    if(state.timer)clearInterval(state.timer);
    tick();state.timer=setInterval(tick,1000);
  }
  function weddingDetails(cfg){
    const grid=$('#s5 .special-grid');
    if(!grid)return;
    const venue=typeof cfg.venue==='string'&&cfg.venue.trim()?cfg.venue.trim():'The Garden, Toshkent';
    const cards=$$('.special',grid);
    const map=cards.find(c=>{const t=$('b',c);return t && t.textContent.trim()==='MAP'});
    if(map){
      let holder=$('.em-xp-map-holder',map);
      if(!holder){holder=document.createElement('div');holder.className='em-xp-map-holder';map.appendChild(holder)}
      holder.replaceChildren();
      const place=document.createElement('p');place.textContent=venue;holder.appendChild(place);
      const link=safeMap(cfg.venueMap)||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(venue);
      const a=document.createElement('a');a.className='em-xp-map';
      a.href=link;a.rel='noopener noreferrer';a.target='_blank';a.textContent='Xaritada ochish ↗';
      holder.appendChild(a);
      const old=map.querySelector(':scope > p');if(old)old.remove();
    }
    let button=$('.em-xp-rsvp-button');
    if(!button){
      button=document.createElement('button');button.type='button';button.className='em-xp-rsvp-button';
      button.textContent='RSVP · Javob berish ↗';
      grid.after(button);
      button.addEventListener('click',()=>{
        if(window.parent!==window){
          window.parent.postMessage({type:'emora:show-rsvp'},location.origin);
        } else {
          let n=$('.em-xp-demo',button.parentElement);
          if(!n){n=document.createElement('p');n.className='em-xp-demo';button.after(n)}
          n.textContent='Shaxsiy mehmon havolasi orqali javob yuboriladi.';
        }
      });
    }
    updateCountdown(cfg.eventAt);
  }
  function configure(cfg) {
    if(!cfg||typeof cfg!=='object')return;
    state.config=cfg;
    if(isWedding){
      const n1=typeof cfg.bride==='string'?cfg.bride.trim():'';
      const n2=typeof cfg.groom==='string'?cfg.groom.trim():'';
      const h=$('.hero h1');if(h && (n1||n2))h.textContent=[n1,n2].filter(Boolean).join(' & ');
      const p=$('.hero .scene-inner p');
      if(p && typeof cfg.invitation==='string'&&cfg.invitation.trim())p.textContent=cfg.invitation;
      weddingDetails(cfg);
    } else {
      if(typeof cfg.intro==='string' && cfg.intro.trim()){
        const hero=$('.hero h1');if(hero)hero.textContent=cfg.intro;
      }
    }
    if(typeof cfg.letter==='string'&&cfg.letter.trim()){
      const p=$('#s4 .letter-card p');
      if(p)p.textContent=cfg.letter;
    }
    if(Array.isArray(cfg.photos)){
      $$('.memory').forEach((el,i)=>{
        const src=safeMedia(cfg.photos[i]);
        if(src)el.style.backgroundImage='url("'+src.replaceAll('"','%22')+'")';
      });
    }
    if(cfg.music||cfg.musicUrl)music(cfg.music||cfg.musicUrl);
    if(cfg.video||cfg.videoUrl)video(cfg.video||cfg.videoUrl);
    if(typeof cfg.finalHeading==='string'&&cfg.finalHeading.trim()){
      const h=$('#s6 h2');if(h)h.textContent=cfg.finalHeading;
    } else if(typeof cfg.final==='string'&&cfg.final.trim()){
      const h=$('#s6 h2');if(h)h.textContent=cfg.final;
    }
  }
  if(isWedding)weddingDetails({});
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin)return;
    if(!event.data || typeof event.data.type!=='string' || !event.data.type.startsWith('emora:'))return;
    if(event.data.config)configure(event.data.config);
  });
  // Parent may post preview data immediately after iframe load; receive it before showing fallback details.
  if(new URLSearchParams(location.search).get('editor')==='1')document.documentElement.dataset.editor='1';
})();
