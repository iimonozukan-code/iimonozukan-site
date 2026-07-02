import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import ProductCard from '@/components/feature/ProductCard';
import { fetchPublishedItems, fetchBanners, type Item, type Banner } from '@/lib/db';
import { logPageView, logBannerClick } from '@/lib/track';

const CATEGORY_KEYS = ['すべて', '機械もの', '生活もの', '家電もの', '身装もの', '情報もの'] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const CATEGORY_DISPLAY: Record<CategoryKey, string> = {
  'すべて': 'すべて',
  '機械もの': '🔌 機械もの',
  '生活もの': '🪑 生活もの',
  '家電もの': '📺 家電もの',
  '身装もの': '💼 身装もの',
  '情報もの': '📱 情報もの',
};

const MALLS = ['すべて', 'amazon', 'rakuten', 'yahoo', 'aliexpress'] as const;

const MALL_LABELS: Record<string, string> = {
  amazon: 'Amazon',
  rakuten: '楽天',
  yahoo: 'Yahoo',
  aliexpress: 'AliExpress',
};

export default function Home() {
  const { t } = useTranslation();

  const [products, setProducts] = useState<Item[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('すべて');
  const [selectedMall, setSelectedMall] = useState<string>('すべて');
  const [selectedYM, setSelectedYM] = useState('');

  useEffect(() => {
    logPageView();
    fetchPublishedItems().then(setProducts);
    fetchBanners().then((bs) => setBanners(bs.filter((b) => b.is_active && b.image_url)));
  }, []);

  const presentCategories = useMemo(
    () => CATEGORY_KEYS.filter((c) => c === 'すべて' || products.some((p) => p.category === c)),
    [products],
  );

  // 商品が存在する「年-月」を新しい順に（日付タイムライン用）
  const monthChips = useMemo(
    () => [...new Set(products.map((p) => (p.date || '').slice(0, 7)).filter(Boolean))].sort().reverse(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    let result: Item[] = [...products];

    if (selectedCategory !== 'すべて') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedMall !== 'すべて') {
      result = result.filter((p) => p.links[selectedMall as keyof typeof p.links] !== null);
    }
    if (selectedYM) {
      result = result.filter((p) => (p.date || '').startsWith(selectedYM));
    }

    // ピン留め（最大3件）を先頭に。それ以外は管理画面の並び順（sort_order）に従う
    return [...result].sort((a, b) => {
      const pa = a.pinnedAt ? 1 : 0;
      const pb = b.pinnedAt ? 1 : 0;
      if (pa !== pb) return pb - pa;
      if (a.pinnedAt && b.pinnedAt) return (b.pinnedAt ?? '').localeCompare(a.pinnedAt ?? '');
      return 0;
    });
  }, [products, selectedCategory, selectedMall, selectedYM]);

  const hasFilter = selectedCategory !== 'すべて' || selectedMall !== 'すべて' || selectedYM !== '';

  const handleClearAll = () => {
    setSelectedCategory('すべて');
    setSelectedMall('すべて');
    setSelectedYM('');
  };

  const formatYM = (ym: string) => {
    const [y, m] = ym.split('-');
    return `${y.slice(2)}年${parseInt(m, 10)}月`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-50">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-2 md:px-6">
        {/* バナー（管理画面から設定・設定中のみ表示） */}
        {banners.length > 0 && (
          <section className={`pt-2 mb-4 grid gap-2 ${banners.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {banners.map((b) => (
              <a
                key={b.id}
                href={b.link_url || '#'}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={() => logBannerClick(b.id)}
                className="block overflow-hidden rounded-xl border border-background-200 bg-background-100"
              >
                <img src={b.image_url!} alt="キャンペーン" className="w-full aspect-[16/5] object-cover" loading="eager" />
              </a>
            ))}
          </section>
        )}

        {/* 絞り込みパネル */}
        <section className="mb-5">
          <div className="bg-white border border-background-200 rounded-2xl px-3 py-3 md:px-5 md:py-4 space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-400 tracking-wide">
                  <i className="ri-calendar-line" />
                  {t('home.searchByDate')}
                </p>
                {hasFilter && (
                  <button
                    onClick={handleClearAll}
                    className="text-[10px] font-bold text-foreground-400 hover:text-foreground-600 cursor-pointer flex items-center gap-0.5"
                  >
                    <i className="ri-close-circle-line" />
                    {t('home.clearAllFilters')}
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
                <button
                  onClick={() => setSelectedYM('')}
                  className={`filter-chip shrink-0 ${selectedYM === '' ? 'filter-chip-active-neutral' : 'filter-chip-inactive'}`}
                >
                  {t('home.filterAll')}
                </button>
                {monthChips.map((ym) => {
                  const isActive = selectedYM === ym;
                  return (
                    <button
                      key={ym}
                      onClick={() => setSelectedYM(ym)}
                      className={`filter-chip shrink-0 ${isActive ? 'filter-chip-active-neutral' : 'filter-chip-inactive'}`}
                    >
                      {formatYM(ym)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-background-100" />

            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-400 tracking-wide mb-1.5">
                <i className="ri-apps-2-line" />
                {t('home.category')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {presentCategories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const displayCat = cat === 'すべて' ? t('home.filterAll') : CATEGORY_DISPLAY[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`filter-chip ${isActive ? 'filter-chip-active-primary' : 'filter-chip-inactive'}`}
                    >
                      {displayCat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-background-100" />

            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-400 tracking-wide mb-1.5">
                <i className="ri-store-2-line" />
                {t('home.mall')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MALLS.map((mall) => {
                  const isActive = selectedMall === mall;
                  return (
                    <button
                      key={mall}
                      onClick={() => setSelectedMall(mall)}
                      className={`filter-chip ${isActive ? 'filter-chip-active-accent' : 'filter-chip-inactive'}`}
                    >
                      {mall === 'すべて' ? t('home.filterAll') : MALL_LABELS[mall]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <p className="text-xs md:text-sm text-foreground-500 font-body font-bold">
              {t('home.itemCount', { count: filteredProducts.length })}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-1 gap-y-3 sm:gap-x-3 sm:gap-y-3 md:grid-cols-4 md:gap-x-4 md:gap-y-4 lg:grid-cols-5" data-product-shop>
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id ?? `${product.date}-${product.name}-${idx}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-background-100 mb-4">
                <i className="ri-file-search-line text-2xl text-foreground-300"></i>
              </div>
              <p className="text-sm text-foreground-500 font-body font-bold">
                {t('home.noProducts')}
              </p>
              {hasFilter && (
                <button
                  onClick={handleClearAll}
                  className="mt-4 text-sm text-primary-500 hover:text-primary-600 font-label cursor-pointer font-bold whitespace-nowrap"
                >
                  {t('home.clearAllFilters')}
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
