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
              <a href="https://facebook.com/tcmeb" target="_blank" rel="noreferrer" className="social-icon-btn">f</a>
              <a href="https://x.com/tcmeb" target="_blank" rel="noreferrer" className="social-icon-btn">X</a>
              <a href="https://instagram.com/tcmeb" target="_blank" rel="noreferrer" className="social-icon-btn">in</a>
              <a href="https://youtube.com/tcmeb" target="_blank" rel="noreferrer" className="social-icon-btn">YT</a>
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

      <div className="meb-header-official">
        <div className="meb-container official-header-flex">
          <a href="https://ankara.meb.gov.tr" className="official-logo-box">
            <img
              src="https://www.meb.gov.tr/assets/img/Logo.png"
              alt="T.C. Millî Eğitim Bakanlığı Logo"
              className="real-meb-logo-img"
            />
            <div className="official-title-group">
              <span className="official-meb-sub">T.C. MİLLÎ EĞİTİM BAKANLIĞI</span>
              <h1 className="official-meb-main">ANKARA İL MİLLÎ EĞİTİM MÜDÜRLÜĞÜ</h1>
            </div>
          </a>

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
            <a href="https://e-okul.meb.gov.tr" target="_blank" rel="noreferrer" className="real-app-icon-link" title="e-Okul">
              <img src="https://www.meb.gov.tr/assets/img/search/eokul.png" alt="e-Okul" />
            </a>
            <a href="https://mebbis.meb.gov.tr" target="_blank" rel="noreferrer" className="real-app-icon-link" title="MEBBİS">
              <img src="https://www.meb.gov.tr/assets/img/search/mebbis.png" alt="MEBBİS" />
            </a>
            <a href="https://www.eba.gov.tr" target="_blank" rel="noreferrer" className="real-app-icon-link" title="EBA - Eğitim Bilişim Ağı">
              <img src="https://www.meb.gov.tr/assets/img/search/eba.png" alt="EBA" />
            </a>
            <a href="https://www.oba.gov.tr" target="_blank" rel="noreferrer" className="real-app-icon-link" title="ÖBA - Öğretmen Bilişim Ağı">
              <img src="https://www.meb.gov.tr/assets/img/search/oba.png" alt="ÖBA" />
            </a>
            <a href="https://ebys.meb.gov.tr" target="_blank" rel="noreferrer" className="real-app-icon-link" title="EBYS">
              <img src="https://www.meb.gov.tr/assets/img/search/ebys.png" alt="EBYS" />
            </a>

            <img
              src="https://www.meb.gov.tr/assets/img/turkiye.svg"
              alt="Türkiye Yüzyılı 100. Yıl Logosu"
              className="turkiye-yuzyili-real-img"
            />
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
                <LayoutGrid size={18} />
                <span>Dijital Afiş Galerisi</span>
              </button>
            </li>
            <span className="nav-slash">/</span>
            <li className="official-nav-li">
              <button
                className={`official-nav-link ${activeTab === 'report' ? 'active' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                <FileText size={18} />
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
