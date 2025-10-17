import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GeneratePage from './pages/GeneratePage';
import GalleryPage from './pages/GalleryPage';
import TutorialApp from './TutorialApp';

function App() {
  const [tutorialMode, setTutorialMode] = useState(false);

  // Check URL parameter for tutorial mode
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tutorial') === 'true') {
      setTutorialMode(true);
    }
  }, []);

  if (tutorialMode) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setTutorialMode(false)}
            className="bg-white text-purple-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          >
            Switch to Advanced Mode
          </button>
        </div>
        <TutorialApp />
      </div>
    );
  }

  return (
    <Router>
      <Layout onTutorialModeToggle={() => setTutorialMode(true)}>
        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/tutorial" element={<TutorialApp />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
