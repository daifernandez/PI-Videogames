import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/MediaGallery.css';

const MediaGallery = ({ gameId, type, onLoadComplete }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const apiUrl = process.env.REACT_APP_API_HOST;
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const cacheKey = `${gameId}-${type}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setMedia(parsedData[type]);
          setTotalPages(Math.ceil(parsedData[type].length / itemsPerPage));
          setError(null);
          setLoading(false);
          if (onLoadComplete) onLoadComplete();
          return;
        }

        const response = await axios.get(
          `${apiUrl}/videogame/${gameId}/${type}?page=${currentPage}`
        );
        
        sessionStorage.setItem(cacheKey, JSON.stringify(response.data));
        
        setMedia(response.data[type]);
        setTotalPages(Math.ceil(response.data[type].length / itemsPerPage));
        setError(null);
      } catch (err) {
        setError('Error al cargar el contenido multimedia');
        console.error(err);
      } finally {
        setLoading(false);
        if (onLoadComplete) onLoadComplete();
      }
    };

    fetchMedia();
  }, [gameId, type, apiUrl, onLoadComplete, currentPage]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return media.slice(startIndex, endIndex);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="media-loading">
        <div className="loading-spinner" />
        <p className="loading-text">Cargando {type === 'screenshots' ? 'capturas' : 'videos'}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="media-error">
        <p>{error}</p>
        {type === 'trailers' && (
          <p className="media-error-suggestion">
            Puedes buscar trailers de este juego en YouTube
          </p>
        )}
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="media-empty">
        <p>
          {type === 'screenshots'
            ? 'No hay capturas de pantalla disponibles para este juego'
            : 'No hay videos disponibles para este juego'
          }
        </p>
        {type === 'trailers' && (
          <p className="media-empty-suggestion">
            Puedes buscar trailers de este juego en YouTube
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="media-gallery">
      <div className="media-container">
        {type === 'screenshots' ? (
          // Renderizado de screenshots
          <>
            {getCurrentPageItems().map((screenshot, index) => (
              <div 
                key={index} 
                className="screenshot-item"
                onClick={() => openModal(screenshot)}
              >
                <img 
                  src={screenshot} 
                  alt={`Screenshot ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
            {selectedImage && (
              <div className="screenshot-modal active" onClick={closeModal}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <img src={selectedImage} alt="Screenshot en pantalla completa" />
                  <button className="modal-close" onClick={closeModal}>×</button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Renderizado de trailers
          getCurrentPageItems().map((trailer, index) => (
            <div key={index} className="trailer-item">
              <div className="trailer-container">
                <h3 className="trailer-title">{trailer.name}</h3>
                <div className="video-wrapper">
                  {trailer.isYoutube ? (
                    <iframe
                      src={trailer.url}
                      title={trailer.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="trailer-video"
                    />
                  ) : trailer.url?.endsWith('.mp4') ? (
                    <video
                      controls
                      poster={trailer.thumbnail}
                      className="trailer-video"
                      preload="metadata"
                    >
                      <source src={trailer.url} type="video/mp4" />
                      <p>Tu navegador no soporta el elemento de video.</p>
                    </video>
                  ) : (
                    <div className="trailer-preview-container">
                      <img 
                        src={trailer.preview} 
                        alt={trailer.name}
                        className="trailer-preview"
                      />
                      <div className="play-button" />
                      <p className="trailer-error-text">Video no disponible</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <div>
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="pagination-NextPrevious"
            >
              ←
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={pageNumber === currentPage ? "pagination-button-current" : "pagination-button"}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className="pagination-NextPrevious"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery; 
