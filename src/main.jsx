import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import FrameworkPage from './FrameworkPage';
import dublinData from './data/dublin';
import spainData from './data/spain';
import romeData from './data/rome';
import australiaData from './data/australia';
import icelandData from './data/iceland';
import pragueData from './data/prague';
import munichData from './data/munich';
import polandData from './data/poland';
import thailandData from './data/thailand';
import michiganData from './data/michigan';
import charlestonData from './data/charleston';
import { IMAGES } from './images';
import { NEW_IMAGES } from './images-new';
import { BATCH3_IMAGES } from './images-batch3';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dublin" element={<FrameworkPage data={dublinData} heroImg={IMAGES.cliffs} />} />
      <Route path="/spain" element={<FrameworkPage data={spainData} heroImg={IMAGES.sagrada} />} />
      <Route path="/rome" element={<FrameworkPage data={romeData} heroImg={IMAGES.colosseum} />} />
      <Route path="/australia" element={<FrameworkPage data={australiaData} heroImg={IMAGES.opera} />} />
      <Route path="/iceland" element={<FrameworkPage data={icelandData} heroImg={IMAGES.iceland} />} />
      <Route path="/prague" element={<FrameworkPage data={pragueData} heroImg={IMAGES.stvitus} />} />
      <Route path="/munich" element={<FrameworkPage data={munichData} heroImg={BATCH3_IMAGES.munichMarienplatz} />} />
      <Route path="/poland" element={<FrameworkPage data={polandData} />} />
      <Route path="/thailand" element={<FrameworkPage data={thailandData} />} />
      <Route path="/michigan" element={<FrameworkPage data={michiganData} />} />
      <Route path="/charleston" element={<FrameworkPage data={charlestonData} />} />
    </Routes>
  </BrowserRouter>
);
