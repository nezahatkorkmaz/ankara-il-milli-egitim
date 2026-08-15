import React, { useState } from 'react';
import { User, DigitalStoryCard } from '../types';
import { 
  X, 
  User as UserIcon, 
  School, 
  GraduationCap, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Upload, 
  Eye, 
  MapPin, 
  Tag, 
  Layers, 
  Maximize2
} from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  teacherStories: DigitalStoryCard[];
  onOpenUploadModal: () => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  teacherStories,
  onOpenUploadModal,
}) => {
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const myUploads = teacherStories.filter(
    (story) =>
      story.authorId === currentUser.id ||
      story.authorName.toLowerCase() === currentUser.name.toLowerCase()
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '820px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '14px', overflow: 'hidden' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--meb-red-light)', border: '1.5px solid var(--meb-red-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--meb-red)' }}>
              <UserIcon size={24} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Öğretmen Profil Portföyü</h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Ankara İl Millî Eğitim Müdürlüğü • Dijital Kültür Rotaları</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
          
          {/* Teacher Info Profile Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {currentUser.name}
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={12} /> Sertifikalı Öğretmen
                  </span>
                </h4>
                <div style={{ fontSize: '14px', color: 'var(--meb-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <School size={16} />
                  <span>{currentUser.school}</span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <GraduationCap size={16} />
                  <span>{currentUser.branch || 'Öğretmen'}</span>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-meb-primary"
                onClick={() => {
                  onClose();
                  onOpenUploadModal();
                }}
                style={{ padding: '10px 18px', fontSize: '13.5px' }}
              >
                <Upload size={16} />
                <span>Yeni Afiş Yükle</span>
              </button>
            </div>

            {/* Profile Grid Attributes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                <Mail size={16} color="#64748b" />
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>E-POSTA ADRESİ</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{currentUser.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                <Phone size={16} color="#64748b" />
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>TELEFON</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{currentUser.phone || 'Girilmedi'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                <Calendar size={16} color="#64748b" />
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>DOĞUM TARİHİ</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{currentUser.birthDate || 'Girilmedi'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Uploaded Posters Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--meb-red)" />
              YÜKLEDİĞİM AFİŞLER VE DİJİTAL ROTALAR
              <span style={{ fontSize: '12px', backgroundColor: 'var(--meb-red-light)', color: 'var(--meb-red)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                {myUploads.length} Adet
              </span>
            </h4>
          </div>

          {/* Posters Gallery Grid */}
          {myUploads.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {myUploads.map((story) => (
                <div 
                  key={story.id} 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '10px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#f1f5f9' }}>
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedFullImage(story.imageUrl)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Büyük Boyut Gör"
                    >
                      <Maximize2 size={15} />
                    </button>
                    <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'var(--meb-red)', color: '#ffffff', fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                      {story.routeCategory}
                    </span>
                  </div>

                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h5 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                        {story.title}
                      </h5>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {story.description}
                      </p>
                    </div>

                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {story.district || 'Ankara'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0f172a', fontWeight: 600 }}>
                        <Eye size={13} color="var(--meb-red)" /> {story.viewsCount || 1} Görüntülenme
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
              <Upload size={36} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h5 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
                Henüz Yüklenmiş Afişiniz Bulunmuyor
              </h5>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto 18px auto' }}>
                Hazırladığınız 1 sayfalık dijital kültür rotası afişini hemen veritabanına yükleyip sergileyebilirsiniz.
              </p>
              <button 
                type="button" 
                className="btn-meb-primary"
                onClick={() => {
                  onClose();
                  onOpenUploadModal();
                }}
              >
                <Upload size={16} />
                <span>İlk Afişinizi Yükleyin</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Full Resolution Image Preview Modal */}
      {selectedFullImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedFullImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img 
              src={selectedFullImage} 
              alt="Büyük Afiş Görseli" 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '6px' }} 
            />
            <button
              onClick={() => setSelectedFullImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
