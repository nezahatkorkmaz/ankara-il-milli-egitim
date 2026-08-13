import React from 'react';
import { Phone, MapPin, ExternalLink, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="official-meb-footer">
      <div className="footer-projects-strip">
        <div className="meb-container projects-flex">
          <a href="https://ankara.meb.gov.tr/ankbis/" target="_blank" rel="noreferrer" className="project-item-box">
            <span style={{ color: '#e30613', fontWeight: 900 }}>AnkBis</span>
            <span>Ankara Bilişim Sistemleri</span>
          </a>
          <a href="https://www.eba.gov.tr" target="_blank" rel="noreferrer" className="project-item-box">
            <img src="https://www.meb.gov.tr/assets/img/alt_banner/eba.png" alt="EBA - Eğitim Bilişim Ağı" />
          </a>
          <a href="https://www.cimer.gov.tr" target="_blank" rel="noreferrer" className="project-item-box">
            <img src="https://www.meb.gov.tr/assets/img/alt_banner/cimer.png" alt="CİMER" />
          </a>
          <a href="https://www.turkiye.gov.tr" target="_blank" rel="noreferrer" className="project-item-box">
            <img src="https://www.meb.gov.tr/assets/img/alt_banner/turkiyegovtr.png" alt="e-Devlet Kapısı" />
          </a>
          <a href="http://www.meb.gov.tr/duyurular/duyurular2012/basinmus/mebim.php" target="_blank" rel="noreferrer" className="project-item-box" style={{ border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <img src="https://www.meb.gov.tr/assets/img/alt_banner/mebim.png" alt="MEBİM 444 0 632" />
          </a>
        </div>
      </div>

      <div className="footer-main-info">
        <div className="meb-container footer-info-grid">
          <div>
            <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', marginBottom: '12px', fontFamily: 'Titillium Web, sans-serif' }}>
              T.C. ANKARA İL MİLLÎ EĞİTİM MÜDÜRLÜĞÜ
            </h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '13.5px', marginBottom: '8px' }}>
              <MapPin size={18} color="#e30613" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Adres: Gayret Mahallesi Arif Hikmet Caddesi No 4 Yenimahalle / ANKARA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '13.5px', marginBottom: '16px' }}>
              <Phone size={18} color="#e30613" style={{ flexShrink: 0 }} />
              <span>Telefon: 0 312 306 85 00 / 306 86 04 / 306 85 05</span>
            </div>

            <a
              href="https://ankara.meb.gov.tr/www/iletisim.php"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#e30613',
                backgroundColor: '#fef2f2',
                padding: '8px 14px',
                borderRadius: '4px',
                textDecoration: 'none',
                border: '1px solid #fecaca'
              }}
            >
              <span>Diğer İletişim Seçenekleri İçin Tıklayın</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', marginBottom: '6px' }}>
              SÖZLEŞME TAKİP BİRİMİ
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
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
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#e30613', fontFamily: 'Titillium Web, sans-serif' }}>MEBİM İLETİŞİM MERKEZİ</div>
              <div style={{ fontSize: '12.5px', color: '#475569', fontWeight: 600 }}>7/24 Bakanlık Danışma Hattı</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-copyright">
        <div className="meb-container copyright-flex">
          <span>2026 © Türkiye Cumhuriyeti Millî Eğitim Bakanlığı. Tüm Hakları Saklıdır.</span>
          <span>Dijital Kültür Rotaları Eğitimi ve Bilgi Kartları Paylaşım Platformu</span>
        </div>
      </div>

      <button className="floating-action-btn" onClick={scrollToTop} title="Yukarı Çık">
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};
