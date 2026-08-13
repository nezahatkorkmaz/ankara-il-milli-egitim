import React from 'react';
import { initialProjectContractInfo } from '../data/initialData';
import { FileText, CheckCircle2, Users, Calendar, Award, Building, BookOpen, ChevronRight } from 'lucide-react';

export const ProjectReportView: React.FC = () => {
  const info = initialProjectContractInfo;

  return (
    <div className="meb-container" style={{ paddingTop: '30px' }}>
      <div className="report-section-card">
        <span className="report-header-badge">T.C. ANKARA İL MİLLİ EĞİTİM MÜDÜRLÜĞÜ PROJE RAPORU</span>
        <h2 className="report-title">{info.activityName}</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
          Teknik Destek Programı Kapsamında Gerçekleştirilen Dijital Kültür Rotaları Eğitimi ve Uygulama Platformu Resmi Sözleşme Raporu
        </p>

        <div className="contract-info-grid">
          <div className="contract-info-item">
            <div className="contract-lbl">SÖZLEŞME NUMARASI</div>
            <div className="contract-val">{info.contractNo}</div>
          </div>

          <div className="contract-info-item">
            <div className="contract-lbl">EĞİTİM / FAALİYET YERİ</div>
            <div className="contract-val">{info.activityLocation}</div>
          </div>

          <div className="contract-info-item">
            <div className="contract-lbl">YARARLANICI KURUM</div>
            <div className="contract-val">{info.beneficiaryOrg}</div>
          </div>

          <div className="contract-info-item">
            <div className="contract-lbl">KATILIMCI SAYISI / HEDEF</div>
            <div className="contract-val" style={{ color: '#c8102e' }}>{info.participantCount} Katılımcı</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#f4f6f9', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
          <div className="contract-lbl">EĞİTİM FAALİYETİ TARİHLERİ</div>
          <div className="contract-val" style={{ fontSize: '13px', fontWeight: 600 }}>{info.dates}</div>
        </div>

        <div>
          <div className="contract-lbl" style={{ marginBottom: '8px' }}>EĞİTMEN KADROSU VE DANIŞMANLAR</div>
          <div className="trainers-chips">
            {info.trainers.map((trainer, idx) => (
              <div key={idx} className="trainer-chip">
                <Award size={14} color="#c8102e" style={{ display: 'inline', marginRight: '6px' }} />
                {trainer}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="report-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Building size={22} color="#c8102e" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
            1. YARARLANICI KURUM / KURULUŞ HAKKINDA GÖRÜŞLER
          </h3>
        </div>
        <p className="report-text-block">
          {info.beneficiaryFeedback}
        </p>
      </div>

      <div className="report-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Users size={22} color="#c8102e" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
            2. KATILIMCILAR HAKKINDA GÖRÜŞLER
          </h3>
        </div>
        <p className="report-text-block">
          {info.participantFeedback}
        </p>
      </div>

      <div className="report-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <BookOpen size={22} color="#c8102e" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
            3. EĞİTİMLERİN / DANIŞMANLIK FAALİYETLERİNİN ETKİLERİ HAKKINDA GÖRÜŞLER
          </h3>
        </div>
        <p className="report-text-block">
          {info.impactFeedback}
        </p>
      </div>

      <div className="report-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <CheckCircle2 size={22} color="#c8102e" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
            4. GELECEKTEKİ TEKNİK DESTEK UYGULAMALARI İÇİN GÖRÜŞ VE ÖNERİLER
          </h3>
        </div>
        <p className="report-text-block">
          {info.futureRecommendations}
        </p>
      </div>

      <div className="report-section-card" style={{ backgroundColor: '#fff0f2', borderColor: '#f5c2c7' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#a00c24', marginBottom: '8px' }}>
          SÖZLEŞME MUTABAKAT BEYANI
        </h4>
        <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.6' }}>
          Eğitim/danışmanlık hizmetleri sözleşmede belirtilen esaslara uygun gerçekleştirilmiştir. Projenin tamamlanması hususunda Yararlanıcı ve Yüklenici tüm sorumluluklarını yerine getirmiştir.
        </p>
      </div>
    </div>
  );
};
