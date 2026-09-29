import { Application, Container, Graphics } from 'pixi.js';

export class SkyWorld{
  constructor(host){
    this.host=host;this.app=null;this.root=null;this.layers=[];this.pointer={x:0,y:0};this.dawn=0;this.destroyed=false;this.ro=null;
    this.tick=this.tick.bind(this);
  }
  async init(){
    const app=new Application();
    await app.init({resizeTo:this.host,backgroundAlpha:0,antialias:true,autoDensity:true,resolution:Math.min(devicePixelRatio||1,1.5),preference:'webgl',powerPreference:'high-performance'});
    if(this.destroyed){app.destroy(true);return}
    this.app=app;app.canvas.className='sp-canvas';this.host.appendChild(app.canvas);
    this.root=new Container();app.stage.addChild(this.root);
    const counts=[70,48,26];
    counts.forEach((count,li)=>{
      const stars=Array.from({length:count},()=>({x:Math.random(),y:Math.random()*.82,r:.55+Math.random()*(li+1)*.45,a:.34+Math.random()*.62,tw:Math.random()*Math.PI*2}));
      const g=new Graphics();g._stars=stars;g._depth=(li+1)*.45;this.layers.push(g);this.root.addChild(g);
    });
    this.layout();
    this.ro=new ResizeObserver(()=>this.layout());this.ro.observe(this.host);
    app.ticker.add(this.tick);
  }
  layout(){
    if(!this.app)return;
    const w=this.app.screen.width,h=this.app.screen.height;
    this.layers.forEach((g,li)=>{
      g.clear();
      g._stars.forEach(s=>{
        const tint=li===2?0xe8e1ff:li===1?0xcfe5ff:0xffffff;
        g.circle(s.x*w,s.y*h,s.r).fill({color:tint,alpha:s.a});
        if(li===2&&s.r>1.2)g.circle(s.x*w,s.y*h,s.r*3.2).fill({color:0xc9ddff,alpha:.035});
      });
    });
  }
  pointerTo(x,y){this.pointer.x=Math.max(-1,Math.min(1,x));this.pointer.y=Math.max(-1,Math.min(1,y))}
  setDawn(v){this.dawn=Math.max(0,Math.min(1,v))}
  tick(ticker){
    const t=performance.now()*.001;
    this.layers.forEach((g,i)=>{
      const d=g._depth;
      g.x+=(this.pointer.x*d*11-g.x)*.045;
      g.y+=(this.pointer.y*d*7-g.y)*.045;
      g.alpha=(1-this.dawn*.92)*(.78+Math.sin(t*.7+i)*.06);
    });
    this.root.rotation=Math.sin(t*.08)*.002;
  }
  destroy(){
    this.destroyed=true;this.ro?.disconnect();
    if(this.app){this.app.ticker.remove(this.tick);this.app.destroy(true,{children:true,texture:true});this.app=null}
  }
}
