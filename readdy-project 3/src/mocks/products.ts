export interface ProductLink {
  amazon: string | null;
  rakuten: string | null;
  yahoo: string | null;
  aliexpress: string | null;
}

export interface Product {
  name: string;
  date: string;
  category: '生活もの' | '家電もの' | '機械もの' | '身装もの' | '情報もの';
  image: string;
  links: ProductLink;
  asin?: string; // Amazon商品ID（新商品の自動エンリッチ用・任意）
}

export const products: Product[] = [
  {
    "name": "多機能ケーブル",
    "date": "2026-06-08",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/13696e4a-b806-45ca-84d8-08604559ef81_Sedc9137c903c4e3aa9b4d0838a3a9dd30.webp",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c4OPh2FB"
    }
  },
  {
    "name": "Rayban-Meta Gen2",
    "date": "2026-06-06",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/57625ef1-4ee9-4007-990f-6ceebe589973_31WnhJH31dL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4ecrFcl",
      "rakuten": "https://a.r10.to/hgsi62",
      "yahoo": "https://yahoo.jp/ZxeeHw",
      "aliexpress": null
    }
  },
  {
    "name": "珪藻土バスマット",
    "date": "2026-06-02",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/1efcc0f2-e68a-4c44-a202-e0190fddb67b_image.png",
    "links": {
      "amazon": "https://amzn.to/4egrVbk",
      "rakuten": "https://a.r10.to/hgiGTZ",
      "yahoo": "https://yahoo.jp/TPB8E7",
      "aliexpress": null
    }
  },
  {
    "name": "iphone保護フィルム",
    "date": "2026-05-31",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/cbdda778-8324-4e18-b62d-92e40cc34af9_image.png",
    "links": {
      "amazon": "https://amzn.to/3PyBtVP",
      "rakuten": "https://a.r10.to/h5WpQE",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "ランドリーラック",
    "date": "2026-05-30",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/168fdd2c-4bdd-4a9d-a320-79a06d8ea7c6_image.png",
    "links": {
      "amazon": "https://amzn.to/4fhBbNu",
      "rakuten": "https://a.r10.to/hgQ23w",
      "yahoo": "https://yahoo.jp/kwPJCXE",
      "aliexpress": null
    }
  },
  {
    "name": "スマホリング",
    "date": "2026-05-28",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/f934eaa7-5d79-47ed-aec0-9d640171e5cc_41R3GLjkYJL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4vbNMGw",
      "rakuten": "https://a.r10.to/h55la9",
      "yahoo": "https://yahoo.jp/qqPNEu",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4mPKWtn"
    }
  },
  {
    "name": "配線収納",
    "date": "2026-05-26",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/b78b5eac-747c-4540-8b6b-8e5a6ba98489_image.png",
    "links": {
      "amazon": "https://amzn.to/3RxvqkP",
      "rakuten": "https://a.r10.to/hPHlg9",
      "yahoo": "https://yahoo.jp/xkVorG",
      "aliexpress": null
    }
  },
  {
    "name": "ドッキングステーション",
    "date": "2026-05-25",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/9093d19d-3543-42aa-a051-33b7eabd0ece_image.png",
    "links": {
      "amazon": "https://amzn.to/3RqPl4V",
      "rakuten": "https://a.r10.to/h52npI",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "モニターアーム",
    "date": "2026-05-24",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/a6b148ab-3949-4930-a4f6-19f9d495de9e_image.png",
    "links": {
      "amazon": "https://amzn.to/42V3VEh",
      "rakuten": "https://a.r10.to/hgHsm7",
      "yahoo": "https://yahoo.jp/K2S3rBf",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4FVb177"
    }
  },
  {
    "name": "スマホマイク",
    "date": "2026-05-23",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/154237a2-0f7c-4ff3-a02d-f4c3fc4ec0cc_41qYcKlLo-L.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4dqI65x",
      "rakuten": "https://a.r10.to/hkBgMi",
      "yahoo": "https://yahoo.jp/-AgxMW",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4lPYfop"
    }
  },
  {
    "name": "スマホ三脚",
    "date": "2026-05-23",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/610b9a31-2107-4d11-ba13-e6be289e273f_image.png",
    "links": {
      "amazon": "https://amzn.to/4tUE2j4",
      "rakuten": "https://a.r10.to/hRzb09",
      "yahoo": "https://yahoo.jp/Y3S-kB",
      "aliexpress": null
    }
  },
  {
    "name": "ネックマウント",
    "date": "2026-05-23",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/9ef0057a-799c-4c2d-9ddc-2f211e41801f_image.png",
    "links": {
      "amazon": "https://amzn.to/4uuWnEp",
      "rakuten": "https://a.r10.to/h5A0Gv",
      "yahoo": "https://yahoo.jp/KPdGaL",
      "aliexpress": null
    }
  },
  {
    "name": "プロジェクター",
    "date": "2026-05-22",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/c5138c7d-6ba3-4fa6-84ad-61fdec689bea_image.png",
    "links": {
      "amazon": "https://amzn.to/4vorPEv",
      "rakuten": "https://a.r10.to/hop6oZ",
      "yahoo": "https://yahoo.jp/6Du8KK",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3z8fBMp"
    }
  },
  {
    "name": "最強日傘",
    "date": "2026-05-20",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/15260e19-3698-4b70-a7a2-772ab1a0cf29_image.png",
    "links": {
      "amazon": "https://amzn.to/4dkLuPk",
      "rakuten": "https://a.r10.to/hPxJ9M",
      "yahoo": "https://yahoo.jp/KWGJ7J",
      "aliexpress": null
    }
  },
  {
    "name": "ホワイトボード",
    "date": "2026-05-19",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/365726a0-1e82-4b61-979f-ada034113cd6_image.png",
    "links": {
      "amazon": "https://amzn.to/4dS5ZTF",
      "rakuten": "https://a.r10.to/hPbDdh",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "コンセント付きモバ充",
    "date": "2026-05-18",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/0f30486c-ca59-44de-b193-ec69fc2c8474_image.png",
    "links": {
      "amazon": "https://amzn.to/4wR5Ebw",
      "rakuten": "https://a.r10.to/hHqCb1",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "3台同時モバ充",
    "date": "2026-05-18",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/c603c355-ef84-41b9-b1e6-091ff53e3600_3185dbO7VEL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/43h0RSU",
      "rakuten": "https://a.r10.to/hPjfmt",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "玄関収納",
    "date": "2026-05-17",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/778c2267-9234-46f7-841e-f497901eaea8_image.png",
    "links": {
      "amazon": "https://amzn.to/4eO5Qlf",
      "rakuten": "https://a.r10.to/h52dEF",
      "yahoo": "https://yahoo.jp/FeMtDy",
      "aliexpress": null
    }
  },
  {
    "name": "BOXパッド",
    "date": "2026-05-16",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/b52326be-a65b-42e3-b480-9de56df0bf99_image.png",
    "links": {
      "amazon": "https://amzn.to/4nvjpIq",
      "rakuten": "https://a.r10.to/hYnCiH",
      "yahoo": "https://yahoo.jp/8CN7cZw",
      "aliexpress": null
    }
  },
  {
    "name": "掛け布団",
    "date": "2026-05-16",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/6c62f066-f422-4d53-b20d-9f246fb27330_image.png",
    "links": {
      "amazon": "https://amzn.to/498H1ge",
      "rakuten": "https://a.r10.to/h5BdHp",
      "yahoo": "https://yahoo.jp/mVbowq",
      "aliexpress": null
    }
  },
  {
    "name": "除湿シート",
    "date": "2026-05-16",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/8a224a67-26c7-4956-88ab-f58bebf95bef_image.png",
    "links": {
      "amazon": "https://amzn.to/43hcyJe",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "除湿ベッドパッド",
    "date": "2026-05-16",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/df91d59f-b835-406d-a85f-dba214e3cdf1_756382101.webp",
    "links": {
      "amazon": null,
      "rakuten": "https://a.r10.to/h5BdYa",
      "yahoo": "https://yahoo.jp/A3fT-y",
      "aliexpress": null
    }
  },
  {
    "name": "AI電子ノート",
    "date": "2026-05-15",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/eb0953a6-db81-404a-8a79-7c1a42fad03c_image.png",
    "links": {
      "amazon": "https://amzn.to/4ugj27g",
      "rakuten": "https://a.r10.to/hPlQRz",
      "yahoo": "https://yahoo.jp/LVw-Ft",
      "aliexpress": null
    }
  },
  {
    "name": "ソファベッド",
    "date": "2026-05-14",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/4773f1a2-4592-4a6b-9415-b4ad004e14c1_image.png",
    "links": {
      "amazon": "https://amzn.to/42A0KSc",
      "rakuten": "https://a.r10.to/hPA643",
      "yahoo": "https://yahoo.jp/gtcqpt",
      "aliexpress": null
    }
  },
  {
    "name": "保護フィルム",
    "date": "2026-05-13",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/63f49272-ba50-49da-b5af-39ebc5e9ea74_image.png",
    "links": {
      "amazon": "https://amzn.to/490cMI9",
      "rakuten": "https://a.r10.to/hPDs9T",
      "yahoo": "https://yahoo.jp/6a6iaU",
      "aliexpress": null
    }
  },
  {
    "name": "アーム型マイク",
    "date": "2026-05-11",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/f4cc3fa6-9f99-46d7-bb68-7a0d1a6a90a9_419kiijCjjL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4fkdUKu",
      "rakuten": "https://a.r10.to/hkL03u",
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3kvOf6J"
    }
  },
  {
    "name": "一体型マウスパッド",
    "date": "2026-05-10",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/200474bc-3dc7-46f5-b453-884ec32aa058_31wj-LCNv7L.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4uJqsQq",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "分離型マウスパッド",
    "date": "2026-05-10",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/2d4989b5-209f-4894-8513-bec277ad9a3e_31km-YsdRCL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4fiMWD0",
      "rakuten": "https://a.r10.to/h5z5jM",
      "yahoo": "https://yahoo.jp/oNSYcT",
      "aliexpress": null
    }
  },
  {
    "name": "マウスパッド",
    "date": "2026-05-10",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/08ea9fa9-a8c0-4d3a-a2e4-e913a7a5beaf_4953103286658-5.webp",
    "links": {
      "amazon": null,
      "rakuten": "https://a.r10.to/h5lSfb",
      "yahoo": "https://yahoo.jp/kAw7D4L",
      "aliexpress": null
    }
  },
  {
    "name": "10HAppleWatch表面保護ケース",
    "date": "2026-05-09",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/9743a5af-9089-4255-a7dc-a5ecf5324a26_31fdJ-20ALL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4dyE3nB",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "ほぼ純正のミラネーゼループ",
    "date": "2026-05-09",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/6bfc8fa6-bbee-485b-97c4-0b1b41cf7cdb_image.png",
    "links": {
      "amazon": "https://amzn.to/4rLjlVF",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "レザーバンド",
    "date": "2026-05-09",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/f51a0e15-9569-480c-8a33-12b8f36d5f0c_image.png",
    "links": {
      "amazon": "https://amzn.to/48Mzqnl",
      "rakuten": "https://a.r10.to/hFwWqC",
      "yahoo": "https://yahoo.jp/HqDcTM",
      "aliexpress": null
    }
  },
  {
    "name": "チェーンバンド",
    "date": "2026-05-09",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/5830b40f-04b5-445b-852d-6732c9d8791c_image.png",
    "links": {
      "amazon": "https://amzn.to/45Df2nd",
      "rakuten": "https://a.r10.to/hgktVq",
      "yahoo": "https://yahoo.jp/AY3gdr",
      "aliexpress": null
    }
  },
  {
    "name": "フルカバー保護ケース",
    "date": "2026-05-09",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/dc968199-0514-481e-a9f2-08998f2a99d9_b0cnvw3668-1.jpeg",
    "links": {
      "amazon": null,
      "rakuten": "https://a.r10.to/hgtwDN",
      "yahoo": "https://yahoo.jp/ii5MtY",
      "aliexpress": null
    }
  },
  {
    "name": "表面保護ケース",
    "date": "2026-05-09",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/52d59f47-348c-433e-b9ea-74c871d9683d_pgbk2x.webp",
    "links": {
      "amazon": null,
      "rakuten": "https://a.r10.to/hPOMY3",
      "yahoo": "https://yahoo.jp/88SVF9",
      "aliexpress": null
    }
  },
  {
    "name": "ミラネーゼバンド",
    "date": "2026-05-09",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/d1b6e237-d646-4826-b8ef-a363c3bce4f3_a11watch2025-48-1-1.jpeg",
    "links": {
      "amazon": null,
      "rakuten": "https://a.r10.to/hY2kJN",
      "yahoo": "https://yahoo.jp/QDFJjC",
      "aliexpress": null
    }
  },
  {
    "name": "ドライヤー&アイロンホルダー",
    "date": "2026-05-07",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/3e78dae0-5ff2-478a-a898-826f4798b216_image.png",
    "links": {
      "amazon": "https://amzn.to/4dvPHzy",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "ドライヤー＆ヘアアイロンホルダー",
    "date": "2026-05-07",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/08788c9d-e36c-48ce-bf0f-29a6f7d507ca_yj-7593-sam01k.webp",
    "links": {
      "amazon": null,
      "rakuten": "https://a.r10.to/hgXsop",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "ドライヤー&ヘアアイロンホルダー",
    "date": "2026-05-07",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/4c7d8ece-dd74-4704-8489-48f48656a3d3_assistone-bo3.jpeg",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": "https://yahoo.jp/_-5rVL",
      "aliexpress": null
    }
  },
  {
    "name": "激安節水多機能シャワーヘッド",
    "date": "2026-05-06",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/e526f3dd-18a3-4d26-a68d-0f80681e1f87_image.png",
    "links": {
      "amazon": "https://amzn.to/48HwyYR",
      "rakuten": "https://a.r10.to/hPvuC9",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "燻製機",
    "date": "2026-05-05",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/8e9c97f1-da00-48bd-acf9-242f1531b0ad_image.png",
    "links": {
      "amazon": "https://amzn.to/4d6SL44",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "翻訳イヤホン",
    "date": "2026-05-04",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/f0eb432e-0361-4225-a381-896596ae752b_image.png",
    "links": {
      "amazon": "https://amzn.to/3P2PdYu",
      "rakuten": "https://a.r10.to/TLAcx7",
      "yahoo": "https://yahoo.jp/fUU_57",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3b0E5kB"
    }
  },
  {
    "name": "極小電子ノート",
    "date": "2026-05-03",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/a1b3f3e5-0424-4a46-baaf-96d5c9da8f17_image.png",
    "links": {
      "amazon": "https://amzn.to/3QLLTl5",
      "rakuten": "https://a.r10.to/h5jqXM",
      "yahoo": "https://yahoo.jp/vA7jJw",
      "aliexpress": "https://s.click.aliexpress.com/e/_c2IA8YRd"
    }
  },
  {
    "name": "スケルトンマウス",
    "date": "2026-05-02",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/d96a51e8-4516-4e55-940b-0fd715574857_image.png",
    "links": {
      "amazon": "https://amzn.to/4cQlnOA",
      "rakuten": "https://a.r10.to/h8a9R2",
      "yahoo": "https://yahoo.jp/GUJoAt",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3PmAHZ9"
    }
  },
  {
    "name": "コーニング製ガラスフィルム",
    "date": "2026-05-01",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/247b1a62-9f1a-42c2-9692-4c9d82c3bee6_51CRF1e07OL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/3ONQ8vP",
      "rakuten": "https://a.r10.to/hPykXh",
      "yahoo": "https://yahoo.jp/ZVSzFU",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4qHRZ9h"
    }
  },
  {
    "name": "破格プロジェクター",
    "date": "2026-04-30",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/c32b1ccf-032d-4122-91f4-b3daa7077447_image.png",
    "links": {
      "amazon": "https://amzn.to/4ugUdYl",
      "rakuten": "https://a.r10.to/hoNq85",
      "yahoo": "https://yahoo.jp/YGyRu8",
      "aliexpress": null
    }
  },
  {
    "name": "UI完璧デジタル名刺",
    "date": "2026-04-29",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/7edcfb58-e089-4b4d-98b5-7a193a905ba2_image.png",
    "links": {
      "amazon": "https://amzn.to/4uhhbyH",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "SSDケース",
    "date": "2026-04-28",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/c96f0bd4-1a45-4507-bbab-2dac083dee6c_image.png",
    "links": {
      "amazon": "https://amzn.to/4tD0Rsd",
      "rakuten": "https://a.r10.to/hRHEga",
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c2xMzDTp"
    }
  },
  {
    "name": "浮かせる洗面台ゴミ箱",
    "date": "2026-04-27",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/2738f262-50e1-461b-996d-5817921a1bf0_2196uwR3DyL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4tDZMQS",
      "rakuten": "https://a.r10.to/h8nj8w",
      "yahoo": "https://yahoo.jp/FXW2pE",
      "aliexpress": null
    }
  },
  {
    "name": "性能最強キーボード",
    "date": "2026-04-26",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/8bcd7759-fc7e-4863-979e-ebe7c52e4f98_image.png",
    "links": {
      "amazon": "https://amzn.to/4tzhbdv",
      "rakuten": "https://a.r10.to/hYlinZ",
      "yahoo": "https://yahoo.jp/5nNCkw",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4TPWard"
    }
  },
  {
    "name": "雨音がするキーボード",
    "date": "2026-04-26",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/26b0924d-09d7-4878-93f3-8f73cade4576_image.png",
    "links": {
      "amazon": "https://amzn.to/4cRVD4D",
      "rakuten": "https://a.r10.to/h5BQb3",
      "yahoo": "https://yahoo.jp/FkYGna",
      "aliexpress": null
    }
  },
  {
    "name": "泡音コスパキーボード",
    "date": "2026-04-26",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/3b3ea28b-361c-4c2c-b189-b291ff1396bd_image.png",
    "links": {
      "amazon": "https://amzn.to/4cRW5zR",
      "rakuten": "https://a.r10.to/hPN3wN",
      "yahoo": "https://yahoo.jp/-vasTD",
      "aliexpress": null
    }
  },
  {
    "name": "音が出ないキーボード",
    "date": "2026-04-26",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/959aaedb-4cf0-493e-b477-e8d72832127e_image.png",
    "links": {
      "amazon": "https://amzn.to/41VSo7a",
      "rakuten": "https://a.r10.to/h5Yn1n",
      "yahoo": "https://yahoo.jp/tAvGuQ",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4NjXE63"
    }
  },
  {
    "name": "防災モバ充",
    "date": "2026-04-25",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/7919e34b-a714-45e3-a442-7f145daa7c8e_image.png",
    "links": {
      "amazon": "https://amzn.to/4u3K3dy",
      "rakuten": "https://a.r10.to/hP9zPb",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "防災ライトモジュール",
    "date": "2026-04-25",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/76c9c699-eb7a-4859-a5b6-188b2dc147fc_image.png",
    "links": {
      "amazon": "https://amzn.to/48mRkgg",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "iPadコスパキーボードケース",
    "date": "2026-04-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/51eab0a0-450b-4395-bc17-5338d7242e38_image.png",
    "links": {
      "amazon": "https://amzn.to/4tXASev",
      "rakuten": "https://a.r10.to/hkqmg4",
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3VMdh3L"
    }
  },
  {
    "name": "iPadに付く持ち運びマウス",
    "date": "2026-04-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/d6be9252-e5b7-4ec2-9b43-7477c39107ab_41dtOhCxUyL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4vFLXTe",
      "rakuten": "https://a.r10.to/hgYYAy",
      "yahoo": "https://yahoo.jp/m7LNVD6?openExternalBrowser=1",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4dpZ6hb"
    }
  },
  {
    "name": "探す機能付きコスパAppleペンシル",
    "date": "2026-04-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/f1bbc6dd-7b2a-47c0-bf62-3097c0503e87_31AnFfBotsL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/3OdzPrZ",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c2wyAdU5"
    }
  },
  {
    "name": "iPadプレミアム強化ガラスフィルム",
    "date": "2026-04-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/f9c81caa-eb19-45a4-984a-d564515c712b_418GYHG08sL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/41ITSl6",
      "rakuten": "https://a.r10.to/h5gcFm",
      "yahoo": "https://yahoo.jp/oiESMh",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4Da1gdb"
    }
  },
  {
    "name": "探す機能付きコスパiPadペンシル",
    "date": "2026-04-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/cedecf6c-27a7-447c-95c1-e7d09fb1d6b9_p-476547.jpeg",
    "links": {
      "amazon": null,
      "rakuten": "https://a.r10.to/h5aO1S",
      "yahoo": "https://yahoo.jp/PRpfbd",
      "aliexpress": null
    }
  },
  {
    "name": "iPadにくっ付くマウス",
    "date": "2026-04-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/d4eaf17d-6469-449c-b8bd-aaf00e43c362_bigupshop-es-a-046-i-20250825135458.jpeg",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": "https://yahoo.jp/sQfkLD",
      "aliexpress": null
    }
  },
  {
    "name": "超小型衣類乾燥機",
    "date": "2026-04-16",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/7606ff2e-c7b2-44d9-88fe-a5bb602a2d8a_image.png",
    "links": {
      "amazon": "https://amzn.to/4tSl6BL",
      "rakuten": "https://a.r10.to/hPwuxP",
      "yahoo": "https://yahoo.jp/7mGhdz",
      "aliexpress": null
    }
  },
  {
    "name": "20 in 1コスパドッキングステーション",
    "date": "2026-04-15",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/0d02b8ce-696e-456b-8307-6eeaf0a38e54_image.png",
    "links": {
      "amazon": "https://amzn.to/4t80fKN",
      "rakuten": "https://a.r10.to/hgsHMV",
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c4oQSkTn"
    }
  },
  {
    "name": "軽量多機能ビジネスリュック",
    "date": "2026-04-10",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/1500025d-0419-4ac4-9b50-5f02a1ad6ab2_41HbTex19uL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4t3SbLa",
      "rakuten": "https://a.r10.to/h8Kt1M",
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "2 in 1マルチ充電器",
    "date": "2026-04-04",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/286a203a-f58e-4fac-815e-b555c89cc7bc_image.png",
    "links": {
      "amazon": "https://amzn.to/4siFD1g",
      "rakuten": "https://a.r10.to/hPVIju",
      "yahoo": "https://yahoo.jp/rc3sWz",
      "aliexpress": null
    }
  },
  {
    "name": "MEMC内蔵コスパプロジェクター",
    "date": "2026-04-02",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/c06d507b-efc8-4777-adb1-1a644738039f_image.png",
    "links": {
      "amazon": "https://amzn.to/4v5bKnB",
      "rakuten": "https://a.r10.to/h89mRl",
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c4LriFHf"
    }
  },
  {
    "name": "ポッドキャスト・歌・配信対応マイク",
    "date": "2026-04-01",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/83670073-8e28-471b-9836-80a6898d66d6_31SjopzJdgL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/3O9hP1L",
      "rakuten": "https://a.r10.to/h5foCq",
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c4Brtu3n"
    }
  },
  {
    "name": "イヤホン型AIレコーダー",
    "date": "2026-03-31",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/be9fa1a6-f187-4261-840e-825b7062d990_image.png",
    "links": {
      "amazon": "https://amzn.to/4lWuj9i",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "MagSafe型外付けSSD",
    "date": "2026-03-30",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/b1211faa-cb7e-4746-9222-614311a44cb9_image.png",
    "links": {
      "amazon": "https://amzn.to/48igbBE",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/SpWw4U?openExternalBrowser=1",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3Wqub8v"
    }
  },
  {
    "name": "多機能iPadキーボード付ケース",
    "date": "2026-03-22",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/bc20d677-5189-401a-a44b-3f6371370b52_image.png",
    "links": {
      "amazon": "https://amzn.to/4t15n2S",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c2JyK1v1"
    }
  },
  {
    "name": "携帯性抜群ワイヤレスマウス",
    "date": "2026-03-21",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/932c4ebc-d917-4e25-9196-5ee0e9c4c646_41dtOhCxUyL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/40KdW6g",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c35DK4GJ"
    }
  },
  {
    "name": "魔法のスニーカー",
    "date": "2026-03-20",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/0b77182a-657d-48b7-9389-861dcd946e4c_image.png",
    "links": {
      "amazon": "https://amzn.to/4rCrATH",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/5uhUn-9",
      "aliexpress": null
    }
  },
  {
    "name": "明るさ特化型プロジェクター",
    "date": "2026-03-18",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/f981fe45-a8a8-4b04-a74c-1b4380d61ef5_Sf72ec9cfc0ee48a8953b6418f92cfd9fe.avif",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c4sZ3SR5"
    }
  },
  {
    "name": "音が出ないスコスコキーボード",
    "date": "2026-03-16",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/3b829702-d855-436e-bd83-c73c45fe080e_image.png",
    "links": {
      "amazon": "https://amzn.to/474R9Wh",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/eqUDLD",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3KPqxgf"
    }
  },
  {
    "name": "スマホサイズ台風ドライヤー",
    "date": "2026-03-14",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/a284adc6-85b9-432a-ad96-7afe6f4dfe86_image.png",
    "links": {
      "amazon": "https://amzn.to/413YFNv",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "コスパ最強スマートウォッチ",
    "date": "2026-03-13",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/66b321a2-aaa4-41d6-9c8e-5daa27ba049a_image.png",
    "links": {
      "amazon": "https://amzn.to/4rsG60c",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/AP3QgQ",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4n2GOZH"
    }
  },
  {
    "name": "NOTOSNOW",
    "date": "2026-03-10",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/e2590fb0-fc96-45e6-9c26-23eb0b911e77_image.png",
    "links": {
      "amazon": "https://amzn.to/4llsxOH",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "多機能特化型iPadケース",
    "date": "2026-03-05",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/281ffacb-97b4-4ef5-91d9-06367d74a187_image.png",
    "links": {
      "amazon": "https://amzn.to/4l7j5OW",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c45dndTV"
    }
  },
  {
    "name": "3種類8台同時電源タップ",
    "date": "2026-03-04",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/b58016b4-6190-435b-8219-e0d653ea2346_image.png",
    "links": {
      "amazon": "https://amzn.to/47bIgKp",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "昼でも見れる高性能プロジェクター",
    "date": "2026-03-03",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/8e69cf9e-46c4-4ded-9a67-9cfef204b636_image.png",
    "links": {
      "amazon": "https://amzn.to/4b6lRj3",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "3台同時急速スマホスタンドバッテリー",
    "date": "2026-02-28",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/8d01ba30-80e1-4868-85ab-a9fbea114b33_3185dbO7VEL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4rGLrlz",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "Airpodspro3ケースcyber",
    "date": "2026-02-27",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/d21cfa67-4e49-4033-888d-c4fa56c5d12e_41mNg-U99rL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4rYRQsJ",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/QoWsoh",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3ZWzufp"
    }
  },
  {
    "name": "Airpods pro3ケースorbit",
    "date": "2026-02-27",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/ce5c718b-b9a2-4f5e-a19a-ec9546353844_41K12EbzghL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4u3YPSA",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3ZWzufp"
    }
  },
  {
    "name": "Airpods pro3ケースpulse",
    "date": "2026-02-27",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/69555f09-336b-4cef-aba6-6ae82e3535b5_41zhFTnj2EL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/4bdBrub",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3ZWzufp"
    }
  },
  {
    "name": "4KWebカメラ",
    "date": "2026-02-24",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/3ce40826-de3e-4bd3-a2d5-42c11eb1066d_31uglzeqYgL.-SL500-.jpeg",
    "links": {
      "amazon": "https://amzn.to/3Mp9DK4",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/6x-PWr",
      "aliexpress": "https://s.click.aliexpress.com/e/_c335BIdV"
    }
  },
  {
    "name": "100W急速特化型モバ充",
    "date": "2026-02-22",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/eeff3a1e-e9e6-4c5d-b616-a07ab7535265_image.png",
    "links": {
      "amazon": "https://amzn.to/3Oti7Aw",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "休日デートに最適なバッグ",
    "date": "2026-02-21",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/c0ebba43-a116-4f39-9466-d26f4ece6a11_image.png",
    "links": {
      "amazon": "https://amzn.to/3OD5SRI",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/NHEpgn",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3o4JVkX"
    }
  },
  {
    "name": "Huawei Freeclip2",
    "date": "2026-02-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/0b9367fc-8533-4b71-bf68-8ae13201445e_image.png",
    "links": {
      "amazon": "https://amzn.to/4rDs0tK",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/QdcGcs",
      "aliexpress": null
    }
  },
  {
    "name": "冷却ファン付き車載充電スタンド",
    "date": "2026-02-19",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/a73790d1-eb38-4b83-8831-a201177f90a0_image.png",
    "links": {
      "amazon": "https://amzn.to/4rtVjz9",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/-fDQoV",
      "aliexpress": null
    }
  },
  {
    "name": "ESR 車載充電スタンド",
    "date": "2026-02-19",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/2fda427d-4bf0-4c6f-b728-241dac35bd65_Sf27849c533e241d0ae96adadaa935aa3M.avif",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3fx4r3d"
    }
  },
  {
    "name": "水の泡の音が鳴るキーボード",
    "date": "2026-02-18",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/9bf38064-e946-4635-ba33-4d721d28c14c_image.png",
    "links": {
      "amazon": "https://amzn.to/46agi1o",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/eac37x",
      "aliexpress": null
    }
  },
  {
    "name": "激安コスパプロジェクター",
    "date": "2026-02-17",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/a0489165-e1c9-47a0-bb20-1223bceb7bc3_image.png",
    "links": {
      "amazon": "https://amzn.to/3MAt7Lx",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/e9iwWG",
      "aliexpress": "https://s.click.aliexpress.com/e/_c2z7FS2f"
    }
  },
  {
    "name": "硬度10HAppleWatch表面保護ケース",
    "date": "2026-02-09",
    "category": "生活もの",
    "image": "https://m.media-amazon.com/images/I/61jen5bKoXL._AC_SX569_.jpg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0FZP3CDP8?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3wL7r3z"
    },
    "asin": "B0FZP3CDP8"
  },
  {
    "name": "硬度9HAppleWatch両面保護ケース",
    "date": "2026-02-09",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/6d9724f7-2605-4a6d-ae4f-1f80caad68d2_image.png",
    "links": {
      "amazon": "https://amzn.to/4chHi2C",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "持ち運び用3台同時冷却付き充電スタンド",
    "date": "2026-02-06",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/16c43408-6955-4950-a328-944a4deb1897_411cR8sHK4L.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0FHQDKX7G?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    },
    "asin": "B0FHQDKX7G"
  },
  {
    "name": "3台同時冷却付き急速充電スタンド",
    "date": "2026-02-06",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/aca89599-2edc-4a03-8ecb-845998252c0b_41eu2VvfH0L.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0FHQFBQSM?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/i7uGZE",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3VQIq3D"
    },
    "asin": "B0FHQFBQSM"
  },
  {
    "name": "雨の音がするキーボード",
    "date": "2026-02-05",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/9573bc5c-37e3-4884-a980-3456550c5a05_image.png",
    "links": {
      "amazon": "https://amzn.to/4bCq7Zq",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/sU8apig",
      "aliexpress": "https://s.click.aliexpress.com/e/_c42HJy0j"
    }
  },
  {
    "name": "スマホ用三脚",
    "date": "2026-02-02",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/8466e70f-961f-4560-a7e3-0fc9d2a6f3aa_image.png",
    "links": {
      "amazon": "https://amzn.to/3NYoeMH",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c4cSVSOJ"
    }
  },
  {
    "name": "8役MagSafe変換アダプタ",
    "date": "2026-01-27",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/d6615fa8-319b-479f-97dd-b441d0da6833_image.png",
    "links": {
      "amazon": "https://amzn.to/4qHFVyv",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3LGxsvd"
    }
  },
  {
    "name": "大容量高出力モバ充",
    "date": "2026-01-24",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/bc69fda6-3d19-4d28-850e-67788a7cf243_image.png",
    "links": {
      "amazon": "https://amzn.to/4rbHDbt",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/Bx9xRo",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3dh2uHd"
    }
  },
  {
    "name": "耳を塞がないイヤホン",
    "date": "2026-01-23",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/dcdbccc0-f87b-4693-a1a3-58b3082630e9_image.png",
    "links": {
      "amazon": "https://amzn.to/49R7WMO",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3ye3mhz"
    }
  },
  {
    "name": "USBメモリ",
    "date": "2026-01-19",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/ac84b254-92c2-49d4-bb62-39705e0ea26d_31g9qTjxFdL.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0FFSW6GSB?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/r5_T4W",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3gASdH1"
    },
    "asin": "B0FFSW6GSB"
  },
  {
    "name": "iPad保護フィルム",
    "date": "2026-01-16",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/322124d4-adfc-4a8d-adb6-ca8ffed9f358_41nmudEMKzL.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0F7RJ4VF2?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/KuYAA3",
      "aliexpress": "https://s.click.aliexpress.com/e/_c2yPHfcP"
    },
    "asin": "B0F7RJ4VF2"
  },
  {
    "name": "対面特化型翻訳イヤホン",
    "date": "2026-01-12",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/ffe85436-b7be-4188-b0dd-219d60f16b3a_image.png",
    "links": {
      "amazon": "https://amzn.to/49z0Rkb",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/dbWr8b",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3nfJ0ML"
    }
  },
  {
    "name": "指に吸い付くキーボード",
    "date": "2026-01-11",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/e1ce4f1a-be98-4af0-95bc-f0b7b3a416ef_image.png",
    "links": {
      "amazon": "https://amzn.to/4bpcNr1",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/DCGpdM",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4nFwdhZ"
    }
  },
  {
    "name": "角度5個ipadケース",
    "date": "2026-01-08",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/fc76dd15-e821-4a5c-b69d-9442e8470818_4104mnlJkmL.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0FJWTYQ3Q?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/Kb3tYq",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3VnJFf5"
    },
    "asin": "B0FJWTYQ3Q"
  },
  {
    "name": "PC用AIレコーダー",
    "date": "2026-01-07",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/81e134cb-3e53-4f6c-ae79-940185b3a9a6_image.png",
    "links": {
      "amazon": "https://amzn.to/4qireSE",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/c_8ZAQV",
      "aliexpress": null
    }
  },
  {
    "name": "AIイヤホン",
    "date": "2026-01-07",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/e0aee2ad-0ef3-48c3-910d-1275fcb474d3_image.png",
    "links": {
      "amazon": "https://amzn.to/3YMYGVf",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/iFLuwM",
      "aliexpress": null
    }
  },
  {
    "name": "電気ケトル",
    "date": "2026-01-05",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/b0f26d03-26e0-400d-b219-6b14be6956e4_image.png",
    "links": {
      "amazon": "https://amzn.to/3NtbiOx",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/CmEYpv",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3sOdFpv"
    }
  },
  {
    "name": "コスパ最強タブレット",
    "date": "2026-01-03",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/22f7ac57-426f-408b-9711-337d466ec9f0_image.png",
    "links": {
      "amazon": "https://amzn.to/3L0SGF3",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "TCLプロジェクター",
    "date": "2026-01-02",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/d2a592e4-7e73-496c-80f8-6518a6912426_image.png",
    "links": {
      "amazon": "https://amzn.to/4rkeV8m",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "コスパ最強カナル型イヤホン",
    "date": "2025-12-28",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/d77231d4-5f37-48d7-97f7-8f6a002c0f5a_image.png",
    "links": {
      "amazon": "https://amzn.to/4qto26a",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/6mhzmu",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4nQylYJ"
    }
  },
  {
    "name": "AirPodsケース",
    "date": "2025-12-26",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/4dcf084d-5237-45b4-8058-ab3932a14536_image.png",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0CP923PXC?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/e_YugH",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4CQWwZH"
    },
    "asin": "B0CP923PXC"
  },
  {
    "name": "コスパ最強マイク",
    "date": "2025-12-24",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/86a05e3e-0b4d-420f-a99d-9895dc48ca63_image.png",
    "links": {
      "amazon": "https://amzn.to/4pdI4Rb",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/YK8ubq",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4MNDtIx"
    }
  },
  {
    "name": "電動歯ブラシ",
    "date": "2025-12-23",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/0fb1b0cc-f230-40ad-91c8-790c36c7c07c_image.png",
    "links": {
      "amazon": "https://amzn.to/3YIdWCu",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "オープン型コスパイヤホン",
    "date": "2025-12-22",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/a065bb27-bb55-44b2-83b5-c9ab33e865c7_image.png",
    "links": {
      "amazon": "https://amzn.to/4jfjw98",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "激安多機能ペンシル",
    "date": "2025-12-19",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/fdfdf789-dffa-4b64-8d0d-3f958262b99c_31AnFfBotsL.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0DM5ZLR2S?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/4hyZNH",
      "aliexpress": "https://s.click.aliexpress.com/e/_c34frqYx"
    },
    "asin": "B0DM5ZLR2S"
  },
  {
    "name": "4way充電スタンド",
    "date": "2025-12-18",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/1a125e38-79d8-4182-83af-3fe8b566e845_image.png",
    "links": {
      "amazon": "https://amzn.to/3KRTf3S",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "ミステリーランチ",
    "date": "2025-12-14",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/fcefafa8-f78a-4ede-9cb1-449f17b9cc78_image.png",
    "links": {
      "amazon": "https://amzn.to/44ZSn3T",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/mgvauU",
      "aliexpress": null
    }
  },
  {
    "name": "多機能iPadケース",
    "date": "2025-12-12",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/580f1a4d-a081-42c3-beda-d415820fc6b8_image.png",
    "links": {
      "amazon": "https://amzn.to/4iPwrhw",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/GygMJa",
      "aliexpress": null
    }
  },
  {
    "name": "iPadケース",
    "date": "2025-12-12",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/d30301e1-0a7b-44be-86aa-7ead2f8545f6_Sf8d7dd7636e648eb95f9643a79321c85a.avif",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c4KrxLgr"
    }
  },
  {
    "name": "8in1変換アダプタ",
    "date": "2025-12-11",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/9eedf4c3-621c-4cf5-b608-8d6ed8e2d911_image.png",
    "links": {
      "amazon": "https://amzn.to/3KWRxhz",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c3qtffcf"
    }
  },
  {
    "name": "139言語翻訳イヤホン",
    "date": "2025-12-07",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/2a4b1f55-3e5b-4fce-99c5-30e80015687a_image.png",
    "links": {
      "amazon": "https://amzn.to/4pZLHLr",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/AqtXYs",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4dhBLkf"
    }
  },
  {
    "name": "LUSHマウスウォッシュ",
    "date": "2025-12-04",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/fd33adcd-fd4b-4c15-8d2d-6181c798c1ae_image.png",
    "links": {
      "amazon": "https://amzn.to/4oEJLXv",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/d6Lr6x",
      "aliexpress": null
    }
  },
  {
    "name": "インテリア充電スタンド",
    "date": "2025-11-30",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/31e989c0-2a94-433a-81f2-9b18331e8a30_image.png",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "4刀流ケーブル",
    "date": "2025-11-29",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/e32f0323-8f75-4051-8d7a-4adb208237dd_image.png",
    "links": {
      "amazon": "https://amzn.to/4omrjTa",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/eb5CS3",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4ERlUIn"
    }
  },
  {
    "name": "業界初モバイルスタンド",
    "date": "2025-11-26",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/cc66bd32-efaa-47fc-b868-bb23cfc80b48_image.png",
    "links": {
      "amazon": "https://amzn.to/3XlPWVd",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "空飛ぶカメラマン",
    "date": "2025-11-24",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/49a9caa1-3899-43a7-9176-d8cf53c86da8_image.png",
    "links": {
      "amazon": "https://amzn.to/43NAQeV",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/hXbuab",
      "aliexpress": null
    }
  },
  {
    "name": "ヨロイのairpodspro3ケース",
    "date": "2025-11-21",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/99cb0f1e-834a-4535-bf3b-46652a53bdcf_41naNprkHiL.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0FGXSSB1Y?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/NpStBp",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3GXGT2b"
    },
    "asin": "B0FGXSSB1Y"
  },
  {
    "name": "4刀流サウナハット",
    "date": "2025-11-15",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/cc933c6b-9151-4b6a-b2de-d7bc30681a2b_image.png",
    "links": {
      "amazon": "https://amzn.to/4oe36OV",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "北欧建築的リュック",
    "date": "2025-11-13",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/4278b30b-4820-43d0-8be0-538aad3fc4cd_212zAitkpuL.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B0DX78SQF9?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/DrgQcU",
      "aliexpress": null
    },
    "asin": "B0DX78SQF9"
  },
  {
    "name": "USBハブ合体PCスタンド",
    "date": "2025-11-12",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/f7ed76ea-e554-4ef9-a118-437f1314f367_image.png",
    "links": {
      "amazon": "https://amzn.to/3LUi1Ai",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/hakc7Q",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3nyfEDN"
    }
  },
  {
    "name": "最強プロジェクター",
    "date": "2025-11-07",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/d0a1b2bf-f4bc-4ad7-acfa-ae1b874692b6_image.png",
    "links": {
      "amazon": "https://amzn.to/4990zBG",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/nS_oX6",
      "aliexpress": "https://s.click.aliexpress.com/e/_c2QbPswJ"
    }
  },
  {
    "name": "特水",
    "date": "2025-11-06",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/45549dab-0274-4e4f-9bcf-f508ce2fe998_image.png",
    "links": {
      "amazon": "https://amzn.to/4ow70nm",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/Ub5vpv",
      "aliexpress": null
    }
  },
  {
    "name": "激安高性能モニター",
    "date": "2025-11-03",
    "category": "家電もの",
    "image": "https://ugc.production.linktr.ee/3bca37c3-828c-4846-b1fa-65b000b141ad_image.png",
    "links": {
      "amazon": "https://amzn.to/4hIJfpy",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/_7Mudz",
      "aliexpress": null
    }
  },
  {
    "name": "5台同時ケーブル内蔵急速モバ充",
    "date": "2025-10-31",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/29d64b81-3d47-4bf3-80b4-e1723f4c05d5_image.png",
    "links": {
      "amazon": "https://amzn.to/4oJR54t",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "タイパ2倍イヤホン",
    "date": "2025-10-26",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/4ec752e6-0846-440d-a4f3-ad43df1767ad_image.png",
    "links": {
      "amazon": "https://amzn.to/4oEdNv0",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/_-DBMu",
      "aliexpress": "https://s.click.aliexpress.com/e/_c33FF12b"
    }
  },
  {
    "name": "紹介/人狼超えるカドゲ",
    "date": "2025-10-22",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/ed0240da-7be9-4a86-b23f-92593816be2d_image.png",
    "links": {
      "amazon": "https://amzn.to/3L7lTxv",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "人狼超えるカドゲ",
    "date": "2025-10-22",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/5ffd9a17-97ef-477d-ae79-eade0d46732c_ytradecenter-804551093838-i-20250322015635.jpeg",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": "https://yahoo.jp/KgR3sp",
      "aliexpress": null
    }
  },
  {
    "name": "イヤホン版耳かき",
    "date": "2025-10-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/706426d1-5a7d-4f50-9281-93b202f82a18_31ZQ9P7zm9L.-SL500-.jpeg",
    "links": {
      "amazon": "https://www.amazon.co.jp/dp/B09XTG813Q?tag=iimonozukan-media-22",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/a3oeVX",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4BrZP51"
    },
    "asin": "B09XTG813Q"
  },
  {
    "name": "浄水ポット",
    "date": "2025-10-16",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/99a8029b-aa84-4a54-beca-4ef9f16b1a65_image.png",
    "links": {
      "amazon": "https://amzn.to/3KQruby",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/5r5awq",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3hFik19"
    }
  },
  {
    "name": "浄水ポットのカートリッジ",
    "date": "2025-10-16",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/e0557a77-28e2-435a-807c-d38b2b84b208_image.png",
    "links": {
      "amazon": "https://amzn.to/496kilC",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c39ASvPd"
    }
  },
  {
    "name": "britaカートリッジ",
    "date": "2025-10-16",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/709ba409-6f92-4967-a927-b85118023558_brita-maxtraplus-8-p-i-20260310124008.jpeg",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": "https://yahoo.jp/iQMZit",
      "aliexpress": null
    }
  },
  {
    "name": "カード型財布GPS",
    "date": "2025-10-14",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/59c3dd44-d786-44b0-bacb-ad62dbac2104_image.png",
    "links": {
      "amazon": "https://amzn.to/4n4fNeK",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/UAg2P9",
      "aliexpress": null
    }
  },
  {
    "name": "スポンジハンカチ",
    "date": "2025-10-11",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/6ee7eb71-76df-4a21-8208-7d44102edcf2_image.png",
    "links": {
      "amazon": "https://amzn.to/4q4jsf8",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/Xb6LUb",
      "aliexpress": null
    }
  },
  {
    "name": "ネックスタンド",
    "date": "2025-10-10",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/69a8b0ba-f3ad-4e8e-8526-8ba3b0cc8c01_image.png",
    "links": {
      "amazon": "https://amzn.to/4okQmXw",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/f2c6ARw",
      "aliexpress": "https://s.click.aliexpress.com/e/_c3yfmuu7"
    }
  },
  {
    "name": "MagSafeリング",
    "date": "2025-10-07",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/fbdaad17-efe7-4c22-add3-4c446d97df65_image.png",
    "links": {
      "amazon": "https://amzn.to/42yhTMz",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/ZnnNzC",
      "aliexpress": "https://s.click.aliexpress.com/e/_c4rDhmJZ"
    }
  },
  {
    "name": "多機能レザーAirpods pro3ケース",
    "date": "2025-10-06",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/42890755-3d03-447f-b9da-e9b9b6eabf63_image.png",
    "links": {
      "amazon": "https://amzn.to/3IJx7aV",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "せつない香水",
    "date": "2025-10-05",
    "category": "生活もの",
    "image": "https://ugc.production.linktr.ee/694931ac-dcfe-4f40-8e37-6b7419f2d322_image.png",
    "links": {
      "amazon": "https://amzn.to/48JBwFt",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/7-3hqf",
      "aliexpress": null
    }
  },
  {
    "name": "外出用充電器",
    "date": "2025-10-03",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/eccb6c09-ab25-4112-8ace-ae04203fadc5_image.png",
    "links": {
      "amazon": "https://amzn.to/3J6qFuu",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/dxmEPe",
      "aliexpress": "https://s.click.aliexpress.com/e/_c40mr9wj"
    }
  },
  {
    "name": "CtoAケーブル",
    "date": "2025-10-03",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/fd1cd054-472a-4584-8548-cf7a745968b7_image.png",
    "links": {
      "amazon": "https://amzn.to/4900Wyu",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/pfY8N3J",
      "aliexpress": null
    }
  },
  {
    "name": "CtoCケーブル",
    "date": "2025-10-03",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/460c8599-b317-48bb-a2fa-d00574864e07_image.png",
    "links": {
      "amazon": "https://amzn.to/3W4P46K",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "最新ピンマイク",
    "date": "2025-09-29",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/c8ee2ffe-4d3e-47cb-a6bc-ba0aee1e0207_image.png",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": null,
      "aliexpress": "https://s.click.aliexpress.com/e/_c380KQlz"
    }
  },
  {
    "name": "最強モバイルバッテリー",
    "date": "2025-09-23",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/b8ad5729-b1e3-46bf-ace6-2faa76227545_image.png",
    "links": {
      "amazon": "https://amzn.to/3WxdqWT",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/yBy6vhu",
      "aliexpress": "https://s.click.aliexpress.com/e/_c2zN9c0j"
    }
  },
  {
    "name": "iphone17proシリーズ",
    "date": "2025-09-21",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/b01538e3-9d91-4e46-a0bb-ae5bfbd0642a_image.png",
    "links": {
      "amazon": "https://amzn.to/475ZVSX",
      "rakuten": null,
      "yahoo": null,
      "aliexpress": null
    }
  },
  {
    "name": "iphone17pro",
    "date": "2025-09-21",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/ef6e8e37-6175-4aff-a3bb-7b0b4dfedff9_jcka-mobile2-4549995648294-i-20260410182845.jpeg",
    "links": {
      "amazon": null,
      "rakuten": null,
      "yahoo": "https://yahoo.jp/S_5dk9",
      "aliexpress": null
    }
  },
  {
    "name": "AirPodPro3",
    "date": "2025-09-20",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/64a572e0-f272-4ed3-bd6b-da24687a9424_image.png",
    "links": {
      "amazon": "https://amzn.to/3WDTH7X",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/_TxXoi",
      "aliexpress": null
    }
  },
  {
    "name": "テックウーブンケース",
    "date": "2025-09-16",
    "category": "機械もの",
    "image": "https://ugc.production.linktr.ee/1dc6782a-96b3-4a78-ac39-1696779a0eb1_image.png",
    "links": {
      "amazon": "https://amzn.to/43jodbg",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/T_8R9e",
      "aliexpress": null
    }
  },
  {
    "name": "リカバリークロス",
    "date": "2026-04-24",
    "category": "身装もの",
    "image": "https://ugc.production.linktr.ee/b7bbc1f9-f08f-45f7-bc02-547e259bac98_image.png",
    "links": {
      "amazon": "https://amzn.to/4u97OB3",
      "rakuten": null,
      "yahoo": "https://yahoo.jp/o7DsmZ",
      "aliexpress": null
    }
  }
];
