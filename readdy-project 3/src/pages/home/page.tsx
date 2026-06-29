import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import ProductCard from '@/components/feature/ProductCard';
import { fetchPublishedItems, type Item } from '@/lib/db';

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
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('すべて');
  const [selectedMall, setSelectedMall] = useState<string>('すべて');
  const [selectedYM, setSelectedYM] = useState('');

  useEffect(() => {
    fetchPublishedItems().then(setProducts);
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

    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return result;
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

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6">
        <section className="mb-7 pt-2">
          <h2 className="text-[15px] font-semibold text-foreground-900 mb-3 text-center tracking-tight">{t('home.searchByDate')}</h2>
          <div className="flex gap-2 overflow-x-auto pb-1.5 px-1 -mx-1" style={{ scrollbarWidth: 'thin' }}>
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
        </section>

        <section className="mb-6">
          <h2 className="text-[15px] font-semibold text-foreground-900 mb-3 text-center tracking-tight">{t('home.category')}</h2>
          <div className="flex flex-wrap justify-center gap-2">
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
        </section>

        <section className="mb-8">
          <h2 className="text-[15px] font-semibold text-foreground-900 mb-3 text-center tracking-tight">{t('home.mall')}</h2>
          <div className="flex flex-wrap justify-center gap-2">
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
        </section>

        <section className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <p className="text-xs md:text-sm text-foreground-500 font-body font-bold">
              {t('home.itemCount', { count: filteredProducts.length })}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:grid-cols-4 md:gap-4" data-product-shop>
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
