import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const nextLang = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(nextLang);
  };

  const isJapanese = i18n.language === 'ja';

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

        <img
          src="https://ugc.production.linktr.ee/8a4be05f-3cef-4d6e-b0f6-1e89f2b56576_-76-.png"
          alt="いいもの図鑑"
          className="h-16 md:h-20 w-auto object-contain"
        />
        <p className="mt-4 text-xl md:text-2xl font-semibold text-foreground-950 tracking-tight">
          {t('header.tagline')}
        </p>

        <div className="mt-6 max-w-md flex flex-col items-center">
          <p className="text-xs text-foreground-400 font-body text-center leading-relaxed">
            {t('header.guideText')}
          </p>
          <div className="mt-2 text-[11px] text-foreground-400 font-body text-center leading-relaxed space-y-0.5">
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
                <i className="ri-music-line text-lg"></i>
              </div>
            </a>
            <a href="https://note.com/iimono_zukan" target="_blank" rel="nofollow noopener noreferrer" className="text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer" title="note">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-quill-pen-line text-lg"></i>
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