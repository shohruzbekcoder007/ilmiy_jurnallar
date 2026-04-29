import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Tab } from '@headlessui/react';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { articles } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n, formatDate, buildCitation } from '../utils/format';

const LANGS = ['uz', 'ru', 'en'];

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { lang } = useLang();
  const [citationStyle, setCitationStyle] = useState('apa');

  const { data, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articles.get(id),
  });

  if (isLoading) return <div className="container-page py-12">{t('common.loading')}</div>;
  const a = data?.data?.article;
  if (!a) return <div className="container-page py-12">{t('common.noData')}</div>;

  return (
    <div className="container-page grid gap-6 lg:grid-cols-[1fr_320px]">
      <article className="space-y-6">
        <header>
          <div className="text-xs uppercase text-secondary font-semibold">
            {pickI18n(a.journal?.title, lang)}
            {a.issue && <> · {a.issue.year}, {a.issue.volume}({a.issue.number})</>}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-primary">{pickI18n(a.title, lang)}</h1>
          <div className="mt-3 text-sm text-gray-700">
            {(a.authors || []).map((au, i) => (
              <span key={i}>
                {au.user?.fullName}
                {au.user?.orcid && (
                  <a
                    href={`https://orcid.org/${au.user.orcid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 text-xs text-primary"
                  >
                    [ORCID]
                  </a>
                )}
                {i < a.authors.length - 1 && '; '}
              </span>
            ))}
          </div>
        </header>

        <section className="card">
          <h2 className="mb-3 font-semibold">{t('articles.abstract')}</h2>
          <Tab.Group>
            <Tab.List className="mb-3 flex gap-1 rounded-lg bg-gray-100 p-1 w-max">
              {LANGS.map((l) => (
                <Tab
                  key={l}
                  className={({ selected }) =>
                    `rounded-md px-3 py-1 text-xs font-medium ${selected ? 'bg-white shadow text-primary' : 'text-gray-600'}`
                  }
                >
                  {l.toUpperCase()}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {LANGS.map((l) => (
                <Tab.Panel key={l}>
                  <p className="text-sm leading-relaxed text-gray-700">{pickI18n(a.abstract, l) || '—'}</p>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
          {a.keywords?.length > 0 && (
            <div className="mt-4">
              <div className="text-xs uppercase text-gray-500 mb-1">{t('articles.keywords')}</div>
              <div className="flex flex-wrap gap-2">
                {a.keywords.map((k, i) => (
                  <span key={i} className="badge bg-primary-50 text-primary">
                    {k.uz || k.en}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {(a.imradStructure?.introduction || a.imradStructure?.results) && (
          <section className="card">
            <h2 className="mb-3 font-semibold">IMRAD</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-700">
              {a.imradStructure?.introduction && <Field title={t('imrad.intro')} text={a.imradStructure.introduction} />}
              {a.imradStructure?.methodology && <Field title={t('imrad.methods')} text={a.imradStructure.methodology} />}
              {a.imradStructure?.results && <Field title={t('imrad.results')} text={a.imradStructure.results} />}
              {a.imradStructure?.discussion && <Field title={t('imrad.discussion')} text={a.imradStructure.discussion} />}
              {a.imradStructure?.conclusion && <Field title={t('imrad.conclusion')} text={a.imradStructure.conclusion} />}
            </div>
          </section>
        )}

        <section className="card">
          <h2 className="mb-3 font-semibold">{t('articles.citation')}</h2>
          <div className="mb-2 flex gap-1">
            {['apa', 'mla', 'chicago'].map((s) => (
              <button
                key={s}
                onClick={() => setCitationStyle(s)}
                className={`badge cursor-pointer ${citationStyle === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <pre className="whitespace-pre-wrap rounded-lg bg-surface p-3 text-xs text-gray-700">
            {buildCitation(a, citationStyle)}
          </pre>
        </section>
      </article>

      <aside className="space-y-4">
        <div className="card">
          <div className="text-xs uppercase text-gray-500 mb-2">{t('common.actions')}</div>
          {a.fileUrl ? (
            <a href={a.fileUrl} target="_blank" rel="noreferrer" className="btn-primary w-full">
              <Download className="h-4 w-4" /> {t('articles.downloadPdf')}
            </a>
          ) : (
            <div className="text-xs text-gray-500">PDF mavjud emas</div>
          )}
          {a.fileUrl && (
            <a href={a.fileUrl} target="_blank" rel="noreferrer" className="btn-outline w-full mt-2">
              <ExternalLink className="h-4 w-4" /> {t('articles.viewPdf')}
            </a>
          )}
        </div>

        <div className="card text-sm">
          <Row label={t('articles.journal')} value={pickI18n(a.journal?.title, lang)} />
          {a.issue && (
            <Row label={t('articles.issue')} value={`${a.issue.year} — ${a.issue.volume}/${a.issue.number}`} />
          )}
          {a.udk && <Row label={t('articles.udk')} value={a.udk} />}
          {a.doi && <Row label={t('articles.doi')} value={a.doi} />}
          {a.pages?.from && <Row label={t('articles.pages')} value={`${a.pages.from}–${a.pages.to || ''}`} />}
          <Row label={t('articles.language')} value={(a.language || '').toUpperCase()} />
          <Row label={formatDate(a.publishedAt, lang)} value={`${a.viewCount || 0} 👁  ${a.downloadCount || 0} ⬇`} />
        </div>

        {a.journal?.slug && (
          <Link to={`/jurnallar/${a.journal.slug}`} className="card flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            {pickI18n(a.journal?.title, lang)}
          </Link>
        )}
      </aside>
    </div>
  );
}

function Field({ title, text }) {
  return (
    <div>
      <div className="text-xs uppercase text-gray-500 font-semibold">{title}</div>
      <p className="mt-1 whitespace-pre-line">{text}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 py-1.5 last:border-0">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-right text-sm text-ink">{value}</div>
    </div>
  );
}
