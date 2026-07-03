import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
const firstMediaIndex = css.indexOf('@media');
const baseCss = firstMediaIndex === -1 ? css : css.slice(0, firstMediaIndex);

for (const sectionId of ['hero', 'why', 'demo', 'features', 'coverage', 'start']) {
  assert.match(html, new RegExp(`<section id="${sectionId}"`), `missing section: ${sectionId}`);
}

assert.match(html, /class="[^"]*\bportfolio-page\b/, 'page should use portfolio-board presentation');
assert.match(html, /class="[^"]*\bboard-cover\b/, 'homepage should be a cover-style board');
assert.ok(!html.includes('cover-brand-lockup'), 'homepage should remove the centered 2D IP brand lockup');
assert.match(html, /class="[^"]*\bhero-title-lockup\b/, 'homepage should use a title plus 3D mascot lockup');
assert.match(html, /class="[^"]*\bhero-mascot-sitter\b/, 'homepage should place a sitting 3D IP on the title');
assert.match(html, /kora-3d-mascot-sitting-title-v1\.png/, 'homepage should use the sitting 3D IP asset');
assert.match(html, /<p class="hero-subtitle" data-stagger="2">\s*<span class="hero-subtitle-line">外国人来中国旅行<\/span>\s*<span class="hero-subtitle-line">餐厅推荐？语言不通？找不到路？<\/span>\s*<span class="hero-subtitle-line">问KORA！<\/span>\s*<\/p>/, 'homepage subtitle should split into the requested three mobile lines');
assert.ok(!html.includes('在中国旅行，餐厅推荐？语言不通？找不到路？问KORA！'), 'homepage subtitle should not use the old unstructured one-line copy');
assert.ok(!html.includes('沟通不畅'), 'homepage subtitle should not use the old communication-friction phrase');
assert.match(baseCss, /\.hero-subtitle-line\s*{[^}]*display:\s*block/s, 'homepage subtitle lines should always be block-level');
assert.match(baseCss, /\.hero-subtitle-line\s*{[^}]*white-space:\s*nowrap/s, 'homepage subtitle lines should not internally wrap');
assert.match(baseCss, /\.hero-subtitle-line\s*\+\s*\.hero-subtitle-line\s*{[^}]*margin-left:\s*0/s, 'subtitle lines should not rely on inline spacing between spans');
assert.match(css, /\.hero-title-lockup\s*{[^}]*margin:\s*200px auto 0/s, 'hero title group should move higher under the mascot hand');
assert.match(css, /\.hero-title-lockup\s*{[^}]*padding-top:\s*128px/s, 'hero title should move up enough for the mascot legs to overlap it');
assert.ok(!html.includes('hero-showcase'), 'homepage should no longer include a phone showcase');
assert.ok(!html.includes('hero-phone'), 'homepage should not include a phone model');
for (const fragment of ['AI LOCAL GUIDE', 'FOR CHINA', 'Live Telegram Flow', 'Decision, not search', 'Shanghai deep, China live']) {
  assert.ok(!html.includes(fragment), `page should remove unnecessary English phrase: ${fragment}`);
}
assert.ok(!html.includes('地址不直观'), 'why section should remove the address pain point');
assert.ok(!html.includes('推荐难判断'), 'why section should remove the recommendation pain point');
assert.ok(!html.includes('KORA 不是在替中国人解决问题'), 'why section should remove the old bottom-left summary');
assert.ok(!html.includes('而是在替外国人理解中国'), 'why section should remove the old bottom-right summary');
assert.match(html, /class="[^"]*\bheadline-line\b[^"]*\bno-break\b[^"]*">对外国人是一套复杂的系统<\/span>/, 'why headline should keep the key phrase on one line');
assert.match(html, /class="[^"]*\bapp-route-panel\b/, 'why section should use an app route panel');
assert.match(html, /class="[^"]*\bapp-logo-wall\b/, 'why section should post all local app logos');
for (const appName of ['大众点评', '高德地图', '美团', '滴滴打车', '微信', '支付宝']) {
  assert.match(html, new RegExp(appName), `why section should include ${appName}`);
}
for (const logoAbbrev of ['<span>点</span>', '<span>高</span>', '<span>美</span>', '<span>滴</span>', '<span>微</span>', '<span>支</span>']) {
  assert.ok(!html.includes(logoAbbrev), `app tile should not use one-character logo substitute: ${logoAbbrev}`);
}
assert.match(css, /\.app-logo\s*{[^}]*place-items:\s*center/s, 'app tiles should center the app names');
assert.match(html, /class="[^"]*\bapp-journey\b/, 'why section should show the restaurant search journey across apps');
assert.match(html, /class="[^"]*\bworkflow-grid\b/, 'workflow should use a board grid');
assert.match(html, /<h2>KORA，<span class="no-break">答案更称心<\/span><\/h2>/, 'workflow headline should be short enough for mobile');
for (const workflowTitle of ['场景定制', '理解卡点', '行动建议']) {
  assert.match(html, new RegExp(`<h3>${workflowTitle}</h3>`), `workflow should include ${workflowTitle}`);
}
assert.equal([...html.matchAll(/class="[^"]*\bworkflow-card\b/g)].length, 3, 'workflow should use three parallel cards');
assert.ok(!html.includes('step-dot'), 'workflow cards should not use numeric 1/2/3 labels');
assert.match(css, /\.workflow-grid\s*{[^}]*grid-template-columns:\s*repeat\(3,/s, 'workflow grid should be three columns on desktop');
assert.match(html, /class="[^"]*\bgeo-diagram\b/, 'coverage should use a dedicated diagram');

const phoneModels = [...html.matchAll(/\biphone-17-pro-silver\b/g)];
assert.equal(phoneModels.length, 1, 'phone model should appear only once in the live usage example');
assert.ok(!html.includes('phone-crop'), 'workflow should not introduce extra phone models');
assert.ok(!html.includes('scene-phone-row'), 'demo should not use the old three-phone row');
assert.ok(!html.includes('focus-phone-board'), 'page should not include a third phone focus board');
assert.ok(!html.includes('kora-tourist-reply-middlecolumn.png'), 'page should not embed the old real Telegram screenshot');

assert.match(html, /class="[^"]*\btelegram-live-demo\b/, 'demo phone should contain a live Telegram-style conversation animation');
assert.match(html, /<h2>一屏一句，<span class="no-break">答案尽现。<\/span><\/h2>/, 'demo headline should be concise and keep the second phrase together');
assert.ok(!html.includes('一句话，<span class="no-break">心中有数。'), 'demo headline should remove the old wording');
assert.ok(!html.includes('class="device-status"'), 'phone status should not sit outside the animated screen');
assert.match(html, /class="[^"]*\btelegram-status\b/, 'phone status should live inside the animated Telegram screen');
assert.match(html, /class="[^"]*\btelegram-island\b/, 'camera island should live inside the animated Telegram screen');
assert.match(html, /class="[^"]*\btelegram-wallpaper\b/, 'Telegram-style chat wallpaper should be restored inside the animation');
assert.match(css, /telegram-doodle-wallpaper\.svg/, 'Telegram wallpaper should use the doodle background asset');
assert.ok(existsSync(new URL('../assets/generated/telegram-doodle-wallpaper.svg', import.meta.url)), 'Telegram doodle wallpaper asset should exist');
assert.match(html, /class="[^"]*\btom-typing\b/, 'Tom should have a typing state before sending');
assert.match(html, /class="[^"]*\btom-message\b/, 'Tom should send a visible Telegram-style message');
assert.match(html, /Tom/, 'phone simulation may keep the traveler name Tom');
assert.match(html, /class="[^"]*\bread-receipt\b/, 'Tom message should show read check marks');
assert.match(html, /class="[^"]*\bkora-typing\b/, 'KORA should show a typing/loading state');
assert.match(html, /class="[^"]*\bkora-answer\b/, 'KORA should return the animated answer');
assert.match(html, /<div class="chat-row chat-row--tom tom-message">\s*<div class="message-stack">[\s\S]*?<\/div>\s*<div class="tom-avatar">T<\/div>\s*<\/div>/, 'Tom message avatar should be on the right side');
assert.match(html, /<div class="chat-row chat-row--kora kora-answer">\s*<img class="kora-mini-avatar"/, 'KORA answer avatar should remain on the left side');

assert.match(html, /class="[^"]*\bchina-map-expansion\b/, 'coverage section should include an expanding China coverage map');
assert.match(html, /<h2><span class="no-break">上海深度，全国可用<\/span><\/h2>/, 'coverage headline should be concise and unbroken');
assert.match(html, /class="[^"]*\bchina-map--mainland\b/, 'coverage map should use the revised mainland China outline');
assert.match(html, /src="assets\/generated\/china-mainland-outline\.svg"/, 'coverage map should use a real generated China outline asset');
assert.match(html, /data-map-source="geojson-100000"/, 'coverage map should identify the real GeoJSON boundary source');
assert.ok(!html.includes('M78 219 L91 190'), 'coverage map should not use the old hand-drawn polygon path');
const chinaMapAssetUrl = new URL('../assets/generated/china-mainland-outline.svg', import.meta.url);
assert.ok(existsSync(chinaMapAssetUrl), 'generated mainland China outline SVG should exist');
const chinaMapSvg = readFileSync(chinaMapAssetUrl, 'utf8');
assert.match(chinaMapSvg, /viewBox="0 0 620 460"/, 'generated China outline should share the overlay coordinate system');
assert.match(chinaMapSvg, /class="china-land"/, 'generated China outline should contain a real land path');
assert.match(chinaMapSvg, /data-source="https:\/\/geo\.datav\.aliyun\.com\/areas_v3\/bound\/100000\.json"/, 'generated China outline should record its boundary data source');
assert.match(html, /class="[^"]*\bshanghai-marker\b/, 'coverage section should anchor the animation at Shanghai');
assert.match(html, /class="[^"]*\bcoverage-mascot\b/, 'coverage section should place a 3D mascot at the Shanghai point');
assert.match(html, /class="[^"]*\bcoverage-overlay\b/, 'coverage map labels should share the real map coordinate overlay');
assert.match(html, /class="[^"]*\bcoverage-arcs\b/, 'coverage section should add animated arcs from Shanghai');
assert.match(html, /<svg[^>]*class="[^"]*\bcoverage-arcs\b"[^>]*data-origin="ip-head"/, 'coverage arcs should explicitly start from the mascot head');
assert.equal([...html.matchAll(/class="coverage-arc\s/g)].length, 5, 'coverage should show five animated outbound arcs');
assert.equal([...html.matchAll(/d="M468 198/g)].length, 5, 'all coverage arcs should originate from the real-map mascot-head coordinate');
for (const cityName of ['哈尔滨', '新疆', '四川', '海南', '北京']) {
  assert.match(html, new RegExp(cityName), `coverage should label a long-range destination: ${cityName}`);
}
assert.match(css, /@keyframes\s+coverageArcFlow/, 'coverage arcs should animate');
assert.match(css, /\.board-coverage\.visible\.is-replaying-map\s+\.coverage-arcs\s*{[^}]*scale\(1\)/s, 'coverage arcs should expand to full map scale when replaying');
assert.match(css, /@media\s*\(max-width:\s*430px\)[\s\S]*?\.china-map,\s*[\s\S]*?\.coverage-arcs,\s*[\s\S]*?\.coverage-overlay\s*{[^}]*width:\s*min\(108vw,\s*420px\)/s, 'mobile coverage map should be larger inside the phone viewport');
assert.match(css, /@media\s*\(max-width:\s*430px\)[\s\S]*?\.coverage-mascot\s*{[^}]*width:\s*72px/s, 'mobile coverage mascot should shrink so it does not cover city labels');
assert.match(css, /@media\s*\(max-width:\s*430px\)[\s\S]*?\.city-pill\s*{[^}]*z-index:\s*12/s, 'mobile city labels should render above the mascot');
assert.match(html, /kora-3d-mascot-guide-cutout\.png/, 'coverage mascot should use a transparent cutout asset');
assert.ok(existsSync(new URL('../assets/generated/kora-3d-mascot-guide-cutout.png', import.meta.url)), 'transparent guide mascot asset should exist');

assert.match(html, /kora-avatar\.jpg/, '2D KORA avatar should be used for the top-left page mark');
assert.ok(existsSync(new URL('../assets/generated/kora-3d-mascot-sitting-title-v1.png', import.meta.url)), 'sitting title mascot asset should exist');
assert.match(html, /kora-3d-mascot-guide-cutout\.png/, 'page should use the generated 3D guide mascot cutout');
assert.match(html, /kora-3d-mascot-thinking-v1\.png/, 'page should use the generated 3D thinking mascot');
assert.match(html, /kora-3d-mascot-happy-recommend-v1\.png/, 'page should use the generated 3D recommendation mascot');
assert.match(html, /kora-3d-mascot-wave-v1\.png/, 'start page should use the welcoming waving 3D mascot');
assert.ok(!html.includes('kora-3d-mascot-reminder-v1.png'), 'start page should not use the puzzled reminder mascot');

const amapLinks = [...html.matchAll(/href="([^"]*uri\.amap\.com\/marker[^"]*)"/g)].map((match) => match[1]);
assert.equal(amapLinks.length, 3, 'the KORA answer should include three real Amap marker links');
assert.ok(!html.includes('href="#"'), 'links should not use placeholder href values');

assert.match(css, /\.iphone-17-device\b/, 'CSS should define the iPhone 17-style device shell');
assert.match(css, /\.iphone-17-pro-silver\b/, 'CSS should define the iPhone 17 Pro silver finish');
assert.match(css, /--pro-silver-edge:/, 'silver Pro mockup should define a dedicated silver aluminum edge token');
assert.match(css, /--phone-real-ratio:\s*928\s*\/\s*2048/, 'phone model should use the real tall screenshot ratio');
assert.match(css, /\.iphone-17-screen\s*{[^}]*height:\s*100%/s, 'animated screen should cover the full phone model area');
assert.match(css, /\.iphone-17-screen::before\s*{[^}]*top:\s*54%/s, 'phone screen reflection should start in the lower half');
assert.match(css, /\.iphone-17-screen::before\s*{[^}]*bottom:\s*0/s, 'phone screen reflection should keep the lower gloss');
assert.ok(!/radial-gradient\(circle at 78% 0%/.test(css), 'phone screen should remove the upper glare that hurts readability');
assert.match(css, /\.iphone-17-bezel\s*{[^}]*border:\s*0\b/s, 'phone screen should not include the old black inner border');
assert.ok(!/border:\s*7px\s+solid\s+#05070c/.test(css), 'phone screen should remove the visible black inner ring');
assert.match(css, /\.demo-head h2 \.no-break\s*{[^}]*font-size:\s*inherit/s, 'demo headline no-break span should inherit the h2 size instead of eyebrow styling');
assert.match(css, /\.demo-head h2 \.no-break\s*{[^}]*color:\s*inherit/s, 'demo headline no-break span should inherit the h2 color instead of eyebrow styling');
assert.match(css, /\.chat-row--tom\s*{[^}]*grid-template-columns:\s*1fr\s+32px/s, 'Tom chat rows should reserve the avatar column on the right');
assert.match(css, /\.chat-row--tom\s+\.message-stack\s*{[^}]*align-items:\s*flex-end/s, 'Tom bubbles should align to the right');
assert.match(css, /\.chat-row--kora\s*{[^}]*padding-right:/s, 'KORA chat rows should leave more empty space on the right');
assert.match(html, /<h2><span class="no-break">轻松上手，<\/span><span class="no-break">打开就问<\/span><\/h2>/, 'start section should express a low-friction start');
assert.match(html, /<h3><span class="no-break">搜索 @Kora_china_bot<\/span><\/h3>/, 'start step 2 title should be protected from line breaks');
assert.match(css, /\.start-track h3\s*{[^}]*white-space:\s*nowrap/s, 'start step titles should stay on one line');
assert.ok(!css.includes('.start-track::before'), 'start steps should not render a decorative vertical connector line');
assert.match(html, /<p><span class="no-break">快来试试，<\/span><span class="no-break">我这地地道道的新伙计。<\/span><\/p>/, 'start support copy should use the new welcoming phrase and protect line breaks');
assert.match(css, /@keyframes\s+tomTyping/, 'CSS should animate Tom typing');
assert.match(css, /@keyframes\s+tomSend/, 'CSS should animate Tom sending a message');
assert.match(css, /@keyframes\s+koraTyping/, 'CSS should animate KORA typing');
assert.match(css, /@keyframes\s+koraAnswer/, 'CSS should animate KORA answer reveal');
assert.match(css, /@keyframes\s+coverageExpand/, 'CSS should animate Shanghai-to-China coverage expansion');
assert.match(css, /\.board-coverage\.visible\.is-replaying-map\s+\.china-map/, 'coverage map animation should be restartable when section re-enters view');
assert.match(js, /restartCoverageAnimation/, 'JS should explicitly restart coverage animation on viewport entry');
assert.match(js, /is-replaying-map/, 'JS should toggle the replay class for coverage animation');

console.log('site smoke checks passed');
