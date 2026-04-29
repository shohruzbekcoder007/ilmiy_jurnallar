import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Disclosure } from '@headlessui/react';
import { ChevronDown, BookOpen, Send } from 'lucide-react';
import { journals, issues as issuesApi } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n, formatDate, authorsText } from '../utils/format';
import IndexBadge from '../components/IndexBadge';
import { useAuth } from '../context/AuthContext';

export default function JournalDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { user } = useAuth();

  const { data: jr } = useQuery({ queryKey: ['journal', slug], queryFn: () => journals.get(slug) });
  const { data: iss } = useQuery({ queryKey: ['journal-issues', slug], queryFn: () => journals.issues(slug) });

  const journal = jr?.data?.journal;
  if (!journal) return <div className="container-page">{t('common.loading')}</div>;

  return (
    <div className="container-page space-y-8">
      <section className="card flex flex-col gap-4 md:flex-row">
        <div className="flex h-40 w-32 flex-none items-center justify-center rounded-lg bg-primary-50">
          {journal.coverImage ? (
            <img src={journal.coverImage} alt="" className="h-full w-full rounded-lg object-cover" />
          ) : (
            <BookOpen className="h-12 w-12 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">{pickI18n(journal.title, lang)}</h1>
          <p className="mt-2 text-sm text-gray-600">{pickI18n(journal.description, lang)}</p>
          <div className="mt-3 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
            {journal.issn && <div><strong>ISSN:</strong> {journal.issn}</div>}
            {journal.eissn && <div><strong>eISSN:</strong> {journal.eissn}</div>}
            <div><strong>{t('journals.frequency')}:</strong> {t(`journals.freq.${journal.frequency}`, journal.frequency)}</div>
            {journal.chiefEditor && <div><strong>Bosh muharrir:</strong> {journal.chiefEditor.fullName}</div>}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {(journal.indexedIn || []).map((i) => <IndexBadge key={i} name={i} />)}
          </div>
          <div className="mt-4">
            <Link
              to={user ? '/cabinet/submit' : '/login?next=/cabinet/submit'}
              className="btn-primary"
            >
              <Send className="h-4 w-4" /> {t('journals.submitArticle')}
            </Link>
          </div>
        </div>
      </section>

      {journal.editorialBoard?.length > 0 && (
        <section className="card">
          <h2 className="mb-3 text-lg font-semibold text-ink">{t('journals.editorialBoard')}</h2>
          <ul className="grid gap-2 md:grid-cols-2">
            {journal.editorialBoard.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="font-medium">{m.user?.fullName}</span>
                {m.user?.degree && <span className="text-gray-500">— {m.user.degree}</span>}
                <span className="ml-auto text-xs text-gray-400">{m.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">{t('journals.issues')}</h2>
        <div className="space-y-2">
          {(iss?.data?.issues || []).map((issue) => (
            <IssueDisclosure key={issue._id} issue={issue} lang={lang} t={t} />
          ))}
          {!iss?.data?.issues?.length && <div className="text-gray-500">{t('common.noData')}</div>}
        </div>
      </section>
    </div>
  );
}

function IssueDisclosure({ issue, lang, t }) {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="rounded-xl bg-white shadow-sm">
          <Disclosure.Button className="flex w-full items-center justify-between p-4">
            <div className="text-left">
              <div className="font-semibold text-primary">
                {issue.year} — Tom {issue.volume}, Son {issue.number}
              </div>
              <div className="text-xs text-gray-500">{formatDate(issue.publishedAt, lang)}</div>
            </div>
            <ChevronDown className={`h-5 w-5 transition ${open ? 'rotate-180' : ''}`} />
          </Disclosure.Button>
          <Disclosure.Panel className="border-t border-gray-100 p-4">
            <IssueArticles issueId={issue._id} lang={lang} t={t} />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

function IssueArticles({ issueId, lang, t }) {
  const { data, isLoading } = useQuery({
    queryKey: ['issue-articles', issueId],
    queryFn: () => issuesApi.articles(issueId),
  });
  if (isLoading) return <div className="text-sm text-gray-500">{t('common.loading')}</div>;
  const items = data?.data?.items || [];
  if (!items.length) return <div className="text-sm text-gray-500">{t('common.noData')}</div>;
  return (
    <ul className="divide-y divide-gray-100">
      {items.map((a) => (
        <li key={a._id} className="py-2">
          <Link to={`/maqolalar/${a._id}`} className="font-medium text-primary hover:underline">
            {pickI18n(a.title, lang)}
          </Link>
          <div className="text-xs text-gray-500">{authorsText(a.authors, lang)}</div>
        </li>
      ))}
    </ul>
  );
}
