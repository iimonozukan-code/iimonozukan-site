// いいもの図鑑 — Amazon リンク新タグ化 ＋ 画像取得（PA-API不要）
// amzn.to等を辿ってASINを取得し、dp/ASIN?tag= の新タグリンクへ作り直し、
// 商品ページの og:image を拾って Linktree 画像を置き換える。
import fs from 'node:fs';
import path from 'node:path';

const FILE = path.resolve('src/mocks/products.ts');
const TAG = process.env.PAAPI_PARTNER_TAG || 'iimonozukan-media-22';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findAsin(s) {
  if (!s) return null;
  for (const key of ['/dp/', '/gp/product/']) {
    const i = s.indexOf(key);
    if (i >= 0) {
      const cand = s.substr(i + key.length, 10);
      if (/^[A-Z0-9]{10}$/.test(cand)) return cand;
    }
  }
  return null;
}

function extractImage(html) {
  let i = html.indexOf('og:image');
  if (i < 0) return '';
  i = html.indexOf('content="', i);
  if (i < 0) return '';
  const start = i + 9;
  const end = html.indexOf('"', start);
  return end > start ? html.slice(start, end) : '';
}

function load() {
  const src = fs.readFileSync(FILE, 'utf8');
  const decl = src.indexOf('export const products');
  const start = src.indexOf('[', src.indexOf('=', decl));
  const end = src.lastIndexOf(']');
  return { src, start, end, arr: JSON.parse(src.slice(start, end + 1)) };
}

function save(src, start, end, arr) {
  fs.writeFileSync(FILE, src.slice(0, start) + JSON.stringify(arr, null, 2) + src.slice(end + 1));
}

async function fetchProduct(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36' } });
    const html = await res.text();
    return { asin: findAsin(res.url) || findAsin(html), image: extractImage(html) };
  } catch (e) {
    console.error('取得失敗:', e && e.message);
    return { asin: null, image: '' };
  }
}

async function main() {
  const { src, start, end, arr } = load();
  const targets = arr.filter((p) => p.links && p.links.amazon);
  console.log('Amazon商品 ' + targets.length + ' 件を処理...');
  let tagFixed = 0;
  let imgFixed = 0;
  for (const p of targets) {
    let asin = p.asin || findAsin(p.links.amazon);
    const needImage = !p.image || p.image.indexOf('linktr.ee') >= 0;
    let image = '';
    if (!asin || needImage) {
      const r = await fetchProduct(p.links.amazon);
      if (!asin) asin = r.asin;
      image = r.image;
      await sleep(500);
    }
    if (asin) {
      p.asin = asin;
      const link = 'https://www.amazon.co.jp/dp/' + asin + '?tag=' + TAG;
      if (p.links.amazon !== link) { p.links.amazon = link; tagFixed++; }
      if (image && needImage) { p.image = image; imgFixed++; }
    }
  }
  save(src, start, end, arr);
  console.log('完了: タグ更新 ' + tagFixed + ' 件, 画像更新 ' + imgFixed + ' 件');
}

main().catch((e) => { console.error(e); process.exit(1); });
