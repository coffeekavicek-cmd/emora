import { test, expect } from '@playwright/test';

test.describe('Rose Theatre Reborn V2',()=>{
 test('pulls curtain → moves through 3 scrims → plucks petal → reaches encore',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto('/?template=love-rose&name=Malika');await expect(page.locator('.rose-theatre-reborn')).toBeVisible();
  const rope=page.getByRole('button',{name:'Teatr pardasi arqonini pastga torting'}),b=await rope.boundingBox();expect(b).not.toBeNull();if(b){const x=b.x+b.width/2,y=b.y+60;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+210,{steps:18});await page.mouse.up()}
  await expect(page.locator('.rose-theatre-reborn')).toHaveClass(/phase-acts/,{timeout:3500});
  const next=page.getByRole('button',{name:/Keyingi akt|Final aktga o‘tish/});await next.click();await next.click();await next.click();
  await expect(page.locator('.rose-theatre-reborn')).toHaveClass(/phase-petal/,{timeout:3500});
  const petal=page.getByRole('button',{name:'Atirgul yaprog‘ini pastga torting'}),pb=await petal.boundingBox();expect(pb).not.toBeNull();if(pb){const x=pb.x+pb.width/2,y=pb.y+15;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+180,{steps:15});await page.mouse.up()}
  await expect(page.locator('.rose-theatre-reborn')).toHaveClass(/phase-blackout|phase-finale/,{timeout:2500});
  await expect(page.locator('.rose-theatre-reborn')).toHaveClass(/phase-finale/,{timeout:3000});
  await expect(page.locator('.rtr-finale em')).toContainText('Malika');await page.screenshot({path:testInfo.outputPath('rose-reborn-v2-finale.png'),fullPage:true});expect(errors).toEqual([])
 });
 test('editor previews Reborn Rose Theatre V2',async({page})=>{await page.goto('/?mode=editor&template=love-rose');await expect(page.locator('.reborn-editor')).toBeVisible();const preview=page.getByRole('button',{name:'Preview',exact:true});if(await preview.count())await preview.click();await expect(page.locator('.re-screen .rose-theatre-reborn')).toBeVisible({timeout:10000})});
});
