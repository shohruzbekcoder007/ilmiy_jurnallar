const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.SMTP.host) {
    console.warn('[email] SMTP not configured — emails will be logged only.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.SMTP.host,
    port: env.SMTP.port,
    secure: env.SMTP.secure,
    auth: env.SMTP.user ? { user: env.SMTP.user, pass: env.SMTP.pass } : undefined,
  });
  return transporter;
}

function wrap(content) {
  return `<!doctype html>
<html><body style="font-family:Inter,Arial,sans-serif;background:#F5F7FA;padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.06)">
    <div style="background:#1A3A6E;padding:20px;color:#fff">
      <h2 style="margin:0;font-weight:700">ziyonashrmedia</h2>
      <div style="opacity:.85;font-size:13px">ziyonashrmedia</div>
    </div>
    <div style="padding:24px;color:#1F2937;line-height:1.6;font-size:14px">
      ${content}
    </div>
    <div style="background:#F5F7FA;padding:14px;text-align:center;color:#6B7280;font-size:12px">
      &copy; ${new Date().getFullYear()} ziyonashrmedia
    </div>
  </div>
</body></html>`;
}

async function sendEmail({ to, subject, html }) {
  const t = getTransporter();
  const message = { from: env.SMTP.from, to, subject, html: wrap(html) };
  if (!t) {
    console.log(`[email] (mock) ${subject} -> ${to}`);
    return { mocked: true };
  }
  return t.sendMail(message);
}

const templates = {
  welcome: (user) => ({
    subject: 'Xush kelibsiz / Welcome',
    html: `<h3>Salom, ${user.fullName}!</h3>
<p>ziyonashrmedia platformasiga muvaffaqiyatli ro'yxatdan o'tdingiz.</p>
<p>Endi maqolalar yuborishingiz mumkin.</p>`,
  }),
  articleSubmitted: (article, author) => ({
    subject: `Maqolangiz qabul qilindi: ${article.title?.uz || ''}`,
    html: `<h3>Hurmatli ${author.fullName}!</h3>
<p>"${article.title?.uz}" nomli maqolangiz tahririyatga yetib keldi va ko'rib chiqilmoqda.</p>`,
  }),
  editorNewSubmission: (article) => ({
    subject: `Yangi maqola yuborildi: ${article.title?.uz || ''}`,
    html: `<p>Yangi maqola tahririyatga keldi: <strong>${article.title?.uz}</strong></p>`,
  }),
  reviewerAssigned: (article, reviewer) => ({
    subject: `Sizga taqriz uchun maqola tayinlandi`,
    html: `<h3>Hurmatli ${reviewer.fullName}!</h3>
<p>"${article.title?.uz}" maqolasini ko'rib chiqishingiz so'raladi.</p>
<p>Iltimos, kabinet orqali taqrizingizni yuboring.</p>`,
  }),
  reviewSubmitted: (article) => ({
    subject: `Yangi taqriz keldi: ${article.title?.uz || ''}`,
    html: `<p>"${article.title?.uz}" maqolasi bo'yicha yangi taqriz qabul qilindi.</p>`,
  }),
  articleAccepted: (article, author) => ({
    subject: `Maqolangiz qabul qilindi`,
    html: `<h3>Tabriklaymiz, ${author.fullName}!</h3>
<p>"${article.title?.uz}" maqolangiz qabul qilindi va nashr uchun tayyorlanmoqda.</p>`,
  }),
  articleRejected: (article, author, comments) => ({
    subject: `Maqola haqida qaror`,
    html: `<h3>Hurmatli ${author.fullName}</h3>
<p>"${article.title?.uz}" maqolangiz nashr uchun maqul topilmadi.</p>
<p><strong>Taqrizchi izohlari (anonim):</strong></p>
<blockquote style="border-left:3px solid #DC2626;padding-left:10px;color:#374151">${comments || ''}</blockquote>`,
  }),
  revisionRequested: (article, author, comments) => ({
    subject: `Maqolaga qayta ishlash so'rovi`,
    html: `<h3>Hurmatli ${author.fullName}</h3>
<p>"${article.title?.uz}" maqolangizga qayta ishlash so'ralmoqda.</p>
<p><strong>Izohlar:</strong></p>
<blockquote style="border-left:3px solid #D97706;padding-left:10px;color:#374151">${comments || ''}</blockquote>`,
  }),
  articlePublished: (article, author) => ({
    subject: `Maqolangiz nashr etildi`,
    html: `<h3>Tabriklaymiz, ${author.fullName}!</h3>
<p>"${article.title?.uz}" maqolangiz muvaffaqiyatli nashr etildi.</p>
${article.doi ? `<p>DOI: <strong>${article.doi}</strong></p>` : ''}`,
  }),
  resetPassword: (user, link) => ({
    subject: `Parolni tiklash`,
    html: `<h3>Salom, ${user.fullName}</h3>
<p>Parolni tiklash uchun quyidagi havolaga o'ting (1 soat amal qiladi):</p>
<p><a href="${link}" style="background:#1A3A6E;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Parolni tiklash</a></p>`,
  }),
};

module.exports = { sendEmail, templates };
