import client from './client';

export const auth = {
  register: (payload) => client.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => client.post('/auth/login', payload).then((r) => r.data),
  logout: () => client.post('/auth/logout').then((r) => r.data),
  me: () => client.get('/auth/me').then((r) => r.data),
  updateMe: (payload) => client.patch('/auth/me', payload).then((r) => r.data),
  forgot: (email) => client.post('/auth/forgot-password', { email }).then((r) => r.data),
  reset: (token, password) => client.post(`/auth/reset-password/${token}`, { password }).then((r) => r.data),
  refresh: () => client.post('/auth/refresh').then((r) => r.data),
};

export const journals = {
  list: (params) => client.get('/journals', { params }).then((r) => r.data),
  get: (slug) => client.get(`/journals/${slug}`).then((r) => r.data),
  issues: (slug) => client.get(`/journals/${slug}/issues`).then((r) => r.data),
  articles: (slug, params) => client.get(`/journals/${slug}/articles`, { params }).then((r) => r.data),
  create: (payload) => client.post('/journals', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/journals/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/journals/${id}`).then((r) => r.data),
};

export const issues = {
  create: (payload) => client.post('/issues', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/issues/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/issues/${id}`).then((r) => r.data),
  articles: (id) => client.get(`/issues/${id}/articles`).then((r) => r.data),
};

export const articles = {
  list: (params) => client.get('/articles', { params }).then((r) => r.data),
  get: (id) => client.get(`/articles/${id}`).then((r) => r.data),
  download: (id) => client.get(`/articles/${id}/download`).then((r) => r.data),
  submit: (payload) => client.post('/articles', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/articles/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/articles/${id}`).then((r) => r.data),
  mine: () => client.get('/articles/mine').then((r) => r.data),
  submissions: (params) => client.get('/articles/submissions', { params }).then((r) => r.data),
  assignReviewer: (id, reviewerIds) => client.patch(`/articles/${id}/assign-reviewer`, { reviewerIds }).then((r) => r.data),
  changeStatus: (id, status, note) => client.patch(`/articles/${id}/status`, { status, note }).then((r) => r.data),
  publish: (id, payload) => client.patch(`/articles/${id}/publish`, payload).then((r) => r.data),
  timeline: (id) => client.get(`/articles/${id}/timeline`).then((r) => r.data),
};

export const reviews = {
  submit: (payload) => client.post('/reviews', payload).then((r) => r.data),
  mine: () => client.get('/reviews/my').then((r) => r.data),
  assigned: () => client.get('/reviews/assigned').then((r) => r.data),
  ofArticle: (articleId) => client.get(`/reviews/${articleId}`).then((r) => r.data),
};

export const users = {
  list: (params) => client.get('/users', { params }).then((r) => r.data),
  get: (id) => client.get(`/users/${id}`).then((r) => r.data),
  changeRole: (id, role) => client.patch(`/users/${id}/role`, { role }).then((r) => r.data),
  remove: (id) => client.delete(`/users/${id}`).then((r) => r.data),
  search: (q) => client.get('/users/search', { params: { q } }).then((r) => r.data),
};

export const announcements = {
  list: (params) => client.get('/announcements', { params }).then((r) => r.data),
  get: (id) => client.get(`/announcements/${id}`).then((r) => r.data),
  create: (payload) => client.post('/announcements', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/announcements/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/announcements/${id}`).then((r) => r.data),
};

export const stats = {
  summary: () => client.get('/stats').then((r) => r.data),
  search: (q) => client.get('/stats/search', { params: { q } }).then((r) => r.data),
  admin: () => client.get('/stats/admin').then((r) => r.data),
};

export const upload = {
  pdf: (formData) => client.post('/upload/pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data),
  image: (formData) => client.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data),
};
