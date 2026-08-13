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
          <div className="project-item-box">
            <span style={{ color: '#e30613' }}>AnkBis</span>
            <span>Ankara Bilişim Sistemleri</span>
          </div>
          <div className="project-item-box">
            <span style={{ color: '#10b981' }}>Okul Sağlığı</span>
            <span>Sağlık Hizmetleri</span>
          </div>
          <div className="project-item-box">
            <span style={{ color: '#2563eb' }}>f@tih</span>
            <span>Eğitimde Fatih Projesi</span>
          </div>
          <div className="project-item-box" style={{ border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <span style={{ color: '#e30613', fontWeight: 900 }}>444 0 632</span>
            <span>MEBİM İletişim Merkezi</span>
          </div>
        </div>
      </div>

      <div className="footer-main-info">
        <div className="meb-container footer-info-grid">
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              T.C. ANKARA İL MİLLÎ EĞİTİM MÜDÜRLÜĞÜ
            </h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '13px', marginBottom: '8px' }}>
              <MapPin size={18} color="#e30613" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Adres: Gayret Mahallesi Arif Hikmet Caddesi No 4 Yenimahalle / ANKARA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '13px', marginBottom: '16px' }}>
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
                fontSize: '12px',
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
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
              SÖZLEŞME TAKİP BİRİMİ
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
              Strateji Geliştirme Hizmetleri
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Sözleşme No: TR51/25/İKT_TD/0041
            </div>
          </div>

          <div className="mebim-badge-box">
            <div className="mebim-circle">
              444 0 632
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#e30613' }}>MEBİM İLETİŞİM MERKEZİ</div>
              <div style={{ fontSize: '12px', color: '#475569' }}>7/24 Bakanlık Danışma Hattı</div>
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
