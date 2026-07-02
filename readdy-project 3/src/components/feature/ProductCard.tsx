import { useTranslation } from 'react-i18next';
import type { Product } from '@/mocks/products';
import { logClick, observeImpression, type Store } from '@/lib/track';

interface ProductCardProps {
  product: Product & { id?: number };
}

// ボタンの並び順（アマゾン → 楽天 → アリエク → ヤフー）
const MALL_ORDER: Store[] = ['amazon', 'rakuten', 'aliexpress', 'yahoo'];

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  // 存在するモールだけ（決まった順で）。少なくても詰めない・拡大しない。
  const activeMalls = MALL_ORDER.filter((m) => product.links[m]);
  const firstMall: Store = activeMalls[0] ?? 'amazon';
  const firstLink = product.links[firstMall] ?? '#';

  return (
    <article className="flex flex-col" ref={(el) => observeImpression(el, product.id)}>
      {/* 1080×1920 サムネイル全面表示（カテゴリ名・タイトル・日付は画像内にあるため重ねない） */}
      <a
        href={firstLink}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="block"
        onClick={() => logClick(product.id, firstMall)}
      >
        <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-background-100">
          <img
            src={product.image}
            alt={product.name}
            title={`${product.name} - いいもの図鑑`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </a>

      {/* 購入リンク：縦並び・青いリンクUI。あるモールだけ表示（詰めない・拡大しない） */}
      <div className="mt-1 flex flex-col gap-1">
        {activeMalls.map((mall) => (
          <a
            key={mall}
            href={product.links[mall]!}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={() => logClick(product.id, mall)}
            className="flex items-center justify-center gap-1 px-1 py-2 rounded-md text-[11px] md:text-xs font-semibold text-accent-600 bg-accent-50 border border-accent-200 transition-colors duration-200 hover:bg-accent-100 active:bg-accent-100 cursor-pointer whitespace-nowrap"
          >
            <span>{t(`product.${mall}`)}</span>
            <i className="ri-external-link-line text-[12px]"></i>
          </a>
        ))}
      </div>
    </article>
  );
}
