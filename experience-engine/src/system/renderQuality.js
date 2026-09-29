export function getRenderTier(){
  if(typeof window==='undefined')return 'balanced';
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if(reduced)return 'fallback';
  const canvas=document.createElement('canvas');
  const gl=canvas.getContext('webgl2',{failIfMajorPerformanceCaveat:true})||canvas.getContext('webgl',{failIfMajorPerformanceCaveat:true});
  if(!gl)return 'fallback';
  const cores=navigator.hardwareConcurrency||4;
  const memory=navigator.deviceMemory||4;
  const mobile=Math.min(window.innerWidth,window.innerHeight)<760;
  if(mobile&&(cores<=4||memory<=4))return 'balanced';
  if(cores>=8&&memory>=6)return 'full';
  return 'balanced';
}

export function qualityProfile(tier=getRenderTier()){
  if(tier==='full')return {tier,maxDpr:2,particleScale:1,blur:true,shadows:true};
  if(tier==='balanced')return {tier,maxDpr:1.5,particleScale:.72,blur:true,shadows:true};
  return {tier,maxDpr:1,particleScale:.42,blur:false,shadows:false};
}
