import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ConsumerPortal from './pages/consumer-portal';
import LoginPage from './pages/login';
import DocumentManagement from './pages/document-management';
import ConversationInterface from './pages/conversation-interface';
import DealerDashboard from './pages/dealer-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/consumer-portal" element={<ConsumerPortal />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/document-management" element={<DocumentManagement />} />
        <Route path="/conversation-interface" element={<ConversationInterface />} />
        <Route path="/dealer-dashboard" element={<DealerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
