import { INDEX_COLORS } from '../utils/format';

export default function IndexBadge({ name }) {
  return <span className={`badge ${INDEX_COLORS[name] || 'bg-gray-100 text-gray-700'}`}>{name}</span>;
}
