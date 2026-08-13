import React, { useState, useMemo } from 'react';
import { DigitalStoryCard, RouteCategory } from '../types';
import { Search, Filter, Eye, Download, Printer, MapPin, UserCheck, BookOpen, X } from 'lucide-react';

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

  return (
    <div>
      <div className="official-hero-wrapper">
        <div className="meb-container">
          <div className="official-hero-boxed">
            <div className="hero-backdrop-seal"></div>
            <div className="hero-content-grid">
              <div>
                <span className="report-header-badge">SÖZLEŞME NO: TR51/25/İKT_TD/0041</span>
                <h2 style={{ fontSize: '30px', fontWeight: 700, marginBottom: '10px', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
                  DİJİTAL KÜLTÜR ROTALARI PLATFORMU
                </h2>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fcd34d', marginBottom: '14px' }}>
                  GEÇMİŞTEN GELECEĞE KÜLTÜRÜYLE ANKARA
                </h3>
                <p style={{ fontSize: '15px', color: '#cbd5e1', maxWidth: '780px', marginBottom: '24px', lineHeight: 1.6 }}>
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

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {card.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={{ backgroundColor: '#f1f5f9', fontSize: '11.5px', padding: '2px 8px', borderRadius: '4px', color: '#475569', fontWeight: 700 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer-official">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      <span>{card.district}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} />
                      <span>{card.viewsCount} İnceleme</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <button
                      className="btn-meb-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => handleCardClick(card)}
                    >
                      <BookOpen size={16} />
                      <span>1 Sayfalık Kartı İncele</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              <div className="poster-preview-box">
                <img src={selectedCardForModal.imageUrl} alt={selectedCardForModal.title} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button className="btn-meb-outline" onClick={handlePrintSimulation}>
                  <Printer size={17} />
                  <span>Afişi Yazdır</span>
                </button>
                <button className="btn-meb-primary" onClick={handlePrintSimulation}>
                  <Download size={17} />
                  <span>1 Sayfalık Kartı İndir (PDF)</span>
                </button>
              </div>

              <div className="poster-meta-grid">
                <div>
                  <div className="meta-item-label">HAZIRLAYAN ÖĞRETMEN</div>
                  <div className="meta-item-val">{selectedCardForModal.authorName}</div>
                </div>
                <div>
                  <div className="meta-item-label">GÖREV YAPTIĞI KURUM</div>
                  <div className="meta-item-val">{selectedCardForModal.authorSchool}</div>
                </div>
                <div>
                  <div className="meta-item-label">KÜLTÜR ROTASI & İLÇE</div>
                  <div className="meta-item-val">{selectedCardForModal.routeCategory} ({selectedCardForModal.district})</div>
                </div>
                <div>
                  <div className="meta-item-label">HEDEF ÖĞRENCI SEVİYESİ</div>
                  <div className="meta-item-val">{selectedCardForModal.targetLevel}</div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
                  AFİŞ İÇERİĞİ VE KÜLTÜREL ÖZETİ
                </h4>
                <p className="report-text-block">
                  {selectedCardForModal.description}
                </p>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedCardForModal.tags.map((tg, i) => (
                  <span key={i} style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#e30613', fontSize: '12px', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                    #{tg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
