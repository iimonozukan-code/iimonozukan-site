import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const nextLang = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(nextLang);
  };

  const isJapanese = i18n.language === 'ja';

  // メインロゴ画像（いいもの図鑑・高解像度）。public/ に同梱。
  // 右側の大きな「図鑑」はこの画像の下半分をCSSで切り出して拡大表示し、同じ素材を再利用。
  const logoUrl = '/logo.png';

  return (
    <header className="w-full py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <button
            onClick={toggleLang}
            className="text-xs font-bold font-label px-3 py-1.5 rounded-full border-2 border-foreground-300 bg-white text-foreground-600 hover:border-foreground-500 hover:text-foreground-950 transition-all cursor-pointer whitespace-nowrap"
          >
            {isJapanese ? 'EN' : '日本語'}
          </button>
        </div>

        <div
          role="img"
          aria-label="いいもの図鑑の図鑑"
          className="flex items-center leading-none select-none text-[64px] md:text-[80px]"
        >
          {/* 「いいもの図鑑」＝メインロゴそのまま */}
          <img
            src={logoUrl}
            alt=""
            className="w-auto object-contain"
            style={{ height: '1em' }}
          />
          {/* 「の」＝メインロゴのトンマナに寄せた太字 */}
          <span
            className="font-black text-[#232323]"
            style={{ fontSize: '0.5em', margin: '0 0.08em' }}
          >
            の
          </span>
          {/* 「図鑑」＝メインロゴ下半分（図鑑部分）をCSSで切り出して拡大 */}
          <div
            aria-hidden="true"
            style={{
              height: '0.833em',
              width: '1.785em',
              backgroundImage: `url(${logoUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '2.414em 2.414em',
              backgroundPosition: '-0.323em -1.105em',
            }}
          />
        </div>
        <p className="mt-4 text-xl md:text-2xl font-semibold text-foreground-950 tracking-tight text-center whitespace-pre-line leading-snug">
          {t('header.tagline')}
        </p>

        <div className="mt-6 max-w-md flex flex-col items-center">
          <div className="text-[11px] text-foreground-400 font-body text-center leading-relaxed space-y-0.5">
            <p>
              {t('header.workInquiry')}<a href="mailto:iimonozukan@gmail.com" className="hover:text-foreground-600 transition-colors cursor-pointer">iimonozukan@gmail.com</a>
            </p>
            <p>{t('header.mediaNotice')}</p>
            <p>{t('header.mainAccount')}</p>
          </div>

          <div className="mt-3 flex items-center gap-5">
            <a href="https://www.instagram.com/iimono_zukan/" target="_blank" rel="nofollow noopener noreferrer" className="text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer" title="Instagram">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-instagram-line text-lg"></i>
              </div>
            </a>
            <a href="https://youtube.com/channel/UCC8isCjP58bpa_KolysQUeQ" target="_blank" rel="nofollow noopener noreferrer" className="text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer" title="YouTube">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-youtube-line text-lg"></i>
              </div>
            </a>
            <a href="https://www.tiktok.com/@iimonozukan" target="_blank" rel="nofollow noopener noreferrer" className="text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer" title="TikTok">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-tiktok-line text-lg"></i>
              </div>
            </a>
            <a href="https://note.com/iimono_zukan" target="_blank" rel="nofollow noopener noreferrer" className="text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer" title="note">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-article-line text-lg"></i>
              </div>
            </a>
            <a href="https://www.threads.net/@iimono_zukan" target="_blank" rel="nofollow noopener noreferrer" className="text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer" title="Threads">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-threads-line text-lg"></i>
              </div>
            </a>
            <a href="mailto:iimonozukan@gmail.com" className="text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer" title="メール">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-mail-line text-lg"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
