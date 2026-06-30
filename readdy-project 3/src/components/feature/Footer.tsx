import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    {
      name: 'Instagram',
      icon: 'ri-instagram-line',
      url: 'https://www.instagram.com/iimono_zukan/',
    },
    {
      name: 'YouTube',
      icon: 'ri-youtube-line',
      url: 'https://youtube.com/channel/UCC8isCjP58bpa_KolysQUeQ',
    },
    {
      name: 'TikTok',
      icon: 'ri-tiktok-line',
      url: 'https://www.tiktok.com/@iimonozukan',
    },
    {
      name: 'note',
      icon: 'ri-article-line',
      url: 'https://note.com/iimono_zukan',
    },
    {
      name: 'Threads',
      icon: 'ri-threads-line',
      url: 'https://www.threads.net/@iimono_zukan',
    },
    {
      name: 'メール',
      icon: 'ri-mail-line',
      url: 'mailto:iimonozukan@gmail.com',
    },
  ];

  return (
    <footer className="w-full bg-background-100 border-t border-background-200 mt-16 md:mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-background-200 text-foreground-500 transition-all duration-200 hover:text-primary-500 hover:border-primary-300 cursor-pointer"
                aria-label={link.name}
              >
                <i className={`${link.icon} text-lg`}></i>
              </a>
            ))}
          </div>
          <p className="text-xs text-foreground-400 font-body">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
