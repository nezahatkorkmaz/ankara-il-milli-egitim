import React from 'react';
import { Phone, MapPin, ExternalLink, ArrowUp, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="official-meb-footer">
      <div className="footer-projects-strip">
        <div className="meb-container">
          <h3 className="footer-section-heading">Bağlantılar</h3>
          
          <div className="projects-flex">
            <a href="https://ankara.meb.gov.tr/ankbis/" target="_blank" rel="noreferrer" className="official-link-card">
              <div className="link-card-top">
                <span className="link-card-title" style={{ color: '#e30613' }}>AnkBis</span>
                <span className="link-card-dots">...</span>
              </div>
              <span className="link-card-subtitle">Ankara Bilişim Sistemleri</span>
              <ArrowRight size={14} className="link-card-arrow" />
            </a>

            <a href="https://okulsagligi.meb.gov.tr" target="_blank" rel="noreferrer" className="official-link-card">
              <div className="link-card-top">
                <span className="link-card-title">Okul Sağlığı</span>
                <span className="link-card-dots">...</span>
              </div>
              <span className="link-card-subtitle">Okul Sağlığı Portalı</span>
              <ArrowRight size={14} className="link-card-arrow" />
            </a>

            <a href="https://fatihprojesi.meb.gov.tr" target="_blank" rel="noreferrer" className="official-link-card">
              <div className="link-card-top">
                <span className="link-card-title">f@tih Projesi</span>
                <span className="link-card-dots">...</span>
              </div>
              <span className="link-card-subtitle">Eğitimde Fırsatları Artırma</span>
              <ArrowRight size={14} className="link-card-arrow" />
            </a>

            <a href="https://isg.meb.gov.tr" target="_blank" rel="noreferrer" className="official-link-card">
              <div className="link-card-top">
                <span className="link-card-title">İş Sağlığı ve Güvenliği</span>
                <span className="link-card-dots">...</span>
              </div>
              <span className="link-card-subtitle">MEB İSG Birimi</span>
              <ArrowRight size={14} className="link-card-arrow" />
            </a>

            <a href="http://www.meb.gov.tr/duyurular/duyurular2012/basinmus/mebim.php" target="_blank" rel="noreferrer" className="official-link-card" style={{ borderColor: '#fecaca', backgroundColor: '#fff5f5' }}>
              <div className="link-card-top">
                <span className="link-card-title" style={{ color: '#e30613' }}>MEBİM 444 0 632</span>
                <span className="link-card-dots">...</span>
              </div>
              <span className="link-card-subtitle">Danışma Hattı</span>
              <ArrowRight size={14} className="link-card-arrow" style={{ color: '#e30613' }} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-main-info">
        <div className="meb-container footer-info-grid">
          <div>
            <h4 className="footer-title-official">
              ANKARA İL MİLLÎ EĞİTİM MÜDÜRLÜĞÜ
            </h4>
            <div className="footer-info-line">
              <MapPin size={18} color="#e30613" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Adres:</strong> Gayret Mahallesi Arif Hikmet Caddesi No 4 Yenimahalle / ANKARA</span>
            </div>
            <div className="footer-info-line" style={{ marginBottom: '16px' }}>
              <Phone size={18} color="#e30613" style={{ flexShrink: 0 }} />
              <span><strong>Telefon:</strong> 0 312 306 86 00 / 306 86 04 / 306 86 05</span>
            </div>

            <a
              href="https://ankara.meb.gov.tr/www/iletisim.php"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#e30613',
                backgroundColor: '#ffffff',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                border: '1px solid #d1d5db'
              }}
            >
              <span>Diğer İletişim Seçenekleri İçin Tıklayın</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
              SÖZLEŞME TAKİP BİRİMİ
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#111111' }}>
              Strateji Geliştirme Hizmetleri
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
              Sözleşme No: TR51/25/İKT_TD/0041
            </div>
          </div>

          <div className="mebim-real-banner">
            <img
              src="https://www.meb.gov.tr/assets/img/mebimlogo.png"
              alt="MEBİM 444 0 632 Logo"
              className="mebim-real-img"
            />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#e30613', fontFamily: 'var(--font-family)' }}>MEBİM İLETİŞİM MERKEZİ</div>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>7/24 Bakanlık Danışma Hattı</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-copyright">
        <div className="meb-container copyright-flex">
          <span>2026 © Türkiye Cumhuriyeti Millî Eğitim Bakanlığı Tüm Hakları Saklıdır.</span>
          <span>Dijital Kültür Rotaları Eğitimi ve Bilgi Kartları Paylaşım Portalı</span>
        </div>
      </div>

      <button className="floating-action-btn" onClick={scrollToTop} title="Yukarı Çık">
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};
