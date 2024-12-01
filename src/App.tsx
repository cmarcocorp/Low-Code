import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Page1 } from './pages/Page1';
import { DBAdmin } from './pages/DBAdmin';
import { setupDatabase } from './lib/supabase/setup';

export function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/page/1" replace />} />
        <Route path="/page/1" element={<Page1 />} />
        <Route path="/page/2" element={<DBAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}