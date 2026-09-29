import { Application, Container, Graphics, Sprite } from 'pixi.js';
import { gsap } from 'gsap';
import { qualityProfile } from '../system/renderQuality.js';

const TAU=Math.PI*2;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const lerp=(a,b,t)=>a+(b-a)*t;

function makeDotTexture(app,size=22){
  const g=new Graphics();
  g.circle(size/2,size/2,size*.16).fill({color:0xffffff,alpha:1});
  g.circle(size/2,size/2,size*.34).fill({color:0xffffff,alpha:.22});
  g.circle(size/2,size/2,size*.5).fill({color:0xffffff,alpha:.05});
  const texture=app.renderer.generateTexture({target:g,resolution:2});
  g.destroy();
  return texture;
}

function pointInGalaxy(i,total,radius){
  const arm=i%4;
  const p=i/Math.max(1,total-1);
  const distance=radius*(.07+Math.pow(p,.69)*.93);
  const spiral=p*TAU*2.58+arm*(TAU/4);
  const jitter=(Math.random()-.5)*Math.min(76,18+distance*.13);
  return{
    distance:Math.max(8,distance+jitter),
    angle:spiral+(Math.random()-.5)*.38,
    lift:(Math.random()-.5)*(12+distance*.075),
    speed:.06+Math.random()*.085,
    phase:Math.random()*TAU,
  };
}

const STAR_PLACEMENTS=[
  {angle:-2.42,radius:.36,flatten:.57},
  {angle:-.17,radius:.41,flatten:.54},
  {angle:1.67,radius:.34,flatten:.61},
];

export class GalaxyEngine{
  constructor(host,{onStar,onReady,onStarLayout,showStars=true,interactive=true}={}){
    this.host=host;
    this.onStar=onStar;
    this.onReady=onReady;
    this.onStarLayout=onStarLayout;
    this.showStars=showStars;
    this.interactive=interactive;
    this.app=null;
    this.root=null;
    this.galaxy=null;
    this.stars=[];
    this.points=[];
    this.dotTexture=null;
    this.drag={active:false,lastX:0,velocity:0};
    this.rotation=0;
    this.targetRotation=0;
    this.pointer={x:0,y:0};
    this.state={intro:0,morph:0,explode:0,collapse:0};
    this.mode='galaxy';
    this.destroyed=false;
    this.resizeObserver=null;
    this.quality=qualityProfile();
  }

  async init(){
    const app=new Application();
    await app.init({
      resizeTo:this.host,
      backgroundAlpha:0,
      antialias:true,
      autoDensity:true,
      resolution:Math.min(window.devicePixelRatio||1,this.quality.maxDpr),
      preference:'webgl',
      powerPreference:'high-performance',
    });
    if(this.destroyed){app.destroy(true);return}
    this.app=app;
    app.canvas.className='galaxy-canvas';
    this.host.appendChild(app.canvas);
    this.dotTexture=makeDotTexture(app);
    this.root=new Container();
    this.galaxy=new Container();
    this.root.addChild(this.galaxy);
    app.stage.addChild(this.root);
    app.stage.eventMode='static';
    app.stage.hitArea=app.screen;
    this.createParticles();
    if(this.showStars)this.createInteractiveStars();
    if(this.interactive)this.installInput();
    app.ticker.add(this.tick);
    this.resizeObserver=new ResizeObserver(()=>this.layout());
    this.resizeObserver.observe(this.host);
    this.layout();
    gsap.to(this.state,{intro:1,duration:2.15,ease:'power3.out'});
    this.onReady?.({particleCount:this.points.length,tier:this.quality.tier});
  }

  qualityCount(){
    const mobile=Math.min(innerWidth,innerHeight)<760;
    const cores=navigator.hardwareConcurrency||4;
    const base=mobile?(cores<=4?820:1040):(cores>=8?1580:1240);
    return Math.max(460,Math.round(base*this.quality.particleScale));
  }

  createParticles(){
    const count=this.qualityCount();
    for(let i=0;i<count;i++){
      const sprite=new Sprite(this.dotTexture);
      sprite.anchor.set(.5);
      const size=.14+Math.random()*.5;
      sprite.scale.set(size);
      sprite.alpha=0;
      const warm=Math.random();
      sprite.tint=warm>.91?0xffb9d6:warm>.69?0xcac6ff:warm>.54?0xe5ddff:0xffffff;
      const meta=pointInGalaxy(i,count,360);
      meta.sprite=sprite;
      meta.baseScale=size;
      meta.portrait=null;
      meta.seed=Math.random()*TAU;
      this.points.push(meta);
      this.galaxy.addChild(sprite);
    }
  }

  createInteractiveStars(){
    STAR_PLACEMENTS.forEach((p,index)=>{
      const c=new Container();
      const outer=new Graphics();
      outer.circle(0,0,38).fill({color:0xd8c7ff,alpha:.025});
      outer.circle(0,0,27).fill({color:0xffe8f4,alpha:.045});
      const ring=new Graphics();
      ring.circle(0,0,19).stroke({width:.8,color:0xf4ddff,alpha:.34});
      ring.circle(0,0,30).stroke({width:.45,color:0xc4b1f4,alpha:.13});
      const core=new Graphics();
      core.star(0,0,6,8,2.2,0).fill({color:0xfff8ff,alpha:1});
      c.addChild(outer,ring,core);
      c.eventMode='static';
      c.cursor='pointer';
      c.hitArea={contains:(x,y)=>x*x+y*y<46*46};
      c.alpha=0;
      c.scale.set(.8);
      c._placement=p;
      c._opened=false;
      c._pulse=Math.random()*TAU;
      c._index=index;
      c.on('pointertap',()=>this.openStar(index));
      this.stars.push(c);
      this.root.addChild(c);
    });
  }

  openStar(index){
    const c=this.stars[index];
    if(!c||c._opened||this.mode!=='galaxy')return false;
    c._opened=true;
    c.eventMode='none';
    gsap.timeline()
      .to(c.scale,{x:1.85,y:1.85,duration:.24,ease:'power3.out'})
      .to(c,{alpha:.1,duration:.62,ease:'power2.in'},'<+.03')
      .to(c.scale,{x:.32,y:.32,duration:.62,ease:'power2.in'},'<');
    this.onStar?.(index);
    return true;
  }

  installInput(){
    const stage=this.app.stage;
    stage.on('pointerdown',e=>{
      if(this.mode!=='galaxy')return;
      this.drag.active=true;
      this.drag.lastX=e.global.x;
      this.drag.velocity=0;
    });
    stage.on('pointermove',e=>{
      const w=Math.max(1,this.app.screen.width),h=Math.max(1,this.app.screen.height);
      this.pointer.x=(e.global.x/w-.5)*2;
      this.pointer.y=(e.global.y/h-.5)*2;
      if(!this.drag.active||this.mode!=='galaxy')return;
      const dx=e.global.x-this.drag.lastX;
      this.drag.lastX=e.global.x;
      this.targetRotation+=dx*.0062;
      this.drag.velocity=dx*.0021;
    });
    const release=()=>{this.drag.active=false};
    stage.on('pointerup',release);
    stage.on('pointerupoutside',release);
  }

  layout(){
    if(!this.app)return;
    this.app.stage.hitArea=this.app.screen;
    const w=this.app.screen.width,h=this.app.screen.height;
    this.root.position.set(w/2,h/2);
    const radius=Math.min(w,h)*.5;
    const scale=clamp(radius/360,.7,1.68);
    this.galaxy.scale.set(scale);
  }

  tick=(ticker)=>{
    if(!this.app)return;
    const dt=Math.min(ticker.deltaMS/1000,.034);
    this.targetRotation+=this.drag.velocity;
    this.drag.velocity*=Math.pow(.925,dt*60);
    this.rotation=lerp(this.rotation,this.targetRotation,1-Math.pow(.045,dt));
    const time=performance.now()/1000;
    const w=this.app.screen.width,h=this.app.screen.height;
    const parallaxX=this.pointer.x*Math.min(28,w*.032);
    const parallaxY=this.pointer.y*Math.min(20,h*.025);
    const collapse=this.state.collapse;

    if(this.mode==='galaxy'||this.mode==='collapse'||this.mode==='morph'){
      for(let i=0;i<this.points.length;i++){
        const p=this.points[i],s=p.sprite;
        const a=p.angle+this.rotation+p.speed*time*.16;
        const breathing=1+Math.sin(time*.51+p.phase)*.02;
        let gx=Math.cos(a)*p.distance*breathing+parallaxX*(p.distance/360);
        let gy=Math.sin(a)*p.distance*.55+p.lift+parallaxY*(p.distance/360);
        gx*=1-collapse;
        gy*=1-collapse;
        const m=this.state.morph;
        if(p.portrait){
          const px=p.portrait.x,py=p.portrait.y;
          s.x=lerp(gx,px,m);
          s.y=lerp(gy,py,m);
          s.alpha=lerp((.2+.48*(1-p.distance/430))*this.state.intro,p.portrait.alpha,m);
          if(m>.5)s.tint=p.portrait.tint;
          const targetScale=clamp(p.baseScale*(.7+p.portrait.alpha*.7),.12,.74);
          s.scale.set(lerp(p.baseScale,targetScale,m));
        }else{
          s.x=gx;s.y=gy;
          s.alpha=clamp((.17+.48*(1-p.distance/430))*this.state.intro+collapse*.22,0,.94);
          s.scale.set(p.baseScale*(1+collapse*.24));
        }
      }
    }

    if(this.mode==='explode'){
      const e=this.state.explode;
      for(const p of this.points){
        const s=p.sprite;
        const angle=p.seed+this.rotation;
        const dist=(76+p.distance*1.74)*e;
        s.x=(p.portrait?.x||0)+Math.cos(angle)*dist;
        s.y=(p.portrait?.y||0)+Math.sin(angle)*dist;
        s.alpha=(1-e)*.92;
      }
    }

    const baseR=Math.min(w,h);
    this.stars.forEach((c,i)=>{
      const p=c._placement;
      const a=p.angle+this.rotation*.78;
      const depth=(Math.sin(a+.65)+1)/2;
      const r=baseR*p.radius*(1-collapse);
      const x=Math.cos(a)*r+parallaxX*(.32+depth*.3);
      const y=Math.sin(a)*r*p.flatten+parallaxY*(.28+depth*.24);
      const k=(.72+depth*.34)*(1-collapse*.35);
      c.position.set(x,y);
      if(!c._opened){
        c.alpha=clamp(this.state.intro*(.56+depth*.33+Math.sin(time*1.6+c._pulse)*.1),0,1);
        c.scale.set(k*(1+Math.sin(time*1.05+c._pulse)*.035));
        c.rotation=Math.sin(time*.42+i)*.055;
      }else if(this.mode==='collapse'){
        c.alpha=.42*(1-collapse);
      }
      this.onStarLayout?.(i,{
        x:w/2+x,
        y:h/2+y,
        scale:k,
        alpha:c._opened?.12:c.alpha,
        opened:c._opened,
      });
    });
  }

  collapseToCore({onComplete}={}){
    if(!this.app)return;
    this.mode='collapse';
    this.stars.forEach(c=>{c.eventMode='none';if(c._opened)gsap.to(c,{alpha:.42,duration:.25})});
    gsap.killTweensOf(this.state);
    gsap.fromTo(this.state,{collapse:0},{collapse:1,duration:1.45,ease:'power4.inOut',onComplete});
  }

  morphToPortrait(points,{onComplete}={}){
    if(!points?.length||!this.points.length)return;
    this.mode='morph';
    const minSide=Math.min(this.app.screen.width,this.app.screen.height);
    const scale=minSide/Math.max(520,minSide);
    for(let i=0;i<this.points.length;i++){
      const source=points[i%points.length];
      this.points[i].portrait={
        x:source.x*scale,
        y:source.y*scale,
        alpha:source.alpha??.9,
        tint:source.tint??0xffe7ef,
      };
    }
    gsap.killTweensOf(this.state);
    gsap.fromTo(this.state,{morph:0},{morph:1,duration:2.85,ease:'power4.inOut',onComplete:()=>{
      this.mode='portrait';
      onComplete?.();
    }});
    this.stars.forEach(c=>gsap.to(c,{alpha:0,duration:.42}));
  }

  explode({onComplete}={}){
    this.mode='explode';
    gsap.fromTo(this.state,{explode:0},{explode:1,duration:1.8,ease:'power3.in',onComplete});
  }

  reset(){
    gsap.killTweensOf(this.state);
    this.mode='galaxy';
    this.state.morph=0;
    this.state.explode=0;
    this.state.collapse=0;
    this.rotation=0;this.targetRotation=0;
    this.drag.velocity=0;this.drag.active=false;
    this.stars.forEach(c=>{
      c._opened=false;c.eventMode='static';c.alpha=.72;c.scale.set(1);
    });
    this.points.forEach(p=>{p.portrait=null;p.sprite.alpha=.45});
  }

  destroy(){
    this.destroyed=true;
    this.resizeObserver?.disconnect();
    gsap.killTweensOf(this.state);
    this.app?.ticker.remove(this.tick);
    this.app?.destroy(true,{children:true,texture:true});
    this.app=null;
  }
}
