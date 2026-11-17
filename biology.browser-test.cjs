// Run with PLAYWRIGHT_MODULE pointing to an installed playwright or playwright-core.
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {QUESTIONS}=require('./biology_core.js');
(async()=>{
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0];if(!/^[/][a-zA-Z0-9_.-]+$/.test(name)){res.writeHead(404).end();return;}try{res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(__dirname+name));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
try{for(const width of [390,1280]){
const page=await browser.newPage({viewport:{width,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const url='http://127.0.0.1:'+server.address().port+'/biology_quiz.html';await page.goto(url);await page.locator('#startAll').click();
for(let i=0;i<36;i++){
const prompt=await page.locator('#prompt').textContent(),q=QUESTIONS.find(q=>q.prompt===prompt);assert.ok(q);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
await page.locator('#check').click();assert.equal(await page.locator('#feedback').isVisible(),false,'blank rejected');
if(i<2)await page.locator('#skip').click();else {if(q.source.startsWith('Extra'))await page.getByRole('button',{name:q.answer,exact:true}).click();else await page.locator('#answer').fill(q.answer.toUpperCase());await page.locator('#check').click();assert.equal(await page.locator('#result').textContent(),'Correct!');}
assert.ok((await page.locator('#explanation').textContent()).length>35);assert.ok(await page.locator('#check').isDisabled());await page.locator('#next').click();}
assert.match(await page.locator('#summaryScore').textContent(),/34 [/] 36/);await page.locator('#retry').click();
for(let i=0;i<2;i++){const prompt=await page.locator('#prompt').textContent(),item=QUESTIONS.find(q=>q.prompt===prompt);if(item.source.startsWith('Extra'))await page.getByRole('button',{name:item.answer,exact:true}).click();else await page.locator('#answer').fill(item.answer);await page.locator('#check').click();await page.locator('#next').click();}
assert.match(await page.locator('#summaryScore').textContent(),/2 [/] 2/);assert.ok(await page.locator('#retry').isDisabled());
await page.reload();assert.ok(await page.locator('#reviewStart').isDisabled());await page.locator('#startSheet').click();assert.match(await page.locator('#progressText').textContent(),/of 14/);await page.locator('#skip').click();await page.reload();assert.equal(await page.locator('#reviewStart').isDisabled(),false);await page.locator('#reviewStart').click();assert.match(await page.locator('#progressText').textContent(),/of 1/);await page.locator('#finish').click();assert.match(await page.locator('#summaryScore').textContent(),/0 [/] 0/);
await page.goto(url.replace('biology_quiz.html','index.html'));assert.equal(await page.locator('a[href="biology_quiz.html"]').count(),1);assert.deepEqual(errors,[]);await page.close();console.log('PASS browser '+width+'px: full round, blank validation, score, retries, persistence, early finish, landing');}
}finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
