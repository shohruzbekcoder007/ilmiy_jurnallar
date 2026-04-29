import { useTranslation } from 'react-i18next';
import { STATUS_COLORS } from '../utils/format';

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  return (
    <span className={`badge ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'}`}>
      {t(`status.${status}`, status)}
    </span>
  );
}
