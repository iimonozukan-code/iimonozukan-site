// いいもの図鑑 — Amazon PA-API 一括エンリッチ
// やること:
//   1) Amazonリンクがあって asin 未設定の商品は、短縮リンク(amzn.to)等をたどって ASIN を自動解決
//   2) PA-API で「公式画像 + 新タグ入りリンク(DetailPageURL)」を取得
//   3) src/mocks/products.ts に書き込む
// ※ ブラウザでの大量アクセスは使わない（アフィリ垢のボット判定回避）。PA-APIは公式・安全。
//
// 使い方:
//   1) .env に PAAPI_ACCESS_KEY / PAAPI_SECRET_KEY / PAAPI_PARTNER_TAG を設定
//   2) npm install            （初回のみ）
//   3) npm run enrich:amazon            … 画像が空の商品だけ
//      npm run enrich:amazon -- --all   … 既存も含めAmazonリンクのあるものすべてをLinktree→公式画像へ

import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import amazonPaapi from 'amazon-paapi';

const FILE = path.resolve('src/mocks/products.ts');
const REFRESH_ALL = process.argv.includes('--all');

const { PAAPI_ACCESS_KEY, PAAPI_SECRET_KEY, PAAPI_PARTNER_TAG } = process.env;
if (!PAAPI_ACCESS_KEY || !PAAPI_SECRET_KEY || !PAAPI_PARTNER_TAG) {
  console.error('❌ .env に PAAPI_ACCESS_KEY / PAAPI_SECRET_KEY / PAAPI_PARTNER_TAG を設定してください。');
  process.exit(1);
}

const commonParameters = {
  AccessKey: PAAPI_ACCESS_KEY,
  SecretKey: PAAPI_SECRET_KEY,
  PartnerTag: PAAPI_PARTNER_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.co.jp',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const findAsin = (url) => (url && url.match(/(?:\/dp\/|\/gp\/product\/|\/dp\/product\/)([A-Z0-9]{10})/)) ?.[1] || null;

function loadProducts() {
  const src = fs.readFileSync(FILE, 'utf8');
  const match = src.match(/(export const products: Product\[\] = )(\[[\s\S]*\])(;)/);
  if (!match) throw new Error('products 配列が見つかりませんでした。');
  return { src, match, arr: JSON.parse(match[2]) };
}

function saveProducts(src, match, arr) {
  const json = JSON.stringify(arr, null, 2);
  fs.writeFileSync(FILE, src.slice(0, match.index) + match[1] + json + match[3] + src.slice(match.index + match[0].length));
}

// amzn.to 等の短縮/長尺URLをたどって ASIN を取り出す（プレーンHTTP・無認証＝アフィリ垢に紐づかない）
async function resolveAsin(url) {
  const direct = findAsin(url);
  if (direct) return direct;
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
    return findAsin(res.url) || findAsin(await res.text());
  } catch (e) {
    console.warn('  ASIN解決失敗:', url, e?.message ?? e);
    return null;
  }
}

async function main() {
  const { src, match, arr } = loadProducts();

  // 1) ASIN解決（Amazonリンクがあって asin 未設定のもの）
  const toResolve = arr.filter((p) => p.links?.amazon && !p.asin);
  if (toResolve.length) console.log(`ASIN解決: ${toResolve.length} 件...`);
  for (const p of toResolve) {
    const asin = await resolveAsin(p.links.amazon);
    if (asin) p.asin = asin;
    await sleep(600);
  }

  // 2) PA-APIで画像＋新タグリンク取得（asinあり & 画像が空 or --all）
  const targets = arr.filter((p) => p.asin && (REFRESH_ALL || !p.image || p.image.includes('linktr.ee')));
  console.log(`PA-API取得: ${targets.length} 件...`);
  const byAsin = new Map();
  for (let i = 0; i < targets.length; i += 10) {
    const ItemIds = [...new Set(targets.slice(i, i + 10).map((p) => p.asin))];
    try {
      const data = await amazonPaapi.GetItems(commonParameters, {
        ItemIds,
        ItemIdType: 'ASIN',
        Resources: ['Images.Primary.Large', 'ItemInfo.Title'],
      });
      for (const item of data?.ItemsResult?.Items ?? []) {
        byAsin.set(item.ASIN, { image: item?.Images?.Primary?.Large?.URL ?? '', link: item?.DetailPageURL ?? '' });
      }
    } catch (e) {
      console.error('  PA-APIエラー:', e?.message ?? e);
    }
    await sleep(1200); // レート制限対策
  }

  let filled = 0;
  for (const p of arr) {
    if (p.asin && byAsin.has(p.asin)) {
      const got = byAsin.get(p.asin);
      if (got.image) { p.image = got.image; filled += 1; }
      if (got.link) p.links = { ...p.links, amazon: got.link };
    }
  }

  saveProducts(src, match, arr);
  console.log(`✅ 完了：画像/リンク更新 ${filled} 件、ASIN解決 ${toResolve.filter((p) => p.asin).length} 件。`);
}

main().catch((e) => { console.error(e); process.exit(1); });
