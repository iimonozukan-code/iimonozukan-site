export type SupportedLanguage = 'ja' | 'en';

export type LocalizedText = Record<SupportedLanguage, string>;

/** 掲載状態。needs_review は「紹介条件が未確認」= 公開前に確認する */
export type AiToolStatus = 'active' | 'needs_review' | 'paused';

export type AiTool = {
  id: number;
  name: string;
  company: string;
  /** remixiconのクラス名。サムネ画像が無いときのタイル表示に使う */
  icon: string;
  /** ロゴ・文字色。タイルの見出し色になる */
  accentColor: string;
  /** タイル背景グラデーション（上→下） */
  bgFrom: string;
  bgTo: string;
  /** 公式ロゴ画像のURL。読み込めないときは icon にフォールバック */
  logoUrl: string | null;
  /** 9:16のサムネ画像。設定されていればタイル全面に表示 */
  imageUrl: string | null;
  tagline: LocalizedText;
  description: LocalizedText;
  categories: Record<SupportedLanguage, string[]>;
  pricingLabel: LocalizedText;
  referral: {
    url: string;
    code: string | null;
    /** 読者のメリットを前に出したラベル。例：無料プラン付き招待リンク */
    label: LocalizedText;
    /** 読者にとっての条件・メリット */
    benefit: LocalizedText;
    /** 使っていない（サイト全体の開示文でカバー） */
    disclosure: LocalizedText;
    /** ポップアップ内の大きいボタン */
    ctaLabel: LocalizedText;
    /** カード直下の小さいボタン */
    shortCtaLabel: LocalizedText;
    checkedAt: string;
    status: AiToolStatus;
  };
  sortOrder: number;
  isPublished: boolean;
};

/**
 * Supabaseに `ai_tools` テーブルが無い／空のときに使う初期データ。
 * 公開後の追加・編集は /admin/ai-tools から行い、ここは触らない。
 */
export const AI_TOOL_SEED: AiTool[] = [
  {
    id: -1,
    name: 'Claude',
    company: 'Anthropic',
    icon: 'ri-chat-3-line',
    accentColor: '#b95837',
    bgFrom: '#f8f1ea',
    bgTo: '#eddccc',
    logoUrl: '/ai/claude.svg',
    imageUrl: null,
    tagline: {
      ja: '考える、書く、作るを、一緒に進めるAI',
      en: 'An AI partner for thinking, writing, and building',
    },
    description: {
      ja: '文章作成、リサーチ、企画の壁打ち、資料整理、コーディングまで幅広く使える対話型AIです。',
      en: 'A conversational AI for writing, research, brainstorming, document review, and coding.',
    },
    categories: {
      ja: ['文章・チャット', '調査', '開発'],
      en: ['Writing & chat', 'Research', 'Coding'],
    },
    pricingLabel: { ja: '無料から試せる', en: 'Free tier available' },
    referral: {
      url: 'https://claude.ai/referral/7DwqyHZ7lQ',
      code: null,
      label: { ja: '無料ではじめる招待リンク', en: 'Invite link · start free' },
      benefit: {
        ja: '無料プランのまま使いはじめられます。クレジットカードの登録は不要です。',
        en: 'Start on the free plan — no credit card required to sign up.',
      },
      disclosure: { ja: '', en: '' },
      ctaLabel: { ja: 'Claudeの登録ページを見る', en: 'View Claude registration' },
      shortCtaLabel: { ja: '登録ページを見る', en: 'Sign up' },
      checkedAt: '2026-07-25',
      status: 'needs_review',
    },
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: -2,
    name: 'Fish Audio',
    company: 'Fish Audio',
    icon: 'ri-mic-2-line',
    accentColor: '#1578d3',
    bgFrom: '#eef7ff',
    bgTo: '#d8e9fa',
    logoUrl: 'https://fish.audio/apple-touch-icon.png',
    imageUrl: null,
    tagline: {
      ja: '文字を、感情のある自然な声に変えるAI',
      en: 'Turn text into natural, expressive speech',
    },
    description: {
      ja: 'テキスト読み上げ、ボイスクローン、感情表現に対応したAI音声ツールです。',
      en: 'An AI voice platform for text-to-speech, voice cloning, and expressive audio.',
    },
    categories: {
      ja: ['音声生成', '動画制作', '音声クローン'],
      en: ['Voice generation', 'Video creation', 'Voice cloning'],
    },
    pricingLabel: { ja: '無料プランあり', en: 'Free plan available' },
    referral: {
      url: 'https://fish.audio/?aff=YDKPDVGUJMPGS',
      code: null,
      label: { ja: '無料プラン付き招待リンク', en: 'Invite link · free plan included' },
      benefit: {
        ja: '無料プランはクレジットカード不要。個人の非商用利用ならそのまま使えます。収益化動画などの商用利用は有料プランが必要です。',
        en: 'The free plan needs no credit card and covers personal, non-commercial use. Monetized or commercial use requires a paid plan.',
      },
      disclosure: { ja: '', en: '' },
      ctaLabel: { ja: 'Fish Audioを無料で試す', en: 'Try Fish Audio for free' },
      shortCtaLabel: { ja: '無料で試す', en: 'Try free' },
      checkedAt: '2026-07-25',
      status: 'active',
    },
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: -3,
    name: 'Suno',
    company: 'Suno',
    icon: 'ri-music-2-line',
    accentColor: '#6d28d9',
    bgFrom: '#f4efff',
    bgTo: '#e2d6fa',
    logoUrl: 'https://cdn-o.suno.com/favicon-512x512.png',
    imageUrl: null,
    tagline: {
      ja: '歌詞もボーカルも、まるごと作れる音楽AI',
      en: 'Generate full songs — lyrics, vocals, and backing',
    },
    description: {
      ja: 'イメージを言葉で伝えるだけで、歌詞・ボーカル・伴奏をまとめて生成できる音楽AI。動画のBGMやオリジナル曲づくりに使えます。',
      en: 'Describe what you want and Suno generates lyrics, vocals, and instrumentation together. Handy for video BGM and original tracks.',
    },
    categories: {
      ja: ['音楽生成', '動画制作', 'BGM'],
      en: ['Music generation', 'Video creation', 'BGM'],
    },
    pricingLabel: { ja: '無料から試せる', en: 'Free tier available' },
    referral: {
      url: 'https://suno.com/invite/@iimonozukan',
      code: null,
      label: { ja: '特典クレジット付き招待リンク', en: 'Invite link · bonus credits' },
      benefit: {
        ja: 'この招待リンクから登録すると、特典クレジットがもらえます。無料プランのまま試せます。',
        en: 'Sign up through this invite link to receive bonus credits. You can try it on the free plan.',
      },
      disclosure: { ja: '', en: '' },
      ctaLabel: { ja: 'Sunoに登録する', en: 'Sign up for Suno' },
      shortCtaLabel: { ja: '登録する', en: 'Sign up' },
      checkedAt: '2026-08-01',
      status: 'active',
    },
    sortOrder: 3,
    isPublished: true,
  },
];

export function languageOf(value: string | undefined): SupportedLanguage {
  return value?.startsWith('en') ? 'en' : 'ja';
}
