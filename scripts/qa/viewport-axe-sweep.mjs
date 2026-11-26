// Viewport + accessibility sweep (see scripts/qa/README.md).
// Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/qa/viewport-axe-sweep.mjs <outDir> <customerEmail> <customerPassword>
// Needs: dev server running, Google Chrome installed, `axe-core` in node_modules. No npm install of browser tooling required.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:3001';
const OUT = process.argv[2];
const CUSTOMER = { email: process.argv[3], password: process.argv[4] };
const AXE = fs.readFileSync(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const PORT = 9333;
const VIEWPORTS = [{ n: '375', w: 375, h: 812, mobile: true }, { n: '768', w: 768, h: 1024, mobile: false }, { n: '1440', w: 1440, h: 900, mobile: false }];
const SETS = {
  public: { creds: null, routes: ['/', '/plans', '/contact', '/about', '/medcity-smiles', '/login', '/register', '/forgot-password', '/terms', '/privacy', '/admin/login'] },
  customer: { creds: CUSTOMER, routes: ['/dashboard/overview', '/dashboard/delivery', '/dashboard/community', '/dashboard/health', '/dashboard/settings', '/subscribe?plan=standard'] },
  admin: { creds: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }, routes: ['/admin', '/admin/leads', '/admin/subscriptions', '/admin/payments', '/admin/content', '/admin/content/new', '/admin/staff', '/admin/audit-log', '/admin/audit-log?kind=content&page=1', '/admin/content?q=banner&status=draft'] },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-gpu', 'about:blank',
], { stdio: 'ignore' });

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
      return t.webSocketDebuggerUrl;
    } catch { await sleep(500); }
  }
  throw new Error('chrome did not start');
}

class Cdp {
  constructor(url) { this.id = 0; this.cb = new Map(); this.ev = []; this.ws = new WebSocket(url); this.ready = new Promise((r) => (this.ws.onopen = r));
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && this.cb.has(d.id)) { this.cb.get(d.id)(d); this.cb.delete(d.id); } else if (d.method) this.ev.push(d); }; }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((r) => this.cb.set(id, r)); }
  async eval(expr) { const r = await this.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 200)); return r.result?.result?.value; }
}

const results = [];
const cdp = new Cdp(await wsUrl());
await cdp.ready;
await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');

async function goto(url) {
  cdp.ev.length = 0;
  await cdp.send('Page.navigate', { url });
  for (let i = 0; i < 80; i++) { await sleep(250); const s = await cdp.eval('document.readyState').catch(() => ''); if (s === 'complete') break; }
  await sleep(1800);
}

const PAGE_JS = `(async()=>{ ${''}
  const r = await axe.run({runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa']});
  const de=document.documentElement;
  const wide=[...document.querySelectorAll('body *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'}).slice(0,3).map(e=>e.tagName+'.'+String(e.className).slice(0,40));
  const tiny=[...document.querySelectorAll('a,button,input,select,textarea')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0&&(b.height<24||b.width<24)&&!e.disabled&&getComputedStyle(e).visibility!=='hidden'}).length;
  return {path:location.pathname,title:document.title,iw:innerWidth,overflowX:de.scrollWidth>innerWidth,scrollW:de.scrollWidth,wide,tiny,viol:r.violations.map(v=>v.id+':'+v.impact+':'+v.nodes.length)};
})()`;

for (const [label, set] of Object.entries(SETS)) {
  for (const vp of VIEWPORTS) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: vp.mobile });
    // fresh session per set/viewport
    await goto(BASE + '/api/health');
    await cdp.eval(`fetch('/api/auth/logout',{method:'POST'})`);
    if (set.creds) {
      const st = await cdp.eval(`fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify(set.creds)})}).then(r=>r.status)`);
      if (st !== 200) { results.push({ label, vp: vp.n, error: 'login ' + st }); continue; }
    }
    for (const route of set.routes) {
      try {
        await goto(BASE + route);
        await cdp.eval(AXE);
        const data = await cdp.eval(PAGE_JS);
        const errs = cdp.ev.filter((e) => (e.method === 'Runtime.exceptionThrown') || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error' && !/favicon|404/.test(e.params.entry.text + e.params.entry.url))).map((e) => (e.params.entry?.text || e.params.exceptionDetails?.text || '').slice(0, 100));
        const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(`${OUT}/${label}_${vp.n}_${route.replace(/[^a-z0-9]+/gi, '_')}.png`, Buffer.from(shot.result.data, 'base64'));
        results.push({ label, vp: vp.n, route, ...data, errs });
      } catch (e) { results.push({ label, vp: vp.n, route, error: String(e).slice(0, 160) }); }
    }
  }
}
fs.writeFileSync(OUT + '/results.json', JSON.stringify(results, null, 1));
chrome.kill();
const bad = results.filter((r) => r.error || r.overflowX || (r.viol && r.viol.length) || (r.errs && r.errs.length));
console.log('total', results.length, 'with issues', bad.length);
for (const r of bad) console.log(JSON.stringify({ l: r.label, vp: r.vp, route: r.route, err: r.error, iw: r.iw, ox: r.overflowX, sw: r.scrollW, wide: r.wide, viol: r.viol, errs: r.errs }));
const tinyList = results.filter((r) => r.tiny).map((r) => `${r.vp}${r.route}:${r.tiny}`);
console.log('small touch/click targets (<24px):', tinyList.join(' '));
process.exit(0);
