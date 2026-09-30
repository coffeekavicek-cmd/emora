export const FLAGSHIP_IDS=['love-pearl','wedding-silk','birthday-balloon','apology-rain','proposal-pearl'];
export const FLAGSHIP_SET=new Set(FLAGSHIP_IDS);
export const FLAGSHIP_BY_CATEGORY={love:'love-pearl',wedding:'wedding-silk',birthday:'birthday-balloon',apology:'apology-rain',proposal:'proposal-pearl'};
export const FLAGSHIP_META={
 'love-pearl':{label:'LOVE',name:'Pearl Linen',promise:'living linen · pearl thread · archive · particle portrait',engine:['Three.js','GSAP','Canvas']},
 'wedding-silk':{label:'WEDDING',name:'Silk Heritage',promise:'living silk · gold thread · ceremony weave · invitation reveal',engine:['Three.js','GSAP','shader']},
 'birthday-balloon':{label:'BIRTHDAY',name:'Balloon Dream',promise:'cinematic room · physical balloons · projected memories · ceiling-break sky',engine:['Rapier','GSAP','Canvas']},
 'apology-rain':{label:'APOLOGY',name:'After Rain',promise:'live rain · fog wipe · refracted memories · traced glass · sunrise',engine:['Canvas','shader','GSAP']},
 'proposal-pearl':{label:'PROPOSAL',name:'Pearl Promise',promise:'3D velvet vault · jewel lighting · memory refractions · ring engraving',engine:['Three.js','GSAP','Rapier']},
};
