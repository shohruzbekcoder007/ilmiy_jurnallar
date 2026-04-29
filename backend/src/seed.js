/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('./config/env');
const User = require('./models/User');
const Journal = require('./models/Journal');
const Issue = require('./models/Issue');
const Article = require('./models/Article');
const Announcement = require('./models/Announcement');

async function seed() {
  await mongoose.connect(env.MONGO_URI);
  console.log('[seed] Connected.');

  await Promise.all([
    User.deleteMany({}),
    Journal.deleteMany({}),
    Issue.deleteMany({}),
    Article.deleteMany({}),
    Announcement.deleteMany({}),
  ]);

  const admin = await User.create({
    fullName: 'System Admin',
    email: 'admin@journal.uz',
    password: 'Admin123!',
    role: 'admin',
    affiliation: 'Tashkent State University of Economics',
    position: 'System Administrator',
    preferredLanguage: 'uz',
    isActive: true,
  });

  const editor = await User.create({
    fullName: 'Bosh Muharrir',
    email: 'editor@journal.uz',
    password: 'Editor123!',
    role: 'editor',
    affiliation: 'TDIU',
    position: 'Bosh muharrir',
    isActive: true,
  });

  const reviewer = await User.create({
    fullName: 'Taqrizchi Mutaxassis',
    email: 'reviewer@journal.uz',
    password: 'Reviewer123!',
    role: 'reviewer',
    affiliation: 'TDIU',
    degree: 'PhD',
    isActive: true,
  });

  const author = await User.create({
    fullName: 'Sardor Karimov',
    email: 'author@journal.uz',
    password: 'Author123!',
    role: 'author',
    affiliation: 'TDIU',
    degree: 'PhD',
    orcid: '0000-0001-2345-6789',
    isActive: true,
  });

  const journals = await Journal.create([
    {
      title: {
        uz: 'Iqtisodiyot va innovatsion texnologiyalar',
        ru: 'Экономика и инновационные технологии',
        en: 'Economy and Innovative Technologies',
      },
      description: {
        uz: 'Iqtisodiyot, raqamli iqtisodiyot va innovatsion texnologiyalar bo‘yicha ilmiy jurnal.',
        ru: 'Научный журнал по экономике, цифровой экономике и инновационным технологиям.',
        en: 'Scientific journal on economics, digital economy and innovative technologies.',
      },
      issn: '2181-1946',
      indexedIn: ['Scopus', 'OAK'],
      frequency: 'quarterly',
      chiefEditor: editor._id,
      editorialBoard: [{ user: reviewer._id, role: 'member' }],
    },
    {
      title: {
        uz: 'Yashil iqtisodiyot va taraqqiyot',
        ru: 'Зеленая экономика и развитие',
        en: 'Green Economy and Development',
      },
      description: {
        uz: 'Barqaror rivojlanish, ekologik iqtisodiyot va yashil texnologiyalar mavzusida.',
        ru: 'Об устойчивом развитии, экологической экономике и зеленых технологиях.',
        en: 'On sustainable development, ecological economics and green technologies.',
      },
      eissn: '2992-8095',
      indexedIn: ['OAK'],
      frequency: 'biannual',
      chiefEditor: editor._id,
    },
    {
      title: {
        uz: 'Mehnat iqtisodiyoti va inson kapitali',
        ru: 'Экономика труда и человеческий капитал',
        en: 'Labor Economics and Human Capital',
      },
      description: {
        uz: 'Mehnat bozori, inson kapitali va ish bilan bandlik masalalari.',
        ru: 'Рынок труда, человеческий капитал и вопросы занятости.',
        en: 'Labor market, human capital and employment issues.',
      },
      issn: '2181-9068',
      indexedIn: ['OAK'],
      frequency: 'quarterly',
      chiefEditor: editor._id,
    },
  ]);

  const year = new Date().getFullYear();
  for (const j of journals) {
    const issues = await Issue.create([
      {
        journal: j._id,
        volume: 1,
        number: 1,
        year,
        publishedAt: new Date(`${year}-03-30`),
        isPublished: true,
      },
      {
        journal: j._id,
        volume: 1,
        number: 2,
        year,
        publishedAt: new Date(`${year}-06-30`),
        isPublished: true,
      },
    ]);

    for (let i = 0; i < 5; i++) {
      const issue = issues[i % 2];
      await Article.create({
        journal: j._id,
        issue: issue._id,
        title: {
          uz: `${j.title.uz} — namuna maqola ${i + 1}`,
          ru: `${j.title.ru} — пример статьи ${i + 1}`,
          en: `${j.title.en} — sample article ${i + 1}`,
        },
        abstract: {
          uz: 'Ushbu maqolada zamonaviy iqtisodiy jarayonlar va ularning ta‘siri tahlil qilinadi.',
          ru: 'В данной статье анализируются современные экономические процессы и их влияние.',
          en: 'This article analyses contemporary economic processes and their impact.',
        },
        keywords: [
          { uz: 'iqtisodiyot', en: 'economy' },
          { uz: 'innovatsiya', en: 'innovation' },
          { uz: 'raqamli', en: 'digital' },
        ],
        authors: [{ user: author._id, order: 1, isCorresponding: true }],
        doi: `10.0000/sample.${j.slug}.${i + 1}`,
        udk: '330.34',
        pages: { from: i * 10 + 1, to: i * 10 + 9 },
        language: 'uz',
        fileUrl: '',
        status: 'published',
        publishedAt: issue.publishedAt,
        viewCount: Math.floor(Math.random() * 200),
        downloadCount: Math.floor(Math.random() * 100),
        imradStructure: {
          introduction: 'Mavzuning dolzarbligi va maqsadi.',
          methodology: 'Tadqiqot uslubi va ma‘lumotlar manbasi.',
          results: 'Asosiy natijalar va tahlil.',
          discussion: 'Natijalarning muhokamasi.',
          conclusion: 'Xulosalar va tavsiyalar.',
        },
      });
    }
  }

  await Announcement.create([
    {
      title: {
        uz: 'Maqolalar qabuli boshlandi',
        ru: 'Открыт прием статей',
        en: 'Call for papers is open',
      },
      body: {
        uz: 'Yangi sonimiz uchun maqolalar qabuli boshlandi. Iltimos, talablarni o‘qib chiqing.',
        ru: 'Открыт прием статей в новый выпуск. Пожалуйста, ознакомьтесь с требованиями.',
        en: 'Submissions are now open for our next issue. Please read the guidelines.',
      },
      type: 'call_for_papers',
      createdBy: admin._id,
    },
    {
      title: {
        uz: 'Xalqaro ilmiy konferentsiya',
        ru: 'Международная научная конференция',
        en: 'International scientific conference',
      },
      body: {
        uz: 'Universitetimizda xalqaro ilmiy konferentsiya o‘tkaziladi.',
        ru: 'В нашем университете состоится международная научная конференция.',
        en: 'An international scientific conference will be held at our university.',
      },
      type: 'conference',
      createdBy: admin._id,
    },
  ]);

  console.log('[seed] Done.');
  console.log('Admin   : admin@journal.uz / Admin123!');
  console.log('Editor  : editor@journal.uz / Editor123!');
  console.log('Reviewer: reviewer@journal.uz / Reviewer123!');
  console.log('Author  : author@journal.uz / Author123!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
