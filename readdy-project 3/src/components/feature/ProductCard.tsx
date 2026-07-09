import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/mocks/products';
import { logClick, observeImpression, logGalleryReach, logGalleryClick, type Store } from '@/lib/track';

type CardProduct = Product & { id?: number; pinnedAt?: string | null; isOwn?: boolean; gallery?: string[] };

interface ProductCardProps {
  product: CardProduct;
}

const MALL_ORDER: Store[] = ['amazon', 'rakuten', 'aliexpress', 'yahoo'];

// スワイプ誘導アニメ用のkeyframesを一度だけ注入
if (typeof document !== 'undefined' && !document.getElementById('izk-own-anim')) {
  const st = document.createElement('style');
  st.id = 'izk-own-anim';
  st.textContent = `
@keyframes izkShine{0%{transform:translateX(-130%)}55%,100%{transform:translateX(240%)}}
@keyframes izkNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
@keyframes izkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes izkPop{from{transform:scale(.94);opacity:.3}to{transform:scale(1);opacity:1}}
.izk-shine::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 34%,rgba(255,255,255,.55) 50%,transparent 66%);transform:translateX(-130%);animation:izkShine 3s ease-in-out infinite;pointer-events:none;z-index:1}
.izk-nudge{animation:izkNudge 1.1s ease-in-out infinite}
.izk-float{animation:izkFloat 1.6s ease-in-out infinite}
.izk-pop{animation:izkPop .18s ease-out}
.izk-noscroll::-webkit-scrollbar{display:none}
`;
  document.head.appendChild(st);
}

function GalleryModal({ product, slides, onClose }: { product: CardProduct; slides: string[]; onClose: () => void }) {
  const { t } = useTranslation();
  const scroller = useRef<HTMLDivElement>(null);
  const maxReached = useRef(0);
  const [idx, setIdx] = useState(0);
  const [hint, setHint] = useState(true);
  const activeMalls = MALL_ORDER.filter((m) => product.links[m]);

  const reach = (i: number) => {
    if (i > maxReached.current) { maxReached.current = i; logGalleryReach(product.id, i); }
  };

  useEffect(() => {
    logGalleryReach(product.id, 0); // ギャラリーを開いた（=0枚目到達）
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose, product.id]);

  useEffect(() => {
    const el = scroller.current;
    if (!el || slides.length < 2) return;
    const tmr = setTimeout(() => {
      el.scrollTo({ left: 48, behavior: 'smooth' });
      setTimeout(() => el.scrollTo({ left: 0, behavior: 'smooth' }), 540);
    }, 450);
    return () => clearTimeout(tmr);
  }, [slides.length]);

  const onScroll = () => {
    const el = scroller.current; if (!el) return;
    const w = el.clientWidth || 1;
    const i = Math.round(el.scrollLeft / w);
    if (i !== idx) { setIdx(i); setHint(false); reach(i); }
  };
  const go = (i: number) => {
    const el = scroller.current; if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    setHint(false); reach(i);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="izk-pop relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-background-100 shrink-0">
          <span className="text-sm font-bold truncate">{product.name}</span>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-full hover:bg-background-100 flex items-center justify-center text-foreground-500 shrink-0" aria-label="閉じる">
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="relative bg-background-50">
          <div
            ref={scroller}
            onScroll={onScroll}
            className="izk-noscroll flex overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {slides.map((src, i) => (
              <div key={i} className="shrink-0 basis-full snap-center flex items-center justify-center">
                <img src={src} alt={`${product.name} ${i + 1}`} className="max-h-[58vh] w-full object-contain" loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
              </div>
            ))}
          </div>

          <div className="absolute top-2 right-2 text-[11px] font-bold text-white bg-foreground-950/55 rounded-full px-2 py-0.5 tabular-nums pointer-events-none">{idx + 1} / {slides.length}</div>

          {idx > 0 && (
            <button onClick={() => go(idx - 1)} className="hidden sm:flex absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 shadow items-center justify-center hover:bg-white" aria-label="前へ">
              <i className="ri-arrow-left-s-line text-2xl" />
            </button>
          )}
          {idx < slides.length - 1 && (
            <button onClick={() => go(idx + 1)} className="hidden sm:flex absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 shadow items-center justify-center hover:bg-white" aria-label="次へ">
              <i className="ri-arrow-right-s-line text-2xl" />
            </button>
          )}

          {hint && slides.length > 1 && idx < slides.length - 1 && (
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white bg-amber-500/95 rounded-full pl-2.5 pr-2 py-1 shadow-lg izk-nudge">
              <span className="text-[11px] font-bold whitespace-nowrap">スワイプ</span>
              <i className="ri-arrow-right-line text-base" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 py-2 shrink-0">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`${i + 1}枚目`} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-amber-500' : 'w-1.5 bg-background-300'}`} />
          ))}
        </div>

        {activeMalls.length > 0 && (
          <div className="px-3 pb-3 pt-0.5 grid grid-cols-2 gap-2 shrink-0 border-t border-background-100">
            {activeMalls.map((mall) => (
              <a
                key={mall}
                href={product.links[mall]!}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={() => { logClick(product.id, mall); logGalleryClick(product.id, idx, mall); }}
                className="flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg text-xs font-semibold text-accent-600 bg-accent-50 border border-accent-200 hover:bg-accent-100 active:bg-accent-100 cursor-pointer"
              >
                <span>{t(`product.${mall}`)}</span>
                <i className="ri-external-link-line text-[12px]" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const activeMalls = MALL_ORDER.filter((m) => product.links[m]);
  const gallery = (product.gallery ?? []).filter(Boolean);
  const hasGallery = gallery.length > 0;

  const pinBadge = product.pinnedAt ? (
    <span className="absolute top-1.5 right-1.5 z-[2] w-6 h-6 rounded-full bg-foreground-950/70 backdrop-blur-sm flex items-center justify-center" title="ピン留め">
      <i className="ri-pushpin-fill text-white text-[13px]" />
    </span>
  ) : null;

  return (
    <article className="flex flex-col" ref={(el) => observeImpression(el, product.id)}>
      {hasGallery ? (
        <button type="button" onClick={() => setOpen(true)} className="block text-left cursor-pointer" aria-label={`${product.name}の詳細を見る`}>
          <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-background-100 izk-shine ring-2 ring-amber-300">
            <img src={product.image} alt={product.name} title={`${product.name} - いいもの図鑑`} className="w-full h-full object-contain" loading="lazy" />
            <span className="absolute left-1.5 bottom-1.5 z-[2] flex items-center gap-1 text-[10px] font-black text-white bg-amber-500 rounded-full pl-1.5 pr-2 py-0.5 shadow-md">
              <i className="ri-gallery-line text-[12px] izk-float" />
              <span>{gallery.length}枚</span>
              <i className="ri-arrow-right-line text-[11px] izk-nudge" />
            </span>
            {pinBadge}
          </div>
        </button>
      ) : (
        <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-background-100">
          <img src={product.image} alt={product.name} title={`${product.name} - いいもの図鑑`} className="w-full h-full object-contain" loading="lazy" />
          {pinBadge}
        </div>
      )}

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

      {open && hasGallery && <GalleryModal product={product} slides={gallery} onClose={() => setOpen(false)} />}
    </article>
  );
}
