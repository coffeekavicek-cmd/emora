import { test, expect } from '@playwright/test';

test.describe('Pearl Linen reference',()=>{
  test('mobile creator editor switches between Edit and Preview',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?mode=editor&template=love-pearl');
    await expect(page.locator('.creator-editor')).toBeVisible();
    await expect(page.locator('.ce-panel')).toBeVisible();
    await expect(page.locator('.ce-preview-zone')).toBeHidden();
    await page.locator('#field-recipient').fill('Malika');
    await page.waitForTimeout(650);
    const draft=await page.evaluate(()=>localStorage.getItem('emora:draft:love-pearl'));
    expect(draft).toContain('Malika');

    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-preview-zone')).toBeVisible();
    await expect(page.locator('.ce-phone-screen .pearl-motion')).toBeVisible();

    const box=await page.locator('.ce-phone-screen').boundingBox();
    expect(box?.width).toBeGreaterThan(300);
    expect(box?.height).toBeGreaterThan(650);
    expect(errors).toEqual([]);
  });

  test('recipient ritual reaches the particle finale without scroll or browser errors',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    const expectFullStage=async(selector)=>{
      const dims=await page.locator(selector).evaluate(el=>{
        const r=el.getBoundingClientRect();
        const s=getComputedStyle(el);
        return {width:r.width,height:r.height,left:r.left,top:r.top,transform:s.transform,position:s.position};
      });
      console.log(selector,JSON.stringify(dims));
      expect(dims.width).toBeGreaterThanOrEqual(388);
      expect(dims.height).toBeGreaterThanOrEqual(842);
      expect(Math.abs(dims.left)).toBeLessThanOrEqual(2);
      expect(Math.abs(dims.top)).toBeLessThanOrEqual(2);
    };

    await page.goto('/?template=love-pearl&name=Test');
    await expect(page.locator('.pearl-motion')).toBeVisible();
    await expect(page).toHaveTitle(/Pearl Linen/);
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    await expectFullStage('.pearl-motion');
    await expectFullStage('.pm-intro');
    await page.waitForTimeout(2350);
    await page.screenshot({path:testInfo.outputPath('01-opening.png'),fullPage:true});

    const viewport=await page.evaluate(()=>({
      innerHeight:window.innerHeight,
      scrollHeight:document.documentElement.scrollHeight,
      bodyScrollHeight:document.body.scrollHeight,
    }));
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);
    expect(viewport.bodyScrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);

    await page.getByRole('button',{name:'Maktubni olish'}).click();
    const seal=page.getByRole('button',{name:'Wax muhrni bosib ushlab oching'});
    await expect(seal).toBeVisible();
    await expect(page.locator('.pm-seal canvas')).toHaveCount(1);
    await expectFullStage('.pm-envelope-layer');
    await page.waitForTimeout(1050);
    await page.screenshot({path:testInfo.outputPath('02-seal.png'),fullPage:true});

    const sealBox=await seal.boundingBox();
    expect(sealBox).not.toBeNull();
    if(sealBox){
      const x=sealBox.x+sealBox.width/2;
      const y=sealBox.y+sealBox.height/2;
      await page.mouse.move(x,y);
      await page.mouse.down();
      await page.waitForTimeout(650);
      await page.mouse.up();
    }

    await expect(page.locator('.pearl-motion')).toHaveClass(/step-ink/,{timeout:12000});
    await expect(page.locator('.pm-paper')).toBeVisible();
    await expectFullStage('.pm-letter-layer');
    await page.waitForTimeout(250);
    await page.screenshot({path:testInfo.outputPath('03-letter.png'),fullPage:true});

    const readMore=page.getByRole('button',{name:'Davomini o‘qish →'});
    await expect(readMore).toBeVisible({timeout:5000});
    await readMore.click();
    await expect(readMore).toBeVisible({timeout:5000});
    await readMore.click();

    const continueButton=page.getByRole('button',{name:'Xotiralarni ochish →'});
    await expect(continueButton).toBeVisible({timeout:5000});
    await page.screenshot({path:testInfo.outputPath('04-full-letter.png'),fullPage:true});
    await continueButton.click();

    await page.waitForTimeout(1200);
    await expectFullStage('.pm-memory-layer');
    await expect(page.locator('.pm-photo-fallback')).toHaveCount(3);
    const dragCard=async(selector,dx,dy)=>{
      const card=page.locator(selector);
      await expect(card).toBeVisible();
      const box=await card.boundingBox();
      expect(box).not.toBeNull();
      if(!box)return;
      const x=box.x+box.width/2,y=box.y+box.height/2;
      await page.mouse.move(x,y);
      await page.mouse.down();
      await page.mouse.move(x+dx,y+dy,{steps:12});
      await page.mouse.up();
      await page.waitForTimeout(220);
    };
    await dragCard('.pm-polaroid-0',75,-45);
    await expect(page.locator('.pm-polaroid-1')).toBeVisible({timeout:4000});
    await dragCard('.pm-polaroid-1',105,-25);
    await expect(page.locator('.pm-polaroid-2')).toBeVisible({timeout:4000});
    await dragCard('.pm-polaroid-2',-95,55);

    const release=page.getByRole('button',{name:'Oxirgi sahifa →'});
    await expect(release).toBeVisible({timeout:5000});
    await page.screenshot({path:testInfo.outputPath('05-memories.png'),fullPage:true});
    await release.click();

    const pearl=page.getByRole('button',{name:'Oxirgi satrni bosib ushlab oching'});
    await expect(pearl).toBeVisible({timeout:5000});
    await page.screenshot({path:testInfo.outputPath('06-afterword.png'),fullPage:true});
    const pearlBox=await pearl.boundingBox();
    expect(pearlBox).not.toBeNull();
    if(pearlBox){
      const x=pearlBox.x+pearlBox.width/2,y=pearlBox.y+pearlBox.height/2;
      await page.mouse.move(x,y);
      await page.mouse.down();
      await page.waitForTimeout(1050);
      await page.mouse.up();
    }

    await expect(page.locator('.pearl-motion')).toHaveClass(/step-finale/,{timeout:14000});
    await expect(page.locator('.pm-final-copy')).toBeVisible();
    await expect(page.locator('.pm-particle-counter')).toContainText(/marvarid nuqta/);
    const renderedPoints=Number((await page.locator('.pm-particle-counter b').textContent())?.replace(/\D/g,'')||0);
    expect(renderedPoints).toBeGreaterThanOrEqual(600);
    await expect(page.getByRole('button',{name:'Ulashish'})).toBeVisible();
    const keepsake=page.getByRole('button',{name:'Keepsake saqlash'});
    await expect(keepsake).toBeVisible();
    const downloadPromise=page.waitForEvent('download');
    await keepsake.click();
    const download=await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^emora-pearl-.*\.svg$/);
    await page.screenshot({path:testInfo.outputPath('07-finale.png'),fullPage:true});

    expect(errors).toEqual([]);
  });
});
