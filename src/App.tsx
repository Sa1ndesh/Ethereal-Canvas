import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GeneratePage from './pages/GeneratePage';
import GalleryPage from './pages/GalleryPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
