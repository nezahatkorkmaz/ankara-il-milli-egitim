import React from 'react';
import { User } from '../types';
import { LogIn, LogOut, PlusCircle, LayoutGrid, FileText, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: 'gallery' | 'report';
  setActiveTab: (tab: 'gallery' | 'report') => void;
  onOpenLoginModal: () => void;
  onOpenUploadModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLoginModal,
  onOpenUploadModal,
  onLogout,
}) => {
  return (
    <header>
      <div className="top-bar">
        <div className="meb-container top-bar-flex">
          <div className="top-nav-links">
            <a href="#anasayfa">T.C. Millî Eğitim Bakanlığı</a>
            <span>|</span>
            <a href="#ankara-mem">Ankara İl Millî Eğitim Müdürlüğü</a>
            <span>|</span>
            <a href="#eba">EBA</a>
            <span>|</span>
            <a href="#iletisim">İletişim</a>
          </div>
          <div className="flag-badge">
            <span>T.C. ANKARA İL MİLLİ EĞİTİM MÜDÜRLÜĞÜ</span>
          </div>
        </div>
      </div>

      <div className="meb-header-main">
        <div className="meb-container header-brand-flex">
          <div className="brand-logo-area">
            <div className="meb-emblem">
              MEB
            </div>
            <div className="brand-titles">
              <span className="brand-sub">T.C. MİLLİ EĞİTİM BAKANLIĞI</span>
              <h1 className="brand-main">ANKARA İL MİLLİ EĞİTİM MÜDÜRLÜĞÜ</h1>
              <span className="brand-project-tag">
                Dijital Kültür Rotaları - Geçmişten Geleceğe Kültürüyle Ankara
              </span>
            </div>
          </div>

          <div className="header-user-actions">
            {currentUser ? (
              <>
                <div className="user-badge-header">
                  <UserIcon size={16} />
                  <span>{currentUser.name} ({currentUser.role === 'admin' ? 'Yönetici' : 'Öğretmen'})</span>
                </div>
                <button 
                  className="btn-meb-primary"
                  onClick={onOpenUploadModal}
                >
                  <PlusCircle size={18} />
                  <span>Dijital Afiş Yükle</span>
                </button>
                <button 
                  className="btn-meb-outline"
                  onClick={onLogout}
                  title="Oturumu Kapat"
                >
                  <LogOut size={16} />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <button 
                className="btn-meb-primary"
                onClick={onOpenLoginModal}
              >
                <LogIn size={18} />
                <span>Öğretmen Girişi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <nav className="meb-nav-bar">
        <div className="meb-container">
          <ul className="nav-links-list">
            <li>
              <button 
                className={`nav-item-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                <LayoutGrid size={18} />
                <span>Dijital Afiş Galerisi & Bilgi Kartları</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-item-btn ${activeTab === 'report' ? 'active' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                <FileText size={18} />
                <span>Proje Raporu & Sözleşme Detayları</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
