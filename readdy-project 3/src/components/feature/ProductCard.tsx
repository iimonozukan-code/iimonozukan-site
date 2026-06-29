import { useTranslation } from 'react-i18next';
import type { Product } from '@/mocks/products';
import { logClick, type Store } from '@/lib/track';

interface ProductCardProps {
  product: Product & { id?: number };
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const y = String(d.getFullYear()).slice(-2);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}年${m}/${day}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  const activeEntries = (Object.entries(product.links) as [Store, string | null][])
    .filter(([, url]) => url !== null) as [Store, string][];
  const activeMalls = activeEntries.map(([key]) => key);
  const [firstMall, firstLink] = activeEntries[0] ?? (['amazon', '#'] as [Store, string]);

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden border border-background-200 transition-all duration-300 hover:border-foreground-300"
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <a
        href={firstLink}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="block"
        onClick={() => logClick(product.id, firstMall)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-background-100 flex items-center justify-center p-2">
          <img
            src={product.image}
            alt={product.name}
            title={`${product.name} - いいもの図鑑`}
            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span
            className="absolute top-1.5 left-1.5"
            style={{
              writingMode: 'vertical-rl',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 'clamp(11px, 3vw, 22px)',
              WebkitTextStroke: 'clamp(2px, 0.6vw, 5px) #000000',
              paintOrder: 'stroke fill',
              textShadow: '0 0 3px #000000',
              letterSpacing: '0.2em',
              lineHeight: 1.0,
              pointerEvents: 'none',
            }}
          >
            {product.category}
          </span>
          <span
            className="absolute top-1.5 right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(255,255,255,0.92)',
              color: '#1d1d1f',
              border: '1px solid rgba(0,0,0,0.06)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              pointerEvents: 'none',
            }}
          >
            {formatDateShort(product.date)}
          </span>
        </div>
      </a>
      <div className="p-1.5 md:p-3">
        <h3 className="text-[11px] md:text-sm font-modern font-semibold tracking-tight text-foreground-950 leading-tight line-clamp-2 mb-1.5">
          {product.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          {activeMalls.map((mall) => (
            <a
              key={mall}
              href={product.links[mall as keyof typeof product.links]!}
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={() => logClick(product.id, mall)}
              className="inline-flex flex-1 basis-[46%] items-center justify-center px-1.5 py-2 rounded-full text-[10px] md:text-[11px] font-modern font-medium tracking-tight cursor-pointer whitespace-nowrap bg-background-100 text-foreground-700 transition-all duration-200 hover:bg-background-200"
            >
              {t(`product.${mall}`)}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
