import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="meb-footer">
      <div className="meb-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Ankara İl Millî Eğitim Müdürlüğü</h4>
            <p>
              T.C. Millî Eğitim Bakanlığı Ankara İl Millî Eğitim Müdürlüğü Strateji Geliştirme Hizmetleri Şubesi tarafından yürütülen Dijital Kültür Rotaları Eğitimi ve Bilgi Kartları Paylaşım Portalı.
            </p>
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
              Sözleşme No: TR51/25/İKT_TD/0041 | Eğitim Merkezi: İMKB Alpaslan İ.H. Ortaokulu
            </p>
          </div>

          <div className="footer-col">
            <h4>Hızlı Bağlantılar</h4>
            <ul className="footer-links">
              <li><a href="https://ankara.meb.gov.tr" target="_blank" rel="noreferrer">Ankara İl MEM Resmi Web Sitesi</a></li>
              <li><a href="https://meb.gov.tr" target="_blank" rel="noreferrer">T.C. Millî Eğitim Bakanlığı</a></li>
              <li><a href="https://eba.gov.tr" target="_blank" rel="noreferrer">Eğitim Bilişim Ağı (EBA)</a></li>
              <li><a href="#proje-detaylari">Proje Sözleşme Şartnamesi</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>İletişim & Adres</h4>
            <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
              Gayret Mahallesi Arif Hikmet Caddesi No 4 Yenimahalle / ANKARA<br />
              Telefon: 0312 306 85 00<br />
              E-posta: ankara.proje@meb.gov.tr
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>2026 T.C. Millî Eğitim Bakanlığı - Ankara İl Millî Eğitim Müdürlüğü. Tüm Hakları Saklıdır.</span>
          <span>Dijital Hikaye Okuryazarlığı Eğitimi Uygulama Portalı</span>
        </div>
      </div>
    </footer>
  );
};
