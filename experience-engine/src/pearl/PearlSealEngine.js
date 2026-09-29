import { Application, Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap';

const TAU=Math.PI*2;

export class PearlSealEngine{
  constructor(host,{onCrack,onSettled}={}){
    this.host=host;this.onCrack=onCrack;this.onSettled=onSettled;
    this.app=null;this.root=null;this.baseWax=null;this.shards=[];this.dust=[];this.destroyed=false;this.cracked=false;
  }
  async init(){
    const app=new Application();
    await app.init({
      resizeTo:this.host,backgroundAlpha:0,antialias:true,autoDensity:true,
      resolution:Math.min(devicePixelRatio||1,2),preference:'webgl',powerPreference:'high-performance'
    });
    if(this.destroyed){app.destroy(true);return}
    this.app=app;app.canvas.className='pearl-seal-canvas';this.host.appendChild(app.canvas);
    this.root=new Container();app.stage.addChild(this.root);
    this.drawSeal();this.layout();
    this.ro=new ResizeObserver(()=>this.layout());this.ro.observe(this.host);
  }
  polygonPoints(index,total){
    const a0=index/total*TAU-Math.PI/2;
    const a1=(index+1)/total*TAU-Math.PI/2;
    const mid=(a0+a1)/2;
    const r0=79+(index%4)*1.2;
    const r1=79+((index+1)%4)*1.2;
    const rm=82+((index*7)%3)*1.4;
    return[
      [Math.cos(a0)*7,Math.sin(a0)*7],
      [Math.cos(a0)*r0,Math.sin(a0)*r0],
      [Math.cos(mid)*rm,Math.sin(mid)*rm],
      [Math.cos(a1)*r1,Math.sin(a1)*r1],
      [Math.cos(a1)*7,Math.sin(a1)*7],
    ];
  }
  drawSeal(){
    const base=new Graphics();
    for(let i=0;i<18;i++){
      const a=i/18*TAU;
      const rr=76+(i%5)*1.7;
      base.circle(Math.cos(a)*rr,Math.sin(a)*rr,8+(i%3)*1.4).fill({color:0x8e1f36,alpha:1});
    }
    base.circle(0,0,79).fill({color:0x8d2036,alpha:1});
    base.circle(-16,-20,54).fill({color:0xa62c45,alpha:.28});
    base.circle(0,0,73).stroke({width:1.4,color:0xd36a7e,alpha:.25});
    base.circle(0,0,67).stroke({width:1,color:0x5a0c1b,alpha:.22});
    this.baseWax=base;this.root.addChild(base);

    const total=15;
    for(let i=0;i<total;i++){
      const pts=this.polygonPoints(i,total);
      const g=new Graphics();
      g.poly(pts.flat()).fill({color:i%3===0?0x92233a:i%3===1?0x98263e:0x892037,alpha:.91});
      g.poly(pts.flat()).stroke({width:.55,color:0x5b0d1c,alpha:.09});
      g._angle=(i+.5)/total*TAU-Math.PI/2;
      g._distance=72+((i*29)%70);
      g._spin=((i%5)-2)*.42;
      this.shards.push(g);this.root.addChild(g);
    }

    const gloss=new Graphics();
    gloss.arc(-7,-8,55,Math.PI*1.07,Math.PI*1.68).stroke({width:3,color:0xf0a6b6,alpha:.17});
    gloss.arc(-8,-9,48,Math.PI*1.08,Math.PI*1.57).stroke({width:1.2,color:0xffd6df,alpha:.18});
    this.root.addChild(gloss);this.gloss=gloss;

    const monogram=new Graphics();
    monogram.circle(0,0,32).stroke({width:1.7,color:0xe8a2b1,alpha:.34});
    monogram.circle(0,0,25).stroke({width:1,color:0x570b19,alpha:.52});
    monogram.moveTo(-13,-12)
      .bezierCurveTo(10,-24,21,-9,5,-1)
      .bezierCurveTo(-6,5,-8,13,12,19)
      .stroke({width:3,color:0x4e0916,alpha:.76});
    this.root.addChild(monogram);this.monogram=monogram;

    for(let i=0;i<34;i++){
      const d=new Graphics();
      d.circle(0,0,.7+(i%5)*.32).fill({color:i%4===0?0xf3bdc8:0x9a3347,alpha:.72});
      d.visible=false;d._angle=(i*2.399963229728653)%TAU;d._distance=42+((i*31)%120);
      this.dust.push(d);this.root.addChild(d);
    }
  }
  layout(){
    if(!this.app)return;
    this.root.position.set(this.app.screen.width/2,this.app.screen.height/2);
    const s=Math.max(.78,Math.min(1.22,Math.min(this.app.screen.width,this.app.screen.height)/520));
    this.root.scale.set(s);
  }
  crack(){
    if(this.cracked||!this.app)return;this.cracked=true;
    this.onCrack?.();
    if(this.baseWax)gsap.to(this.baseWax,{alpha:0,scaleX:.96,scaleY:.96,duration:.18,ease:'power2.in'});
    if(this.gloss)gsap.to(this.gloss,{alpha:0,duration:.14,ease:'power1.in'});
    if(this.monogram)gsap.to(this.monogram,{alpha:0,scaleX:.56,scaleY:.56,duration:.2,ease:'power2.in'});
    this.dust.forEach((d,i)=>{
      d.visible=true;d.alpha=0;
      gsap.timeline({delay:i*.006})
        .to(d,{alpha:.82,duration:.07})
        .to(d,{x:Math.cos(d._angle)*d._distance,y:Math.sin(d._angle)*d._distance,alpha:0,duration:.62,ease:'power3.out'},'<');
    });
    this.shards.forEach((g,i)=>{
      const a=g._angle;
      gsap.to(g,{
        x:Math.cos(a)*g._distance,
        y:Math.sin(a)*g._distance,
        rotation:g._spin,
        alpha:0,
        duration:.68+(i%5)*.055,
        delay:i*.007,
        ease:'power3.out'
      });
    });
    setTimeout(()=>this.onSettled?.(),900);
  }
  reset(){
    this.cracked=false;
    this.shards.forEach(g=>{gsap.killTweensOf(g);g.x=0;g.y=0;g.alpha=.91;g.rotation=0});
    if(this.baseWax){gsap.killTweensOf(this.baseWax);this.baseWax.alpha=1;this.baseWax.scale.set(1)}
    if(this.gloss){gsap.killTweensOf(this.gloss);this.gloss.alpha=1}
    if(this.monogram){gsap.killTweensOf(this.monogram);this.monogram.alpha=1;this.monogram.scale.set(1)}
    this.dust.forEach(d=>{gsap.killTweensOf(d);d.visible=false;d.x=0;d.y=0;d.alpha=0});
  }
  destroy(){
    this.destroyed=true;this.ro?.disconnect();
    this.shards.forEach(g=>gsap.killTweensOf(g));this.dust.forEach(g=>gsap.killTweensOf(g));
    if(this.baseWax)gsap.killTweensOf(this.baseWax);
    if(this.gloss)gsap.killTweensOf(this.gloss);
    if(this.monogram)gsap.killTweensOf(this.monogram);
    if(this.app){this.app.destroy(true,{children:true});this.app=null}
  }
}

export function playCrackSound(){
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
    const ctx=new Ctx(),duration=.16,buffer=ctx.createBuffer(1,ctx.sampleRate*duration,ctx.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++){
      const t=i/data.length;
      data[i]=(Math.random()*2-1)*Math.pow(1-t,3)*(i%7===0?1:.55);
    }
    const noise=ctx.createBufferSource();noise.buffer=buffer;
    const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=1450;filter.Q.value=.75;
    const gain=ctx.createGain();gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.42,ctx.currentTime+.008);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.17);
    noise.connect(filter).connect(gain).connect(ctx.destination);noise.start();
    setTimeout(()=>ctx.close(),450);
  }catch{}
  try{navigator.vibrate?.([18,12,26])}catch{}
}
