import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type CatalogModeToggleProps = {
  productCount?: number | null;
  aiToolCount?: number | null;
};

export default function CatalogModeToggle({
  productCount = null,
  aiToolCount = null,
}: CatalogModeToggleProps) {
  const { t } = useTranslation();

  const items = [
    {
      to: '/',
      end: true,
      icon: 'ri-shopping-bag-3-line',
      label: t('catalog.products'),
      description:
        productCount == null
          ? t('catalog.productsHint')
          : t('catalog.productCount', { count: productCount }),
      isNew: false,
    },
    {
      to: '/ai-tools',
      end: false,
      icon: 'ri-sparkling-line',
      label: t('catalog.aiTools'),
      description:
        aiToolCount == null
          ? t('catalog.aiToolsHint')
          : t('catalog.aiToolCount', { count: aiToolCount }),
      isNew: true,
    },
  ];

  return (
    <nav aria-label={t('catalog.navigationLabel')} className="mb-5 pt-2">
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-background-200 bg-background-100 p-1.5 shadow-[0_8px_24px_rgba(20,20,20,0.07)]">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                'relative flex min-h-[64px] items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-center transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'motion-reduce:transition-none',
                isActive
                  ? 'bg-white text-foreground-950 shadow-sm'
                  : 'text-foreground-500 hover:bg-white/70 hover:text-foreground-800',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <i
                  className={`${item.icon} hidden text-xl sm:block ${
                    item.to === '/ai-tools' && isActive ? 'text-primary-500' : ''
                  }`}
                  aria-hidden="true"
                />
                <span className="flex min-w-0 flex-col items-center sm:items-start">
                  <span className="flex items-center justify-center gap-1 text-[12px] font-black leading-tight tracking-tight sm:justify-start sm:text-sm">
                    {item.label}
                    {item.isNew && (
                      <span className="rounded-full bg-primary-500 px-1.5 py-0.5 text-[8px] font-black leading-none tracking-wide text-white">
                        {t('catalog.new')}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold leading-tight text-foreground-400 sm:text-[10px]">
                    {item.description}
                  </span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
