import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/auth/Profile';

// Dashboard Pages
import AdminDashboard from './pages/admin-dashboard/index';
import ContentManagement from './pages/content-management/index';
import TourPackageDetails from './pages/tour-package-details/index';
import DestinationSearch from './pages/destination-search/index';
import TouristDashboard from './pages/tourist-dashboard/index';
import PaymentProcessing from './pages/payment-processing/index';

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public Routes - No authentication required */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Admin Routes - Requires admin role */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/content-management" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ContentManagement />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected User Routes - Any authenticated user can access */}
            <Route 
              path="/tour-package-details" 
              element={
                <ProtectedRoute>
                  <TourPackageDetails />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/destination-search" 
              element={
                <ProtectedRoute>
                  <DestinationSearch />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tourist-dashboard" 
              element={
                <ProtectedRoute>
                  <TouristDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment-processing" 
              element={
                <ProtectedRoute>
                  <PaymentProcessing />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;