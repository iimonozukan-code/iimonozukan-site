// いいもの図鑑 — Amazon 新タグリンク化 ＋ PA-APIで公式画像取得
import fs from 'node:fs';
import path from 'node:path';
import amazonPaapi from 'amazon-paapi';

const FILE = path.resolve('src/mocks/products.ts');
const TAG = process.env.PAAPI_PARTNER_TAG || 'iimonozukan-media-22';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const common = {
  AccessKey: process.env.PAAPI_ACCESS_KEY,
  SecretKey: process.env.PAAPI_SECRET_KEY,
  PartnerTag: TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.co.jp',
  Host: 'webservices.amazon.co.jp',
  Region: 'us-west-2',
};

function findAsin(s) {
  if (!s) return null;
  for (const key of ['/dp/', '/gp/product/']) {
    const i = s.indexOf(key);
    if (i >= 0) {
      const c = s.substr(i + key.length, 10);
      if (/^[A-Z0-9]{10}$/.test(c)) return c;
    }
  }
  return null;
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

async function main() {
  const { src, start, end, arr } = load();
  let tagFixed = 0;
  for (const p of arr) {
    const asin = p.asin || findAsin(p.links && p.links.amazon);
    if (asin) {
      p.asin = asin;
      const link = 'https://www.amazon.co.jp/dp/' + asin + '?tag=' + TAG;
      if (p.links.amazon !== link) { p.links.amazon = link; tagFixed++; }
    }
  }
  const need = arr.filter((p) => p.asin && (!p.image || p.image.indexOf('linktr.ee') >= 0));
  console.log('画像取得対象: ' + need.length + ' 件');
  const byAsin = new Map();
  for (let i = 0; i < need.length; i += 10) {
    const ItemIds = [...new Set(need.slice(i, i + 10).map((p) => p.asin))];
    try {
      const data = await amazonPaapi.GetItems(common, { ItemIds, ItemIdType: 'ASIN', Resources: ['Images.Primary.Large'] });
      const items = (data && data.ItemsResult && data.ItemsResult.Items) || [];
      for (const it of items) {
        const img = it && it.Images && it.Images.Primary && it.Images.Primary.Large && it.Images.Primary.Large.URL;
        if (img) byAsin.set(it.ASIN, img);
      }
    } catch (e) {
      console.error('PA-APIエラー詳細:', JSON.stringify(e && e.message), JSON.stringify(e && e.response && e.response.data));
    }
    await sleep(1500);
  }
  let imgFixed = 0;
  for (const p of arr) {
    if (p.asin && byAsin.has(p.asin)) { p.image = byAsin.get(p.asin); imgFixed++; }
  }
  save(src, start, end, arr);
  console.log('完了: タグ更新 ' + tagFixed + ' 件, 画像更新 ' + imgFixed + ' 件');
}

main().catch((e) => { console.error(e); process.exit(1); });
