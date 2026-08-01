import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AiTool } from '@/data/aiTools';
import { languageOf } from '@/data/aiTools';
import { logAiClick, observeAiImpression } from '@/lib/track';

// ポップアップの出現アニメを一度だけ注入（商品カードのポップアップと同じ見え方に揃える）
if (typeof document !== 'undefined' && !document.getElementById('izk-ai-anim')) {
  const st = document.createElement('style');
  st.id = 'izk-ai-anim';
  st.textContent = `@keyframes izkAiPop{from{transform:scale(.94);opacity:.3}to{transform:scale(1);opacity:1}}.izk-ai-pop{animation:izkAiPop .18s ease-out}`;
  document.head.appendChild(st);
}

/**
 * ロゴ表示。公式のロゴ画像があればそれを、無い／読み込み失敗時はアイコンにフォールバックする。
 * （外部ホストのロゴが将来消えても、カードが壊れて見えないようにする）
 */
function LogoMark({ tool, size }: { tool: AiTool; size: 'sm' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const box = size === 'sm' ? 'h-11 w-11 rounded-2xl' : 'h-14 w-14 rounded-2xl';
  const img = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const icon = size === 'sm' ? 'text-2xl' : 'text-3xl';

  return (
    <span className={`flex ${box} shrink-0 items-center justify-center bg-white/95 shadow-sm`}>
      {tool.logoUrl && !failed ? (
        // ロゴは小さく件数も少ないので遅延読み込みしない（lazyだと初回に出ないことがある）
        <img
          src={tool.logoUrl}
          alt={tool.name}
          className={`${img} object-contain`}
          onError={() => setFailed(true)}
        />
      ) : (
        <i className={`${tool.icon} ${icon}`} style={{ color: tool.accentColor }} aria-hidden="true" />
      )}
    </span>
  );
}

function shortUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement('textarea');
  input.value = value;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  try {
    input.select();
    if (!document.execCommand('copy')) throw new Error('Copy command was rejected');
  } finally {
    input.remove();
  }
}

export default function AiToolCard({ tool }: { tool: AiTool }) {
  const { t, i18n } = useTranslation();
  const language = languageOf(i18n.language);
  const [open, setOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  const canOpen = tool.referral.status !== 'paused' && Boolean(tool.referral.url);
  const tileStyle = tool.imageUrl
    ? undefined
    : { backgroundImage: `linear-gradient(160deg, ${tool.bgFrom} 0%, ${tool.bgTo} 100%)` };

  const checkedAt = tool.referral.checkedAt
    ? new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(`${tool.referral.checkedAt}T00:00:00`))
    : '';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const openDetail = () => {
    setOpen(true);
    logAiClick(tool.id, 'detail');
  };

  const copyReferral = async () => {
    try {
      await copyText(tool.referral.code ?? tool.referral.url);
      setCopyMessage(t('aiTools.copied'));
      logAiClick(tool.id, 'copy');
    } catch {
      setCopyMessage(t('aiTools.copyFailed'));
    }
  };

  const referralLink = (className: string, label: string) => (
    <a
      href={tool.referral.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() => logAiClick(tool.id, 'referral')}
      className={className}
    >
      <span>{label}</span>
      <i className="ri-external-link-line text-[12px]" aria-hidden="true" />
    </a>
  );

  return (
    <article className="flex flex-col self-start" ref={(el) => observeAiImpression(el, tool.id)}>
      <button
        type="button"
        onClick={openDetail}
        aria-label={`${tool.name}${t('aiTools.detailOf')}`}
        className="relative block w-full aspect-[9/16] overflow-hidden rounded-lg bg-background-100 cursor-pointer text-left"
        style={tileStyle}
      >
        {tool.imageUrl && (
          <img
            src={tool.imageUrl}
            alt={tool.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}

        <span className="absolute right-1.5 top-1.5 z-[2] inline-flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-black leading-none text-foreground-700 shadow-sm">
          {t('aiTools.detail')}
          <i className="ri-arrow-right-s-line text-[11px]" aria-hidden="true" />
        </span>

        {!tool.imageUrl && (
          <span className="absolute inset-0 flex flex-col items-center justify-center px-2.5 text-center">
            <LogoMark tool={tool} size="sm" />
            <span
              className="mt-2.5 text-[15px] font-black leading-tight tracking-tight"
              style={{ color: tool.accentColor }}
            >
              {tool.name}
            </span>
            <span className="mt-1.5 text-[9px] font-bold leading-snug text-foreground-700/90">
              {tool.tagline[language]}
            </span>
          </span>
        )}

        {tool.pricingLabel[language] && (
          <span className="absolute inset-x-0 bottom-1.5 z-[2] text-center text-[9px] font-black text-foreground-700/80">
            {tool.pricingLabel[language]}
          </span>
        )}
      </button>

      <div className="mt-1 flex flex-col gap-1">
        {canOpen &&
          referralLink(
            'flex items-center justify-center gap-1 px-1 py-2 rounded-md text-[11px] md:text-xs font-semibold text-accent-600 bg-accent-50 border border-accent-200 transition-colors duration-200 hover:bg-accent-100 active:bg-accent-100 cursor-pointer whitespace-nowrap',
            tool.referral.shortCtaLabel[language] || t('aiTools.signUp'),
          )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-foreground-950/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="izk-ai-pop relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center gap-2 border-b border-background-100 px-3 py-2">
              <span className="truncate text-sm font-bold">{tool.name}</span>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground-500 hover:bg-background-100"
                aria-label={t('aiTools.close')}
              >
                <i className="ri-close-line text-xl" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div
                className="flex items-center gap-3.5 px-5 py-4"
                style={{ backgroundImage: `linear-gradient(160deg, ${tool.bgFrom} 0%, ${tool.bgTo} 100%)` }}
              >
                <LogoMark tool={tool} size="lg" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.12em] text-foreground-500">{tool.company}</p>
                  <h3 className="mt-0.5 text-[22px] font-black leading-tight tracking-tight" style={{ color: tool.accentColor }}>
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-[11px] font-bold leading-snug text-foreground-700">
                    {tool.tagline[language]}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-1.5">
                  {tool.pricingLabel[language] && (
                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-black text-primary-600">
                      {tool.pricingLabel[language]}
                    </span>
                  )}
                  {tool.categories[language].map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-background-100 px-2.5 py-1 text-[10px] font-semibold text-foreground-600"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-[13px] leading-relaxed text-foreground-600">
                  {tool.description[language]}
                </p>

                <div className="mt-3.5 rounded-xl border border-background-200 bg-background-100 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] font-black tracking-[0.08em] text-primary-600">
                      {tool.referral.label[language]}
                    </p>
                    {checkedAt && (
                      <span className="text-[9px] font-semibold text-foreground-400">
                        {tool.referral.status === 'needs_review'
                          ? t('aiTools.receivedAt', { date: checkedAt })
                          : t('aiTools.checkedAt', { date: checkedAt })}
                      </span>
                    )}
                  </div>

                  {tool.referral.benefit[language] && (
                    <p className="mt-2 text-[11px] font-semibold leading-relaxed text-foreground-700">
                      {tool.referral.benefit[language]}
                    </p>
                  )}

                  {tool.referral.url && (
                    <>
                      <div className="mt-2.5 flex min-w-0 items-stretch gap-2">
                        <span className="flex min-w-0 flex-1 items-center rounded-lg border border-background-300 bg-white px-2.5 py-2 text-[10px] font-semibold text-foreground-500 [overflow-wrap:anywhere]">
                          {tool.referral.code ?? shortUrl(tool.referral.url)}
                        </span>
                        <button
                          type="button"
                          onClick={copyReferral}
                          className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1 rounded-lg border border-foreground-300 bg-white px-3 text-[11px] font-bold text-foreground-700 transition-colors hover:bg-background-200"
                          aria-label={t(tool.referral.code ? 'aiTools.copyCodeLabel' : 'aiTools.copyLinkLabel', {
                            name: tool.name,
                          })}
                        >
                          <i className="ri-file-copy-line" aria-hidden="true" />
                          {t('aiTools.copy')}
                        </button>
                      </div>
                      <p aria-live="polite" className="mt-1 min-h-[15px] text-[10px] font-semibold text-foreground-500">
                        {copyMessage}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-background-100 p-3">
              {canOpen ? (
                referralLink(
                  'flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 text-sm font-black text-white transition-colors hover:bg-primary-600',
                  tool.referral.ctaLabel[language] || t('aiTools.signUp'),
                )
              ) : (
                <span className="flex min-h-[48px] w-full cursor-not-allowed items-center justify-center rounded-xl bg-background-300 px-4 text-sm font-black text-foreground-500">
                  {t('aiTools.unavailable')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
