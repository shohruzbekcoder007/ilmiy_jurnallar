import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const SECTIONS = [
  {
    key: 'intro',
    titleKey: 'imrad.intro',
    body: 'Mavzuning dolzarbligi, ilmiy adabiyotlar tahlili, tadqiqot maqsadi va vazifalari, ish gipotezasi.',
  },
  {
    key: 'methods',
    titleKey: 'imrad.methods',
    body: 'Tadqiqot uslubi, namuna olish, ma\'lumotlar manbasi, tahlil vositalari va qo\'llaniladigan modellar.',
  },
  {
    key: 'results',
    titleKey: 'imrad.results',
    body: 'Olingan natijalar — jadval, grafik va statistik tahlil bilan birgalikda izchil bayon etiladi.',
  },
  {
    key: 'analysis',
    titleKey: 'imrad.analysis',
    body: 'Natijalar boshqa tadqiqotlar bilan qiyoslanadi, sabablar tahlil qilinadi.',
  },
  {
    key: 'discussion',
    titleKey: 'imrad.discussion',
    body: 'Natijalarning amaliy ahamiyati, cheklovlar, kelgusi tadqiqot yo\'nalishlari muhokama qilinadi.',
  },
  {
    key: 'conclusion',
    titleKey: 'imrad.conclusion',
    body: 'Asosiy xulosalar, takliflar va tavsiyalar qisqacha bayon qilinadi.',
  },
];

export default function ImradPage() {
  const { t } = useTranslation();
  return (
    <div className="container-page">
      <PageHeader title={t('imrad.title')} subtitle="Ilmiy maqola yozish bo'yicha standart struktura" />

      <div className="card mb-6">
        <p className="text-sm text-gray-700">
          IMRAD — <strong>Introduction, Methods, Results, And Discussion</strong> — bu xalqaro ilmiy
          jurnallarda qabul qilingan empirik maqola tuzilmasi. U muallifga g'oyani aniq, mantiqiy va
          tekshiriluvchan tarzda yetkazishga yordam beradi.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((s, i) => (
          <div key={s.key} className="card">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
              {i + 1}
            </div>
            <h3 className="font-semibold text-primary">{t(s.titleKey)}</h3>
            <p className="mt-2 text-sm text-gray-700">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold">Maqola shabloni</div>
          <p className="text-sm text-gray-600">IMRAD strukturasi asosidagi Word/PDF shablon.</p>
        </div>
        <a href="/templates/imrad-template.docx" className="btn-primary">
          <Download className="h-4 w-4" /> Yuklab olish
        </a>
      </div>
    </div>
  );
}
