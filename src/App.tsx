/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

// Landing 保持同步 import（首頁不該延遲）
import Landing from './pages/Landing';

// 其餘頁面按需載入
const Home = lazy(() => import('./pages/Home'));
const Info = lazy(() => import('./pages/Info'));
const Works = lazy(() => import('./pages/Works'));
const WorkDetail = lazy(() => import('./pages/WorkDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const Progress = lazy(() => import('./pages/Progress'));
const Contact = lazy(() => import('./pages/Contact'));

function PageFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[rgba(102,140,141,0.3)] border-t-[rgb(102,140,141)] rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/home" element={<PageTransition><Suspense fallback={<PageFallback />}><Home /></Suspense></PageTransition>} />
        <Route path="/info" element={<PageTransition><Suspense fallback={<PageFallback />}><Info /></Suspense></PageTransition>} />
        <Route path="/works" element={<PageTransition><Suspense fallback={<PageFallback />}><Works /></Suspense></PageTransition>} />
        <Route path="/works/:slug" element={<PageTransition><Suspense fallback={<PageFallback />}><WorkDetail /></Suspense></PageTransition>} />
        <Route path="/booking" element={<PageTransition><Suspense fallback={<PageFallback />}><Booking /></Suspense></PageTransition>} />
        <Route path="/progress" element={<PageTransition><Suspense fallback={<PageFallback />}><Progress /></Suspense></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Suspense fallback={<PageFallback />}><Contact /></Suspense></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-black min-h-screen text-white font-sans selection:bg-[var(--color-neon)] selection:text-black">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
}

