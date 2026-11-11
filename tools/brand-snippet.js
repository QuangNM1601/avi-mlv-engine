// mlv brand snippet — chạy trong tab web chủ đầu tư (javascript_tool), trả JSON ≤ ~300 ký tự.
// Bản một dòng trong SKILL.md được rút gọn từ file này; sửa ở đây thì cập nhật cả SKILL.md.
(() => {
  const rgb = s => { const m = String(s).match(/[\d.]+/g); return m && m.length >= 3 ? m.slice(0, 3).map(Number) : null };
  const alpha = s => { const m = String(s).match(/[\d.]+/g); return m && m.length >= 4 ? +m[3] : 1 };
  const hex = a => '#' + a.map(x => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
  const sat = a => Math.max(...a) - Math.min(...a);
  const hue = a => { const [r, g, b] = a.map(x => x / 255), M = Math.max(r, g, b), m = Math.min(r, g, b), d = M - m; if (!d) return 0; const h = M === r ? (g - b) / d % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360 };
  const W = {};
  const add = (c, w) => { const a = rgb(c); if (!a || alpha(c) < .5 || sat(a) < 40) return; const h = hex(a); W[h] = (W[h] || 0) + w };
  [...document.querySelectorAll('header,nav,header *,nav *,a,button,.btn,[class*=btn],[class*=Btn],h1,h2,h3,footer')].slice(0, 900).forEach(el => {
    const cs = getComputedStyle(el), btn = el.matches('button,.btn,[class*=btn],[class*=Btn]');
    add(cs.backgroundColor, btn ? 6 : 2); add(cs.color, el.matches('h1,h2,h3') ? 3 : 1); add(cs.borderTopColor, 1);
  });
  const top = Object.entries(W).sort((a, b) => b[1] - a[1]).map(x => x[0]);
  const primary = top[0] || null;
  const h2a = h => h.slice(1).match(/../g).map(x => parseInt(x, 16));
  const dh = (a, b) => { const d = Math.abs(hue(h2a(a)) - hue(h2a(b))); return Math.min(d, 360 - d) };
  const accent = (primary && top.find(h => dh(h, primary) > 40)) || top[1] || null;
  const font = getComputedStyle(document.querySelector('h1,h2') || document.body).fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const img = [...document.querySelectorAll('header img,nav img,a[href="/"] img,[class*=logo] img,img[class*=logo],img[alt*=logo i],img[src*=logo i]')]
    .find(i => i.naturalWidth >= 40 && i.naturalWidth / Math.max(1, i.naturalHeight) <= 8);
  const og = document.querySelector('meta[property="og:site_name"]');
  return JSON.stringify({
    site: location.hostname,
    name: (og && og.content) || document.title.split(/[|\-–—]/)[0].trim(),
    primary, accent, colors: top.slice(0, 4), font,
    logo: img ? (/^data:/.test(img.currentSrc || img.src) ? 'inline' : (img.currentSrc || img.src)) : null
  });
})()
