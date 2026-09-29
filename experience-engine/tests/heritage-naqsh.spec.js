import { test, expect } from '@playwright/test';
test.describe('Heritage Naqsh dedicated ritual',()=>{
 test('trace → name → medallion lock → invitation',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto('/?template=wedding-naqsh&name=Aziza&date=2026-10-10T18%3A00&venue=Heritage%20Hall&address=Tashkent');await expect(page.locator('.heritage-naqsh')).toBeVisible();await expect(page).toHaveTitle(/Heritage Naqsh/);
  await page.getByRole('button',{name:/Naqshni boshlash/}).click();const trace=page.getByRole('button',{name:'Naqsh yo‘lini barmoq bilan chizing'}),tb=await trace.boundingBox();expect(tb).not.toBeNull();
  if(tb){let x=tb.x+tb.width*.25,y=tb.y+tb.height*.35;await page.mouse.move(x,y);await page.mouse.down();for(let i=0;i<8;i++){x+=85*(i%2? -1:1);y+=72;await page.mouse.move(x,y,{steps:5})}await page.mouse.up()}
  await expect(page.locator('.heritage-naqsh')).toHaveClass(/phase-names/,{timeout:4000});await page.screenshot({path:testInfo.outputPath('01-naqsh-name.png'),fullPage:true});
  await page.getByRole('button',{name:/Markazni yakunlash/}).click();const med=page.getByRole('button',{name:'Markaziy medalyonni to‘g‘ri joyiga aylantiring'}),mb=await med.boundingBox();expect(mb).not.toBeNull();
  if(mb){const x=mb.x+mb.width/2,y=mb.y+mb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+190,y,{steps:14});await page.mouse.up()}
  await expect(page.locator('.heritage-naqsh')).toHaveClass(/phase-finale/,{timeout:4000});await expect(page.locator('.hn-event')).toContainText('Heritage Hall');await page.screenshot({path:testInfo.outputPath('02-naqsh-finale.png'),fullPage:true});expect(errors).toEqual([]);
 });
 test('editor uses Heritage Naqsh runtime',async({page})=>{await page.goto('/?mode=editor&template=wedding-naqsh');await page.getByRole('button',{name:'Preview',exact:true}).click();await expect(page.locator('.ce-phone-screen .heritage-naqsh')).toBeVisible({timeout:10000});await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0)});
});