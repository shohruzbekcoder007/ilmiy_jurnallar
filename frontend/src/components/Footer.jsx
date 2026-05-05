import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, BookOpen } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-12 bg-primary text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-6 w-6 text-secondary" />
            <div className="font-bold">ziyonashrmedia</div>
          </div>
          <p className="text-sm text-white/80">
            Ziyonashrmedia rasmiy ilmiy nashr platformasi.
          </p>
        </div>

        <div>
          <div className="font-semibold mb-3">{t('nav.contact')}</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {t('footer.address')}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +998 (71) 000-00-00</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> editor@ziyonashrmedia.uz</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">{t('nav.journals')}</div>
          <ul className="space-y-1 text-sm text-white/80">
            <li><a href="/jurnallar" className="hover:text-white">{t('nav.journals')}</a></li>
            <li><a href="/maqolalar" className="hover:text-white">{t('nav.articles')}</a></li>
            <li><a href="/imrad" className="hover:text-white">{t('nav.imrad')}</a></li>
            <li><a href="/elon" className="hover:text-white">{t('nav.announcements')}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        &copy; {new Date().getFullYear()} Ziyonashrmedia — {t('footer.rights')}
      </div>
    </footer>
  );
}
