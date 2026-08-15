import React, { useState, useMemo } from 'react';
import { DigitalStoryCard, RouteCategory } from '../types';
import { Search, Filter, Eye, Download, Printer, MapPin, UserCheck, BookOpen, X, Maximize2, Share2, Building, GraduationCap, Check } from 'lucide-react';

interface CardGalleryProps {
  cards: DigitalStoryCard[];
  onCardView: (cardId: string) => void;
  onOpenUpload: () => void;
  isLoggedIn: boolean;
}

const routeCategoriesList: (RouteCategory | 'Tümü')[] = [
  'Tümü',
  'Ulus ve Müzeler Rotası',
  'Augustus ve Hacı Bayram Rotası',
  'Ankara Kalesi ve Samanpazarı',
  'Cumhuriyete Giden Yol',
  'Gordion ve Antik Ankara',
  'Beypazarı Kültür Rotası',
];

export const CardGallery: React.FC<CardGalleryProps> = ({
  cards,
  onCardView,
  onOpenUpload,
  isLoggedIn,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<RouteCategory | 'Tümü'>('Tümü');
  const [sortBy, setSortBy] = useState<'newest' | 'views'>('newest');
  const [selectedCardForModal, setSelectedCardForModal] = useState<DigitalStoryCard | null>(null);
  const [isFullScreenPosterOpen, setIsFullScreenPosterOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const filteredCards = useMemo(() => {
    return cards
      .filter((card) => {
        const matchesRoute = selectedRoute === 'Tümü' || card.routeCategory === selectedRoute;
        const queryLower = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !queryLower ||
          card.title.toLowerCase().includes(queryLower) ||
          card.authorName.toLowerCase().includes(queryLower) ||
          card.authorSchool.toLowerCase().includes(queryLower) ||
          card.district.toLowerCase().includes(queryLower) ||
          card.tags.some((t) => t.toLowerCase().includes(queryLower));
        return matchesRoute && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'views') {
          return b.viewsCount - a.viewsCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [cards, selectedRoute, searchQuery, sortBy]);

  const handleCardClick = (card: DigitalStoryCard) => {
    onCardView(card.id);
    setSelectedCardForModal(card);
  };

  const handlePrintSimulation = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (selectedCardForModal) {
      const shareUrl = `${window.location.origin}/#card-${selectedCardForModal.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div>
      <div className="official-hero-wrapper">
        <div className="meb-container">
          <div className="official-hero-boxed">
            <div className="hero-backdrop-seal"></div>
            <div className="hero-content-grid">
              <div>
                <span className="report-header-badge">SÖZLEŞME NO: TR51/25/İKT_TD/0041</span>
                <h2 className="hero-title-main">
                  DİJİTAL KÜLTÜR ROTALARI PLATFORMU
                </h2>
                <h3 className="hero-subtitle-main">
                  GEÇMİŞTEN GELECEĞE KÜLTÜRÜYLE ANKARA
                </h3>
                <p className="hero-desc-main">
                  Ankara İl Millî Eğitim Müdürlüğü bünyesinde eğitimi başarıyla tamamlayan 230 sertifikalı öğretmenimizin hazırladığı 1 sayfalık dijital kültür afişleri ve öğrenim bilgi kartları portalı.
                </p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <button className="btn-meb-primary" onClick={onOpenUpload}>
                    {isLoggedIn ? 'Yeni 1 Sayfalık Afiş Yükle' : 'Öğretmen Girişi Yap ve Afiş Yükle'}
                  </button>
                </div>
              </div>

              <div className="hero-seal-card-wrap">
                <img
                  src="/dkr-hero-logo.png"
                  alt="Dijital Kültür Rotaları Platformu Resmî Logosu"
                  className="hero-seal-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="meb-container">
        <div className="hero-stats-banner">
          <div className="stat-item-official">
            <div className="stat-num-official">230 / 300</div>
            <div className="stat-lbl-official">Sertifikalı Öğretmen</div>
          </div>
          <div className="stat-item-official">
            <div className="stat-num-official">{cards.length}</div>
            <div className="stat-lbl-official">Aktif Dijital Afiş</div>
          </div>
          <div className="stat-item-official">
            <div className="stat-num-official">6</div>
            <div className="stat-lbl-official">Ankara Kültür Rotası</div>
          </div>
          <div className="stat-item-official">
            <div className="stat-num-official">%76.6</div>
            <div className="stat-lbl-official">Tamamlanma Oranı</div>
          </div>
        </div>

        <div className="filter-section-official">
          <div className="filter-row-top">
            <div className="official-search-bar" style={{ maxWidth: '100%' }}>
              <Search className="official-search-icon" size={18} />
              <input
                type="text"
                className="official-search-input"
                placeholder="Afiş başlığı, öğretmen adı, okul veya etiket ile arayınız..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="#64748b" />
              <select
                className="form-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'views')}
              >
                <option value="newest">En Yeniler İlk</option>
                <option value="views">En Çok İncelenenler</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#475569' }}>
                Toplam {filteredCards.length} Afiş
              </span>
            </div>
          </div>

          <div className="official-pills-row">
            {routeCategoriesList.map((route) => (
              <button
                key={route}
                className={`pill-official ${selectedRoute === route ? 'active' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                {route}
              </button>
            ))}
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '60px', textAlign: 'center', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px', fontWeight: 700 }}>Arama Kriterlerine Uygun Dijital Afiş Bulunamadı</h4>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Farklı bir arama kelimesi veya rota kategorisi seçmeyi deneyiniz.</p>
          </div>
        ) : (
          <div className="cards-grid-official">
            {filteredCards.map((card) => (
              <div key={card.id} className="story-card-official">
                <div className="card-top-dashed"></div>
                <div className="card-img-wrap-official">
                  <img src={card.imageUrl} alt={card.title} />
                  <span className="badge-route-official">{card.routeCategory}</span>
                </div>

                <div className="card-content-official">
                  <h3 className="card-title-official">{card.title}</h3>
                  <div className="card-author-official">
                    <UserCheck size={16} />
                    <span>{card.authorName} - {card.authorSchool}</span>
                  </div>

                  <p className="card-desc-official">{card.description}</p>

                  <div className="card-tags-row" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {card.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={{ backgroundColor: '#f1f5f9', fontSize: '11.5px', padding: '2px 8px', borderRadius: '4px', color: '#475569', fontWeight: 700 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer-official">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} />
                      <span>{card.district}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={13} />
                      <span>{card.viewsCount} İnceleme</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <button
                      className="btn-meb-primary btn-meb-primary-mobile-compact"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => handleCardClick(card)}
                    >
                      <BookOpen size={15} />
                      <span className="btn-text-desktop">1 Sayfalık Kartı İncele</span>
                      <span className="btn-text-mobile">Kartı İncele</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedCardForModal && (
        <div className="modal-overlay" onClick={() => setSelectedCardForModal(null)}>
          <div className="modal-container large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="report-header-badge">{selectedCardForModal.routeCategory}</span>
                <h3 className="modal-title">{selectedCardForModal.title}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedCardForModal(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Poster Showcase */}
              <div className="poster-display-container">
                <img src={selectedCardForModal.imageUrl} alt={selectedCardForModal.title} />
                <button
                  onClick={() => setIsFullScreenPosterOpen(true)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s ease',
                  }}
                  title="Tam Ekran İncele"
                >
                  <Maximize2 size={15} />
                  <span>Büyüt / Tam Ekran Gör</span>
                </button>
              </div>

              {/* Primary Actions Bar */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} color="var(--meb-red)" />
                  <span>Bu afiş <strong>{selectedCardForModal.viewsCount}</strong> kez incelendi</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="btn-meb-outline" onClick={handleCopyLink}>
                    {copiedLink ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />}
                    <span>{copiedLink ? 'Bağlantı Kopyalandı!' : 'Bağlantıyı Paylaş'}</span>
                  </button>
                  <button className="btn-meb-outline" onClick={handlePrintSimulation}>
                    <Printer size={16} />
                    <span>Afişi Yazdır</span>
                  </button>
                  <button className="btn-meb-primary" onClick={handlePrintSimulation}>
                    <Download size={16} />
                    <span>1 Sayfalık Kartı İndir (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Metadata Cards Grid */}
              <div className="meta-grid-modern">
                <div className="meta-card-modern">
                  <div className="meta-icon-wrap">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>HAZIRLAYAN ÖĞRETMEN</div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedCardForModal.authorName}</div>
                  </div>
                </div>

                <div className="meta-card-modern">
                  <div className="meta-icon-wrap">
                    <Building size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>GÖREV YAPTIĞI KURUM</div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedCardForModal.authorSchool}</div>
                  </div>
                </div>

                <div className="meta-card-modern">
                  <div className="meta-icon-wrap">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>KÜLTÜR ROTASI & İLÇE</div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {selectedCardForModal.routeCategory} <span style={{ color: 'var(--meb-red)', fontWeight: 600 }}>({selectedCardForModal.district})</span>
                    </div>
                  </div>
                </div>

                <div className="meta-card-modern">
                  <div className="meta-icon-wrap">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>HEDEF ÖĞRENCİ SEVİYESİ</div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedCardForModal.targetLevel}</div>
                  </div>
                </div>
              </div>

              {/* Cultural Summary */}
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#0f172a', letterSpacing: '0.2px' }}>
                  AFİŞ İÇERİĞİ VE KÜLTÜREL ÖZETİ
                </h4>
                <p className="report-text-block">
                  {selectedCardForModal.description}
                </p>
              </div>

              {/* Tags Chips */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedCardForModal.tags.map((tg, i) => (
                  <span key={i} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                    #{tg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Lightbox Modal */}
      {isFullScreenPosterOpen && selectedCardForModal && (
        <div className="full-preview-overlay" onClick={() => setIsFullScreenPosterOpen(false)}>
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setIsFullScreenPosterOpen(false)}
          >
            <X size={24} />
          </button>
          <img
            src={selectedCardForModal.imageUrl}
            alt={selectedCardForModal.title}
            className="full-preview-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
