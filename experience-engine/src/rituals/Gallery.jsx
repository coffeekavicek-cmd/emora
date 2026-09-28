import { EXPERIENCES } from './registry.js';
import './gallery.css';

const symbol={
 curtain:'✦',envelope:'✉',galaxy:'✧',silk:'⌁',garden:'✺',naqsh:'◇',gift:'□',balloons:'○',
 reel:'◉',rain:'╱',ink:'●',lamp:'◐',ring:'◇',cinema:'▣',sky:'✦'
};

export function ExperienceGallery(){
 const groups=['LOVE','WEDDING','BIRTHDAY','APOLOGY','PROPOSAL'];
 return <main className="template-gallery">
   <header className="gallery-hero">
     <a className="gallery-brand" href="?">emora<span>.</span></a>
     <p>EXPERIENCE ENGINE · 15 RITUALS</p>
     <h1>Har bir his uchun<br/><em>alohida olam.</em></h1>
     <div className="gallery-note">Template tanlang. Har biri 100svh, scrollsiz va o‘z interaction ritualiga ega.</div>
   </header>
   <div className="gallery-groups">
    {groups.map(group=><section key={group} className="gallery-group">
      <div className="group-label"><span>{group}</span><i/></div>
      <div className="gallery-grid">
       {EXPERIENCES.filter(x=>x.group===group).map((x,i)=><a className={'experience-card tone-card-'+x.tone} href={'?template='+x.slug} key={x.slug}>
         <div className={'card-art card-'+x.ritual}>
           <span className="card-orbit"/><b>{symbol[x.ritual]}</b>
           {Array.from({length:6},(_,n)=><i key={n} style={{'--n':n}}/>)}
         </div>
         <div className="card-copy"><small>0{i+1} · {x.group}</small><h2>{x.name}</h2><p>{x.ritual==='galaxy'?'WebGL particles · portrait morph':x.instruction}</p></div>
         <span className="card-arrow">↗</span>
       </a>)}
      </div>
    </section>)}
   </div>
 </main>;
}
