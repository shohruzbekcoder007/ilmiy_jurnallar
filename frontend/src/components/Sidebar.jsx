import { useTranslation } from 'react-i18next';

export default function Sidebar({ filters, onChange, journals = [] }) {
  const { t } = useTranslation();
  const set = (k, v) => onChange({ ...filters, [k]: v, page: 1 });
  return (
    <aside className="card sticky top-20">
      <div className="font-semibold mb-3">{t('common.filter')}</div>

      <label className="label">{t('articles.filters.search')}</label>
      <input
        className="input mb-3"
        value={filters.keyword || ''}
        onChange={(e) => set('keyword', e.target.value)}
      />

      <label className="label">{t('articles.filters.journal')}</label>
      <select
        className="input mb-3"
        value={filters.journal || ''}
        onChange={(e) => set('journal', e.target.value)}
      >
        <option value="">{t('common.all')}</option>
        {journals.map((j) => (
          <option key={j._id} value={j._id}>
            {j.title?.uz || j.slug}
          </option>
        ))}
      </select>

      <label className="label">{t('articles.filters.year')}</label>
      <select
        className="input mb-3"
        value={filters.year || ''}
        onChange={(e) => set('year', e.target.value)}
      >
        <option value="">{t('common.all')}</option>
        {Array.from({ length: 6 }).map((_, i) => {
          const y = new Date().getFullYear() - i;
          return <option key={y} value={y}>{y}</option>;
        })}
      </select>

      <label className="label">{t('articles.filters.language')}</label>
      <select
        className="input"
        value={filters.language || ''}
        onChange={(e) => set('language', e.target.value)}
      >
        <option value="">{t('common.all')}</option>
        <option value="uz">UZ</option>
        <option value="ru">RU</option>
        <option value="en">EN</option>
      </select>
    </aside>
  );
}
