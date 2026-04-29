import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { journals } from '../api/endpoints';
import JournalCard from '../components/JournalCard';
import PageHeader from '../components/PageHeader';

const INDEXES = ['Scopus', 'Web of Science', 'OAK'];
const FREQUENCIES = ['monthly', 'quarterly', 'biannual', 'annual'];
const CATEGORIES = [
  { key: '', label: 'Barchasi' },
  { key: 'innovatsiyalar', label: 'Innovatsiyalar' },
  { key: 'moliya', label: 'Moliya' },
  { key: 'digital_economy', label: 'Digital Economy' },
  { key: 'sugurta', label: "Sug'urta" },
  { key: 'mehnat', label: 'Mehnat' },
  { key: 'ekologiya', label: 'Ekologiya' },
];

export default function JournalsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useQuery({
    queryKey: ['journals', filters],
    queryFn: () => journals.list(filters),
  });

  const allItems = data?.data?.items || [];
  const items = filters.category
    ? allItems.filter((j) => j.category === filters.category)
    : allItems;

  return (
    <div className="container-page">
      <PageHeader title={t('nav.journals')} subtitle={t('hero.explore')} />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilters((f) => ({ ...f, category: c.key || undefined }))}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              (filters.category || '') === c.key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <select
            className="input w-auto"
            value={filters.indexedIn || ''}
            onChange={(e) => setFilters((f) => ({ ...f, indexedIn: e.target.value || undefined }))}
          >
            <option value="">{t('journals.indexedIn')}</option>
            {INDEXES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <select
            className="input w-auto"
            value={filters.frequency || ''}
            onChange={(e) => setFilters((f) => ({ ...f, frequency: e.target.value || undefined }))}
          >
            <option value="">{t('journals.frequency')}</option>
            {FREQUENCIES.map((fr) => <option key={fr} value={fr}>{t(`journals.freq.${fr}`)}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">{t('common.loading')}</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-gray-500">{t('common.noData')}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((j) => <JournalCard key={j._id} journal={j} />)}
        </div>
      )}
    </div>
  );
}
