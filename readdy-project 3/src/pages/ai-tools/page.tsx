import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import CatalogModeToggle from '@/components/feature/CatalogModeToggle';
import AiToolCard from '@/components/feature/AiToolCard';
import { languageOf, type AiTool } from '@/data/aiTools';
import { fetchPublishedAiTools } from '@/lib/aiTools';
import { logPageView } from '@/lib/track';
import { usePageMetadata } from '@/lib/usePageMetadata';

const ALL = '__all__';

export default function AiToolsPage() {
  const { t, i18n } = useTranslation();
  const language = languageOf(i18n.language);

  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL);

  useEffect(() => {
    logPageView();
    fetchPublishedAiTools()
      .then(setTools)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  usePageMetadata({
    title: t('aiTools.metaTitle'),
    description: t('aiTools.metaDescription'),
    canonicalPath: '/ai-tools',
  });

  // 掲載中のツールに実際に付いているカテゴリだけをチップにする
  const categories = useMemo(() => {
    const seen: string[] = [];
    tools.forEach((tool) => {
      tool.categories[language].forEach((c) => {
        if (c && !seen.includes(c)) seen.push(c);
      });
    });
    return seen;
  }, [tools, language]);

  const filtered = useMemo(() => {
    if (selectedCategory === ALL) return tools;
    return tools.filter((tool) => tool.categories[language].includes(selectedCategory));
  }, [tools, selectedCategory, language]);

  const loadingText = language === 'en' ? 'Loading…' : '読み込み中…';

  return (
    <div className="min-h-screen flex flex-col bg-background-50">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-2 md:px-6">
        <CatalogModeToggle productCount={null} aiToolCount={loading ? null : tools.length} />

        {categories.length > 0 && (
          <section className="mb-5">
            <div className="bg-white border border-background-200 rounded-2xl px-3 py-3 md:px-5 md:py-4">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-400 tracking-wide mb-1.5">
                <i className="ri-apps-2-line" aria-hidden="true" />
                {t('aiTools.filterByUse')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCategory(ALL)}
                  className={`filter-chip ${
                    selectedCategory === ALL ? 'filter-chip-active-primary' : 'filter-chip-inactive'
                  }`}
                >
                  {t('home.filterAll')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`filter-chip ${
                      selectedCategory === category ? 'filter-chip-active-primary' : 'filter-chip-inactive'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mb-12 md:mb-16" aria-labelledby="ai-tool-list-heading">
          <h2 id="ai-tool-list-heading" className="sr-only">
            {t('aiTools.listTitle')}
          </h2>
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <p className="text-xs md:text-sm text-foreground-500 font-body font-bold">
              {loading ? loadingText : t('aiTools.itemCount', { count: filtered.length })}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-background-100 mb-4">
                <i className="ri-loader-4-line text-2xl text-foreground-300 animate-spin" aria-hidden="true" />
              </div>
              <p className="text-sm text-foreground-500 font-body font-bold">{loadingText}</p>
            </div>
          ) : filtered.length > 0 ? (
            <div
              className="grid grid-cols-3 gap-x-1 gap-y-3 sm:gap-x-3 sm:gap-y-3 md:grid-cols-4 md:gap-x-4 md:gap-y-4 lg:grid-cols-5"
              lang={language === 'en' ? 'en' : 'ja'}
            >
              {filtered.map((tool) => (
                <AiToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-background-100 mb-4">
                <i className="ri-file-search-line text-2xl text-foreground-300" aria-hidden="true" />
              </div>
              <p className="text-sm text-foreground-500 font-body font-bold">{t('aiTools.empty')}</p>
              {selectedCategory !== ALL && (
                <button
                  onClick={() => setSelectedCategory(ALL)}
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
