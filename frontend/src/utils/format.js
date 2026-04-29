export function pickI18n(obj, lang = 'uz') {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.uz || obj.en || obj.ru || '';
}

export function formatDate(d, lang = 'uz') {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString(
      lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  } catch {
    return String(d);
  }
}

export function authorsText(authors = [], lang = 'uz') {
  return authors
    .filter(Boolean)
    .map((a) => a.user?.fullName || a.fullName || '—')
    .join(', ');
}

export function buildCitation(article, style = 'apa') {
  if (!article) return '';
  const authors = (article.authors || []).map((a) => a.user?.fullName || '').filter(Boolean).join(', ');
  const year = article.publishedAt ? new Date(article.publishedAt).getFullYear() : '';
  const title = pickI18n(article.title, 'uz');
  const journal = pickI18n(article.journal?.title, 'uz') || article.journal || '';
  const issue = article.issue ? `${article.issue.volume}(${article.issue.number})` : '';
  const pages = article.pages?.from ? `${article.pages.from}-${article.pages.to || ''}` : '';
  const doi = article.doi ? ` https://doi.org/${article.doi}` : '';

  switch (style) {
    case 'mla':
      return `${authors}. "${title}." ${journal}, vol. ${issue}, ${year}, pp. ${pages}.${doi}`;
    case 'chicago':
      return `${authors}. "${title}." ${journal} ${issue} (${year}): ${pages}.${doi}`;
    default:
      return `${authors} (${year}). ${title}. ${journal}, ${issue}, ${pages}.${doi}`;
  }
}

export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-800',
  revision_needed: 'bg-orange-100 text-orange-700',
  accepted: 'bg-teal-100 text-teal-700',
  rejected: 'bg-red-100 text-red-700',
  published: 'bg-green-100 text-green-700',
};

export const INDEX_COLORS = {
  Scopus: 'bg-blue-100 text-blue-700',
  'Web of Science': 'bg-green-100 text-green-700',
  WoS: 'bg-green-100 text-green-700',
  OAK: 'bg-orange-100 text-orange-700',
};
