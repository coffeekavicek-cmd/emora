import { useEffect } from 'react';
import { EXPERIENCES } from './registry.js';
import { FLAGSHIP_SET } from '../reborn/flagships.js';
import './gallery.css';

const symbol={curtain:'✦',envelope:'✉',galaxy:'✧',silk:'⌁',garden:'✺',naqsh:'◇',gift:'□',balloons:'○',reel:'◉',rain:'╱',ink:'●',lamp:'◐',ring:'◇',cinema:'▣',sky:'✦'};

export function ExperienceGallery(){
 useEffect(()=>{const prev=document.body.style.touchAction;document.body.style.touchAction='pan-y';return()=>{document.body.style.touchAction=prev}},[]);
 const experiences=EXPERIENCES.filter(x=>FLAGSHIP_SET.has(x.slug));
 const groups=['LOVE','WEDDING','BIRTHDAY','APOLOGY','PROPOSAL'];
 return <main className="template-gallery">
   <header className="gallery-hero">
     <a className="gallery-brand" href="?">emora<span>.</span></a>
     <p>FLAGSHIP EXPERIENCE ENGINE · 5 WORLDS</p>
     <h1>Besh his.<br/><em>Besh alohida olam.</em></h1>
     <div className="gallery-note">Har yo‘nalish uchun bitta flagship. Har biri music + photo + video bilan ishlaydi va o‘zining fizik interaction dramaturgiyasiga ega.</div>
   </header>
   <div className="gallery-groups">
    {groups.map(group=>{const item=experiences.find(x=>x.group===group);if(!item)return null;return <section key={group} className="gallery-group">
      <div className="group-label"><span>{group}</span><i/></div>
      <div className="gallery-grid">
       <a className={'experience-card tone-card-'+item.tone} href={'?template='+item.slug}>
         <div className={'card-art card-'+item.ritual}>
           <img src={item.art} alt="" /><span className="card-art-veil"/><span className="card-orbit"/><b>{symbol[item.ritual]}</b>
           {Array.from({length:6},(_,n)=><i key={n} style={{'--n':n}}/>)}
         </div>
         <div className="card-copy"><small>FLAGSHIP · {item.group}</small><h2>{item.name}</h2><p>{item.instruction}</p></div>
         <span className="card-arrow">↗</span>
       </a>
      </div>
    </section>})}
   </div>
 </main>;
}
