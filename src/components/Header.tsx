import React from 'react';
import { User } from '../types';
import { LogIn, LogOut, Search, User as UserIcon, Layers } from 'lucide-react';

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
  return (
    <header>
      <div className="top-red-bar">
        <div className="meb-container">
          <div className="top-red-flex">
            <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer" className="top-red-title">
              ANKARA İL MİLLÎ EĞİTİM MÜDÜRLÜĞÜ
            </a>

            <div className="top-red-right">
              <div className="social-icons-row">
                <a href="https://facebook.com/tcmeb" target="_blank" rel="noreferrer" className="social-icon-btn">f</a>
                <a href="https://x.com/tcmeb" target="_blank" rel="noreferrer" className="social-icon-btn">X</a>
                <a href="https://instagram.com/tcmeb" target="_blank" rel="noreferrer" className="social-icon-btn">in</a>
                <a href="https://youtube.com/tcmeb" target="_blank" rel="noreferrer" className="social-icon-btn">YT</a>
                <span style={{ opacity: 0.5, fontSize: '11px' }}>|</span>
                <a href="https://meb.gov.tr" target="_blank" rel="noreferrer" className="social-icon-btn">N</a>
              </div>

              <a href="https://meb.gov.tr/ataturk" target="_blank" rel="noreferrer">
                <img
                  src="https://www.meb.gov.tr/assets/img/ataturk.png"
                  alt="T.C. Atatürk ve Türk Bayrağı"
                  className="ataturk-real-img"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="top-sub-links-bar">
        <div className="meb-container">
          <div className="top-links-flex">
            <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer">Anasayfa</a>
            <span className="slash-sep">/</span>
            <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer">RSS</a>
          </div>
        </div>
      </div>

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

            <div className="official-search-bar">
              <Search className="official-search-icon" size={15} />
              <input
                type="text"
                className="official-search-input"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              />
            </div>

            <div className="official-quick-apps">
              <img
                src="https://www.meb.gov.tr/assets/img/turkiye.svg"
                alt="Türkiye Yüzyılı 100. Yıl Logosu"
                className="turkiye-yuzyili-real-img"
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="official-nav-bar">
        <div className="meb-container">
          <div className="official-nav-flex">
            <ul className="official-nav-ul">
              <li className="official-nav-li">
                <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer" className="official-nav-link">
                  <span>Anasayfa</span>
                </a>
              </li>
              <span className="nav-slash">/</span>
              <li className="official-nav-li">
                <button
                  className={`official-nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  <span>Dijital Afiş Galerisi</span>
                </button>
              </li>
              <span className="nav-slash">/</span>
              <li className="official-nav-li">
                <button
                  className={`official-nav-link ${activeTab === 'report' ? 'active' : ''}`}
                  onClick={() => setActiveTab('report')}
                >
                  <span>Proje Raporu & Sözleşme Detayları</span>
                </button>
              </li>
              <span className="nav-slash">/</span>
              <li className="official-nav-li">
                <a href="https://ankara.meb.gov.tr/ankbis/" target="_blank" rel="noreferrer" className="official-nav-link">
                  <span>ANKBİS - Bilişim Sistemleri</span>
                </a>
              </li>
              <span className="nav-slash">/</span>
              <li className="official-nav-li">
                <a href="https://ankara.meb.gov.tr/www/iletisim.php" target="_blank" rel="noreferrer" className="official-nav-link">
                  <span>İletişim</span>
                </a>
              </li>
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentUser ? (
                <>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif"
                    }}
                  >
                    <UserIcon size={14} color="var(--meb-red)" />
                    <span>{currentUser.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenProfileModal}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '12.5px', 
                      fontWeight: 700, 
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif",
                      border: '1px solid var(--meb-red)',
                      color: 'var(--meb-red)',
                      backgroundColor: 'var(--meb-red-light)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title="Öğretmen Profilim ve Yüklediğim Afişleri Gör"
                  >
                    <Layers size={14} />
                    <span>Profilim & Afişlerim</span>
                  </button>

                  <button className="btn-meb-outline" onClick={onLogout} title="Çıkış Yap" style={{ padding: '5px 10px', fontSize: '12.5px' }}>
                    <LogOut size={14} />
                    <span>Çıkış</span>
                  </button>
                </>
              ) : (
                <button className="btn-meb-primary" onClick={onOpenLoginModal}>
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
