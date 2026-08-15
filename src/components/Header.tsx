import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, LogOut, Search, User as UserIcon, Layers, Menu, X, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: 'gallery' | 'report';
  setActiveTab: (tab: 'gallery' | 'report') => void;
  onOpenLoginModal: () => void;
  onOpenUploadModal: () => void;
  onOpenProfileModal: () => void;
  onLogout: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLoginModal,
  onOpenUploadModal,
  onOpenProfileModal,
  onLogout,
  searchQuery = '',
  setSearchQuery,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'gallery' | 'report') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header>
      {/* 1. Üst Kırmızı Bant */}
      <div className="top-red-bar">
        <div className="meb-container">
          <div className="top-red-flex">
            <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer" className="top-red-title">
              ANKARA İL MİLLÎ EĞİTİM MÜDÜRLÜĞÜ
            </a>
            <div className="top-red-watermark-pattern"></div>
          </div>
        </div>
      </div>

      {/* 2. Sosyal Medya ve Alt Linkler Bandı (Orijinal MEB düzeni) */}
      <div className="top-sub-links-bar">
        <div className="meb-container">
          <div className="top-sub-links-flex">
            <div className="top-links-left">
              <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer">Anasayfa</a>
              <span className="slash-sep">/</span>
              <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer">RSS</a>
            </div>

            <div className="social-icons-row-dark">
              <a href="https://facebook.com/tcmeb" target="_blank" rel="noreferrer" className="social-dark-btn" title="Facebook"><Facebook size={14} /></a>
              <a href="https://x.com/tcmeb" target="_blank" rel="noreferrer" className="social-dark-btn" title="X (Twitter)"><Twitter size={14} /></a>
              <a href="https://instagram.com/tcmeb" target="_blank" rel="noreferrer" className="social-dark-btn" title="Instagram"><Instagram size={14} /></a>
              <a href="https://youtube.com/tcmeb" target="_blank" rel="noreferrer" className="social-dark-btn" title="YouTube"><Youtube size={14} /></a>
              <a href="https://meb.gov.tr" target="_blank" rel="noreferrer" className="social-dark-btn meb-n-icon" title="MEB Portalı">N</a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ana Resmî Header (Logo + 100. Yıl + Hamburger Menü Butonu) */}
      <div className="meb-header-official">
        <div className="meb-container">
          <div className="official-header-flex">
            <a href="https://ankara.meb.gov.tr" className="official-logo-box">
              <img
                src="https://www.meb.gov.tr/assets/img/Logo.png"
                alt="T.C. Millî Eğitim Bakanlığı Logo"
                className="real-meb-logo-img"
              />
            </a>

            <div className="official-header-right-group">
              <div className="official-quick-apps">
                <img
                  src="https://www.meb.gov.tr/assets/img/turkiye.svg"
                  alt="Türkiye Yüzyılı 100. Yıl Logosu"
                  className="turkiye-yuzyili-real-img"
                />
              </div>

              {/* Orijinal MEB Cihaz Hamburger Menü Butonu */}
              <button
                className="official-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Navigasyon Menüsünü Aç/Kapat"
                title="Ana Menü"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Ekran Ekmek Kırıntısı (Red Breadcrumb Badge) & Mobil Arama Çubuğu */}
      <div className="sub-header-breadcrumb-bar">
        <div className="meb-container">
          <div className="breadcrumb-search-flex">
            <div className="meb-red-breadcrumb-pill">
              Anasayfa &gt; {activeTab === 'gallery' ? 'Dijital Afiş Galerisi' : 'Proje Raporu'}
            </div>

            <div className="official-search-bar">
              <Search className="official-search-icon" size={15} />
              <input
                type="text"
                className="official-search-input"
                placeholder="Afiş veya Rota Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Navigasyon Çubuğu (Masaüstünde yatay bar, mobilde hamburger ile açılan menü) */}
      <nav className="official-nav-bar">
        <div className="meb-container">
          <div className={`official-nav-flex ${isMobileMenuOpen ? 'open' : ''}`}>
            <ul className="official-nav-ul">
              <li className="official-nav-li">
                <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer" className="official-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>Anasayfa</span>
                </a>
              </li>
              <span className="nav-slash">/</span>
              <li className="official-nav-li">
                <button
                  className={`official-nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => handleTabClick('gallery')}
                >
                  <span>Dijital Afiş Galerisi</span>
                </button>
              </li>
              <span className="nav-slash">/</span>
              <li className="official-nav-li">
                <button
                  className={`official-nav-link ${activeTab === 'report' ? 'active' : ''}`}
                  onClick={() => handleTabClick('report')}
                >
                  <span>Proje Raporu & Sözleşme Detayları</span>
                </button>
              </li>
              <span className="nav-slash">/</span>
              <li className="official-nav-li">
                <a href="https://ankara.meb.gov.tr/ankbis/" target="_blank" rel="noreferrer" className="official-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>ANKBİS - Bilişim Sistemleri</span>
                </a>
              </li>
              <span className="nav-slash">/</span>
              <li className="official-nav-li">
                <a href="https://ankara.meb.gov.tr/www/iletisim.php" target="_blank" rel="noreferrer" className="official-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>İletişim</span>
                </a>
              </li>
            </ul>

            <div className="header-user-actions">
              {currentUser ? (
                <>
                  <div className="user-badge-header">
                    <UserIcon size={14} color="var(--meb-red)" />
                    <span>{currentUser.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenProfileModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-meb-profile"
                    title="Öğretmen Profilim ve Yüklediğim Afişleri Gör"
                  >
                    <Layers size={14} />
                    <span>Profilim & Afişlerim</span>
                  </button>

                  <button className="btn-meb-outline" onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} title="Çıkış Yap" style={{ padding: '5px 10px', fontSize: '12.5px' }}>
                    <LogOut size={14} />
                    <span>Çıkış</span>
                  </button>
                </>
              ) : (
                <button className="btn-meb-primary" onClick={() => { onOpenLoginModal(); setIsMobileMenuOpen(false); }}>
                  <LogIn size={14} />
                  <span>Öğretmen Girişi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
