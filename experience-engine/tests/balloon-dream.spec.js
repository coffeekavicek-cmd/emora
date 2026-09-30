import { test, expect } from '@playwright/test';

test.describe('Balloon Dream Reborn V2',()=>{
 test('releases 3 balloons → holds hero → breaks ceiling into sky',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto('/?template=birthday-balloon&name=Malika');
  await expect(page.locator('.balloon-dream-reborn')).toBeVisible();
  for(let i=1;i<=3;i++)await page.getByRole('button',{name:i+'-sharni qo‘yib yuboring'}).click();
  await expect(page.locator('.balloon-dream-reborn')).toHaveClass(/phase-hero/,{timeout:4500});
  const hold=page.getByRole('button',{name:'Katta sharni bosib ushlab yoring'}),b=await hold.boundingBox();expect(b).not.toBeNull();
  if(b){const x=b.x+b.width/2,y=b.y+b.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.waitForTimeout(980);await page.mouse.up()}
  await expect(page.locator('.balloon-dream-reborn')).toHaveClass(/phase-silence|phase-sky/,{timeout:3000});
  await expect(page.locator('.balloon-dream-reborn')).toHaveClass(/phase-sky/,{timeout:3000});
  await expect(page.locator('.bdr-ceiling-remains')).toBeVisible();
  await expect(page.locator('.bdr-sky h2')).toContainText('Malika');
  await page.screenshot({path:testInfo.outputPath('balloon-reborn-v2-sky.png'),fullPage:true});
  expect(errors).toEqual([])
 });
 test('editor previews Reborn Balloon Dream V2',async({page})=>{
  await page.goto('/?mode=editor&template=birthday-balloon');
  await expect(page.locator('.reborn-editor')).toBeVisible();
  const preview=page.getByRole('button',{name:'Preview',exact:true});if(await preview.count())await preview.click();
  await expect(page.locator('.re-screen .balloon-dream-reborn')).toBeVisible({timeout:10000})
 });
});
