import React, { useState, useMemo } from 'react';
import { DigitalStoryCard, RouteCategory } from '../types';
import { Search, Filter, Eye, Download, Printer, Share2, MapPin, UserCheck, Calendar, BookOpen, X, CheckCircle2 } from 'lucide-react';

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
      <section className="hero-banner">
        <div className="meb-container hero-grid">
          <div>
            <span className="report-header-badge">Sözleşme No: TR51/25/İKT_TD/0041</span>
            <h2 className="hero-title">
              Ankara Dijital Kültür Rotaları Afiş & Bilgi Kartları Portalı
            </h2>
            <p className="hero-subtitle">
              Dijital Kültür Rotaları eğitimi alan 230+ öğretmenimizin hazırladığı 1 sayfalık dijital bilgi afişlerini inceleyebilir, filtreleyebilir ve derslerinizde materyal olarak kullanabilirsiniz.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                className="btn-meb-primary"
                onClick={onOpenUpload}
              >
                {isLoggedIn ? 'Yeni Afiş Yükle' : 'Öğretmen Girişi İle Afiş Yükle'}
              </button>
            </div>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <div className="stat-num">230 / 300</div>
              <div className="stat-lbl">Sertifikalı Katılımcı</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num">{cards.length}</div>
              <div className="stat-lbl">Dijital Afiş</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num">6 Rota</div>
              <div className="stat-lbl">Kültürel Rota</div>
            </div>
          </div>
        </div>
      </section>

      <div className="meb-container">
        <div className="filter-section">
          <div className="filter-controls-row">
            <div className="search-input-wrap">
              <Search className="search-icon-pos" size={20} />
              <input
                type="text"
                placeholder="Afiş başlığı, öğretmen adı, okul veya etiket ile arayınız..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="#6b7280" />
              <select
                className="select-custom"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'views')}
                style={{ width: '100%' }}
              >
                <option value="newest">En Yeniler İlk</option>
                <option value="views">En Çok İncelelenler</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
                Toplam {filteredCards.length} Afiş Bulundu
              </span>
            </div>
          </div>

          <div className="routes-pills-flex">
            {routeCategoriesList.map((route) => (
              <button
                key={route}
                className={`pill-btn ${selectedRoute === route ? 'active' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                {route}
              </button>
            ))}
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '60px', textAlign: 'center', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>Arama Kriterlerine Uygun Dijital Afiş Bulunamadı</h4>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Farklı bir arama kelimesi veya rota kategorisi seçmeyi deneyiniz.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredCards.map((card) => (
              <div key={card.id} className="story-card">
                <div className="card-img-wrap">
                  <img src={card.imageUrl} alt={card.title} />
                  <span className="route-badge">{card.routeCategory}</span>
                </div>

                <div className="card-body">
                  <h3 className="card-title">{card.title}</h3>
                  <div className="card-author-info">
                    <UserCheck size={16} />
                    <span>{card.authorName} - {card.authorSchool}</span>
                  </div>

                  <p className="card-desc">{card.description}</p>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {card.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={{ backgroundColor: '#f3f4f6', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', color: '#4b5563', fontWeight: 500 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      <span>{card.district}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} />
                      <span>{card.viewsCount} Görüntülenme</span>
                    </div>
                  </div>

                  <div className="card-action-bar">
                    <button 
                      className="btn-meb-primary"
                      onClick={() => handleCardClick(card)}
                    >
                      <BookOpen size={16} />
                      <span>Afişi İncele</span>
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
                  <Printer size={18} />
                  <span>Afişi Yazdır</span>
                </button>
                <button className="btn-meb-primary" onClick={handlePrintSimulation}>
                  <Download size={18} />
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
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#1f2937' }}>
                  AFİŞ İÇERİĞİ VE EĞİTSEL ÖZETİ
                </h4>
                <p className="report-text-block">
                  {selectedCardForModal.description}
                </p>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedCardForModal.tags.map((tg, i) => (
                  <span key={i} style={{ backgroundColor: '#fff0f2', border: '1px solid #f5c2c7', color: '#c8102e', fontSize: '12px', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
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
