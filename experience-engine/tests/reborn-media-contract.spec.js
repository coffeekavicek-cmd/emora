import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const templates={
  'love-pearl':'src/reborn/pearl/PearlArchiveReborn.jsx',
  'love-galaxy':'src/reborn/galaxy/GalaxyConfessionReborn.jsx',
  'love-rose':'src/reborn/love/RoseTheatreReborn.jsx',
  'birthday-memory':'src/reborn/memory/MemoryReelReborn.jsx',
  'birthday-aurora':'src/reborn/birthday/AuroraPaperReborn.jsx',
  'birthday-balloon':'src/reborn/birthday/BalloonDreamReborn.jsx',
  'apology-ink':'src/reborn/ink/InkRegretReborn.jsx',
  'apology-quiet':'src/reborn/quiet/QuietRoomReborn.jsx',
  'apology-rain':'src/reborn/rain/AfterRainReborn.jsx',
  'wedding-silk':'src/reborn/silk/SilkHeritageReborn.jsx',
  'wedding-naqsh':'src/reborn/wedding/HeritageNaqshReborn.jsx',
  'wedding-garden':'src/reborn/wedding/NightGardenReborn.jsx',
  'proposal-pearl':'src/reborn/proposal/PearlPromiseReborn.jsx',
  'proposal-cinema':'src/reborn/proposal/CinemaProposalReborn.jsx',
  'proposal-sky':'src/reborn/proposal/SkyPromiseReborn.jsx',
};
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');

test('all 15 recipient routes are Reborn and media-complete',()=>{
  const main=read('src/main.jsx');
  expect(Object.keys(templates)).toHaveLength(15);
  for(const [id,file] of Object.entries(templates)){
    expect(main,`${id} recipient route`).toContain(`slug==='${id}'`);
    const source=read(file);
    expect(source,`${id} music`).toContain('ExperienceSoundscape');
    expect(source,`${id} media urls`).toContain('useExperienceMedia');
    expect(source,`${id} video`).toContain('ExperienceVideo');
  }
});

test('all 15 templates are available in Reborn Creator Editor',()=>{
  const editor=read('src/reborn/editor/RebornCreatorEditor.jsx');
  for(const id of Object.keys(templates))expect(editor,`${id} editor`).toContain(`'${id}'`);
  expect(editor).toContain('Media · required');
  expect(editor).toContain('Musiqa preset');
  expect(editor).toContain('Rasmlar');
  expect(editor).toContain('Asosiy video');
});
