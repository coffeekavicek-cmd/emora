import { Application, Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap';

const TAU=Math.PI*2;

export class PearlSealEngine{
  constructor(host,{onCrack,onSettled}={}){
    this.host=host;this.onCrack=onCrack;this.onSettled=onSettled;
    this.app=null;this.root=null;this.shards=[];this.dust=[];this.destroyed=false;this.cracked=false;
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
  polygonPoints(index,total,r1=52,r2=84){
    const a0=index/total*TAU-Math.PI/2;
    const a1=(index+1)/total*TAU-Math.PI/2;
    const mid=(a0+a1)/2;
    return[
      [Math.cos(a0)*r1,Math.sin(a0)*r1],
      [Math.cos(mid)*r2,Math.sin(mid)*r2],
      [Math.cos(a1)*r1,Math.sin(a1)*r1],
      [Math.cos(mid)*22,Math.sin(mid)*22],
      [Math.cos(a0)*13,Math.sin(a0)*13],
    ];
  }
  drawSeal(){
    const total=15;
    for(let i=0;i<total;i++){
      const pts=this.polygonPoints(i,total,50+(i%3)*3,79+(i%4)*4);
      const g=new Graphics();
      g.poly(pts.flat()).fill({color:i%3===0?0x8b2034:i%3===1?0xa42d43:0x741628,alpha:1});
      g.poly(pts.flat()).stroke({width:1,color:0xd46a7d,alpha:.24});
      g.rotation=(Math.random()-.5)*.035;
      g._angle=(i+.5)/total*TAU-Math.PI/2;
      g._distance=70+Math.random()*95;
      g._spin=(Math.random()-.5)*2.3;
      this.shards.push(g);this.root.addChild(g);
    }
    const monogram=new Graphics();
    monogram.circle(0,0,31).stroke({width:2,color:0xe69bad,alpha:.38});
    monogram.circle(0,0,24).stroke({width:1,color:0x5b0d1b,alpha:.55});
    monogram.moveTo(-12,-10).bezierCurveTo(6,-22,20,-12,7,-1).bezierCurveTo(-2,7,-9,10,10,18)
      .stroke({width:3,color:0x4f0a16,alpha:.78});
    monogram.label='monogram';this.root.addChild(monogram);this.monogram=monogram;

    for(let i=0;i<34;i++){
      const d=new Graphics();
      d.circle(0,0,.7+Math.random()*2).fill({color:i%4===0?0xf3bdc8:0x9a3347,alpha:.75});
      d.visible=false;d._angle=Math.random()*TAU;d._distance=40+Math.random()*135;
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
    this.monogram && gsap.to(this.monogram,{alpha:0,scaleX:.55,scaleY:.55,duration:.22,ease:'power2.in'});
    this.dust.forEach((d,i)=>{
      d.visible=true;d.alpha=0;
      gsap.timeline({delay:i*.006})
        .to(d,{alpha:.85,duration:.08})
        .to(d,{x:Math.cos(d._angle)*d._distance,y:Math.sin(d._angle)*d._distance,alpha:0,duration:.62,ease:'power3.out'},'<');
    });
    this.shards.forEach((g,i)=>{
      const a=g._angle;
      gsap.to(g,{
        x:Math.cos(a)*g._distance,
        y:Math.sin(a)*g._distance,
        rotation:g.rotation+g._spin,
        alpha:0,
        duration:.72+Math.random()*.32,
        delay:i*.008,
        ease:'power3.out'
      });
    });
    setTimeout(()=>this.onSettled?.(),920);
  }
  reset(){
    this.cracked=false;
    this.shards.forEach(g=>{gsap.killTweensOf(g);g.x=0;g.y=0;g.alpha=1;g.rotation=0});
    if(this.monogram){gsap.killTweensOf(this.monogram);this.monogram.alpha=1;this.monogram.scale.set(1)}
    this.dust.forEach(d=>{gsap.killTweensOf(d);d.visible=false;d.x=0;d.y=0});
  }
  destroy(){
    this.destroyed=true;this.ro?.disconnect();
    this.shards.forEach(g=>gsap.killTweensOf(g));this.dust.forEach(g=>gsap.killTweensOf(g));
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
