import React, { useState, useEffect, useRef } from 'react';
import { GALLERY_IMAGES } from './images-gallery';
import { BATCH3_IMAGES } from './images-paths';
import { NEW_IMAGES } from './images-paths';
import { HERO_IMAGES } from './images-paths';
import { HEIC_HERO_IMAGES } from './images-paths';
import './PhotoGallery.css';

/* Gallery photos with captions — gallery images + art/culture supplements */
const GALLERY_ITEMS = [
  // Gallery originals
  { src: GALLERY_IMAGES.gallery_IMG_0423, caption: 'Museum atmosphere', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_0425, caption: 'Gallery interior', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_0439, caption: 'Exhibition hall', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_0602_1, caption: 'Art installation', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_1120, caption: 'Cultural landmark', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_1142, caption: 'Gallery visit', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_2268, caption: 'Architecture detail', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_2280, caption: 'Museum piece', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_2467, caption: 'Exhibit hall', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_2502_Original, caption: 'Gallery space', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_3457, caption: 'Cultural exhibit', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_3484, caption: 'Art piece', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_3524, caption: 'Museum interior', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_3588, caption: 'Gallery wing', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_4484, caption: 'Exhibition view', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_4703, caption: 'Art gallery', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_6790, caption: 'Cultural space', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_9816, caption: 'Gallery moment', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_0237, caption: 'Museum corridor', location: 'Europe' },
  { src: GALLERY_IMAGES.gallery_IMG_0974, caption: 'Exhibition detail', location: 'Europe' },
  // Art/culture supplements from existing modules
  { src: BATCH3_IMAGES.klimtKiss, caption: 'The Kiss — Gustav Klimt', location: 'Vienna' },
  { src: NEW_IMAGES.sistineChapel, caption: 'Sistine Chapel ceiling', location: 'Rome' },
  { src: NEW_IMAGES.pantheonRome, caption: 'The Pantheon', location: 'Rome' },
  { src: NEW_IMAGES.schonbrunn, caption: 'Schonbrunn Palace', location: 'Vienna' },
  { src: HERO_IMAGES.sistineChapelCeilingRome, caption: 'Sistine Chapel — Michelangelo', location: 'Vatican City' },
  { src: HERO_IMAGES.waterfallCliffsideEurope, caption: 'European waterfall', location: 'Europe' },
  { src: HEIC_HERO_IMAGES.heicItaly_IMG_3525, caption: 'Italian architecture', location: 'Italy' },
  { src: HEIC_HERO_IMAGES.heicIreland_IMG_2268, caption: 'Irish countryside', location: 'Ireland' },
  { src: HEIC_HERO_IMAGES.heicVacouver_IMG_1851, caption: 'Vancouver waterfront', location: 'Vancouver' },
  { src: HEIC_HERO_IMAGES.heicHiking_IMG_4195, caption: 'Mountain trail', location: 'Adventure' },
].filter(item => item.src); // filter out any missing images

export default function PhotoGallery() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (galleryRef.current) {
        const rect = galleryRef.current.getBoundingClientRect();
        setScrollY(-rect.top * 0.08);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close lightbox on ESC
  useEffect(() => {
    if (selectedIdx === null) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedIdx(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIdx]);

  // Distribute into 3 columns with parallax offsets
  const cols = [[], [], []];
  GALLERY_ITEMS.forEach((item, i) => {
    cols[i % 3].push({ ...item, globalIdx: i });
  });

  return (
    <>
      <section className="photo-gallery-section" ref={galleryRef}>
        <div className="photo-gallery-header">
          <div className="photo-gallery-label">THE GALLERY</div>
          <h2 className="photo-gallery-title">Moments That<br/><em>Made the Trip</em></h2>
          <p className="photo-gallery-desc">
            Museums, landmarks, and the in-between moments. Every photo from the road.
          </p>
        </div>

        <div className="photo-gallery-wall">
          {cols.map((col, colIdx) => (
            <div
              key={colIdx}
              className="photo-gallery-col"
              style={{ transform: `translateY(${scrollY * (colIdx === 1 ? -0.5 : 0.3) * (colIdx === 2 ? -0.8 : 1)}px)` }}
            >
              {col.map((item) => (
                <div
                  key={item.globalIdx}
                  className="photo-gallery-item"
                  onClick={() => setSelectedIdx(item.globalIdx)}
                >
                  <img src={item.src} alt={item.caption} loading="lazy" />
                  <div className="photo-gallery-item-overlay">
                    <span className="photo-gallery-item-location">{item.location}</span>
                    <span className="photo-gallery-item-caption">{item.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {selectedIdx !== null && (
        <div className="photo-lightbox" onClick={() => setSelectedIdx(null)}>
          <div className="photo-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY_ITEMS[selectedIdx].src} alt={GALLERY_ITEMS[selectedIdx].caption} />
            <div className="photo-lightbox-info">
              <span className="photo-lightbox-location">{GALLERY_ITEMS[selectedIdx].location}</span>
              <span className="photo-lightbox-caption">{GALLERY_ITEMS[selectedIdx].caption}</span>
            </div>
            <button className="photo-lightbox-close" onClick={() => setSelectedIdx(null)}>
              &times;
            </button>
            {selectedIdx > 0 && (
              <button className="photo-lightbox-nav photo-lightbox-prev" onClick={() => setSelectedIdx(selectedIdx - 1)}>
                &#8249;
              </button>
            )}
            {selectedIdx < GALLERY_ITEMS.length - 1 && (
              <button className="photo-lightbox-nav photo-lightbox-next" onClick={() => setSelectedIdx(selectedIdx + 1)}>
                &#8250;
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
