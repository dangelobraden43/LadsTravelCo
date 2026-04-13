import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import FrameworkPage from './FrameworkPage';
import dublinData from './data/dublin';
import { IMAGES } from './images';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dublin" element={<FrameworkPage data={dublinData} heroImg={IMAGES.cliffs} />} />
    </Routes>
  </BrowserRouter>
);
