import React from 'react';
import { User } from '../types';
import { LogIn, LogOut, PlusCircle, LayoutGrid, FileText, Search, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: 'gallery' | 'report';
  setActiveTab: (tab: 'gallery' | 'report') => void;
  onOpenLoginModal: () => void;
  onOpenUploadModal: () => void;
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
  onLogout,
  searchQuery = '',
  setSearchQuery,
}) => {
  return (
    <header>
      <div className="top-bar-meb">
        <div className="meb-container top-bar-grid">
          <div className="top-links-flex">
            <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer">Anasayfa</a>
            <span className="slash-sep">/</span>
            <a href="https://meb.gov.tr" target="_blank" rel="noreferrer">e-Posta</a>
            <span className="slash-sep">/</span>
            <a href="https://meb.gov.tr" target="_blank" rel="noreferrer">S.S.S</a>
            <span className="slash-sep">/</span>
            <a href="https://meb.gov.tr" target="_blank" rel="noreferrer">English</a>
            <span className="slash-sep">/</span>
            <a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer">RSS</a>
          </div>

          <div className="top-right-meb">
            <div className="social-icons-row">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn">f</a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="social-icon-btn">X</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn">in</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn">YT</a>
            </div>

            <div className="ataturk-flag-banner">
              <span>T.C. ANKARA İL MİLLİ EĞİTİM MÜDÜRLÜĞÜ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="meb-header-official">
        <div className="meb-container official-header-flex">
          <div className="official-logo-box">
            <div className="official-meb-crest">
              <span className="crest-text">MEB</span>
            </div>
            <div className="official-title-group">
              <span className="official-meb-sub">T.C. MİLLÎ EĞİTİM BAKANLIĞI</span>
              <h1 className="official-meb-main">ANKARA İL MİLLÎ EĞİTİM MÜDÜRLÜĞÜ</h1>
            </div>
          </div>

          <div className="official-search-bar">
            <Search className="official-search-icon" size={18} />
            <input
              type="text"
              className="official-search-input"
              placeholder="MEB Portalı veya Afiş/Bilgi Kartlarında Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>

          <div className="official-quick-apps">
            <button className="app-circle-btn" title="EBA - Eğitim Bilişim Ağı">eba</button>
            <button className="app-circle-btn" title="ÖBA - Öğretmen Bilişim Ağı">öba</button>
            <button className="app-circle-btn" title="MEBBİS">meb</button>
            <button className="app-circle-btn" title="EBYS">ebys</button>

            <div className="turkiye-yuzyili-badge">
              <div className="yuzyil-box">
                <span className="yuzyil-title">TÜRKİYE YÜZYILI</span>
                <span className="yuzyil-sub">100. YIL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="official-nav-bar">
        <div className="meb-container official-nav-flex">
          <ul className="official-nav-ul">
            <li className="official-nav-li">
              <button
                className={`official-nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                <LayoutGrid size={17} />
                <span>Dijital Afiş Galerisi</span>
              </button>
            </li>
            <span className="nav-slash">/</span>
            <li className="official-nav-li">
              <button
                className={`official-nav-link ${activeTab === 'report' ? 'active' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                <FileText size={17} />
                <span>Proje Raporu & Sözleşme Detayları</span>
              </button>
            </li>
            <span className="nav-slash">/</span>
            <li className="official-nav-li">
              <a href="https://ankara.meb.gov.tr/ankbis/" target="_blank" rel="noreferrer" className="official-nav-link">
                <span>ANKBİS Sistemleri</span>
              </a>
            </li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentUser ? (
              <>
                <div className="user-badge-header">
                  <UserIcon size={15} />
                  <span>{currentUser.name} ({currentUser.role === 'admin' ? 'Yönetici' : 'Öğretmen'})</span>
                </div>
                <button className="btn-meb-primary" onClick={onOpenUploadModal}>
                  <PlusCircle size={17} />
                  <span>Afiş Yükle</span>
                </button>
                <button className="btn-meb-outline" onClick={onLogout} title="Çıkış">
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <button className="btn-meb-primary" onClick={onOpenLoginModal}>
                <LogIn size={17} />
                <span>Öğretmen Girişi</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
