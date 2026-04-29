import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

import HomePage from './pages/HomePage';
import JournalsPage from './pages/JournalsPage';
import JournalDetailPage from './pages/JournalDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ImradPage from './pages/ImradPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import ContactPage from './pages/ContactPage';
import SearchResultsPage from './pages/SearchResultsPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import CabinetLayout from './pages/cabinet/CabinetLayout';
import DashboardHome from './pages/cabinet/DashboardHome';
import SubmitArticlePage from './pages/cabinet/SubmitArticlePage';
import MyArticleDetailPage from './pages/cabinet/MyArticleDetailPage';
import ProfilePage from './pages/cabinet/ProfilePage';

import EditorLayout from './pages/editor/EditorLayout';
import SubmissionsList from './pages/editor/SubmissionsList';
import ArticleReviewPage from './pages/editor/ArticleReviewPage';
import IssueManager from './pages/editor/IssueManager';

import AdminLayout from './pages/admin/AdminLayout';
import AdminStats from './pages/admin/AdminStats';
import JournalManager from './pages/admin/JournalManager';
import UserManager from './pages/admin/UserManager';
import AnnouncementManager from './pages/admin/AnnouncementManager';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route index element={<HomePage />} />
          <Route path="jurnallar" element={<JournalsPage />} />
          <Route path="jurnallar/:slug" element={<JournalDetailPage />} />
          <Route path="maqolalar" element={<ArticlesPage />} />
          <Route path="maqolalar/:id" element={<ArticleDetailPage />} />
          <Route path="imrad" element={<ImradPage />} />
          <Route path="elon" element={<AnnouncementsPage />} />
          <Route path="elon/:id" element={<AnnouncementDetailPage />} />
          <Route path="aloqa" element={<ContactPage />} />
          <Route path="search" element={<SearchResultsPage />} />

          {/* Auth */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />

          {/* Cabinet (any authenticated user) */}
          <Route
            path="cabinet"
            element={
              <ProtectedRoute>
                <CabinetLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="submit" element={<SubmitArticlePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="articles/:id" element={<MyArticleDetailPage />} />
          </Route>

          {/* Editor */}
          <Route
            path="editor"
            element={
              <RoleRoute roles={['editor', 'admin']}>
                <EditorLayout />
              </RoleRoute>
            }
          >
            <Route index element={<SubmissionsList />} />
            <Route path="articles/:id" element={<ArticleReviewPage />} />
            <Route path="issues" element={<IssueManager />} />
          </Route>

          {/* Admin */}
          <Route
            path="admin"
            element={
              <RoleRoute roles={['admin']}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<AdminStats />} />
            <Route path="journals" element={<JournalManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="announcements" element={<AnnouncementManager />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
