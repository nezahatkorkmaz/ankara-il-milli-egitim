import React, { useState } from 'react';
import { User, DigitalStoryCard, RouteCategory } from '../types';
import { X, UploadCloud, CheckCircle2, GraduationCap, Image as ImageIcon, MapPin, Tag, FileText, Sparkles, RefreshCw } from 'lucide-react';

interface StoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUploadSuccess: (newCard: DigitalStoryCard) => void;
}

const routeCategories: RouteCategory[] = [
  'Ulus ve Müzeler Rotası',
  'Augustus ve Hacı Bayram Rotası',
  'Ankara Kalesi ve Samanpazarı',
  'Cumhuriyete Giden Yol',
  'Gordion ve Antik Ankara',
  'Beypazarı Kültür Rotası',
];

export const StoryUploadModal: React.FC<StoryUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUploadSuccess,
}) => {
  const [title, setTitle] = useState<string>('');
  const [routeCategory, setRouteCategory] = useState<RouteCategory>('Ulus ve Müzeler Rotası');
  const [district, setDistrict] = useState<string>('Altındağ');
  const [targetLevel, setTargetLevel] = useState<string>('Ortaokul (5-8. Sınıf)');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('/posters/erimtan-muzesi.jpg');
  const [tagsInput, setTagsInput] = useState<string>('Ankara Kültür Rotası, Dijital Hikaye');
  const [validationError, setValidationError] = useState<string>('');

  if (!isOpen) return null;

  const handleSimulatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setValidationError('Lütfen afiş başlığını ve içerik açıklamasını doldurunuz.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newCard: DigitalStoryCard = {
      id: `card-${Date.now()}`,
      title: title.trim(),
      routeCategory,
      district,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorSchool: currentUser.school,
      description: description.trim(),
      imageUrl: imageUrl || '/posters/erimtan-muzesi.jpg',
      createdAt: new Date().toISOString().split('T')[0],
      targetLevel,
      tags: tagsArray.length > 0 ? tagsArray : ['Dijital Afiş', 'Ankara'],
      viewsCount: 1,
    };

    onUploadSuccess(newCard);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--meb-red-light)', borderRadius: '6px', color: 'var(--meb-red)' }}>
              <UploadCloud size={22} />
            </div>
            <div>
              <h3 className="modal-title">Yeni 1 Sayfalık Dijital Afiş & Bilgi Kartı Yükleme</h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Ankara Dijital Kültür Rotaları Eğitimi Modülü</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Teacher Profile Banner */}
          <div className="teacher-info-banner-modern">
            <div className="teacher-avatar-circle">
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569', fontWeight: 500 }}>
                {currentUser.school} &bull; <span style={{ color: 'var(--meb-red)', fontWeight: 600 }}>{currentUser.branch}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '20px' }}>
              {/* Left Column - Form Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="var(--meb-red)" />
                    AFİŞ / HİKAYE BAŞLIĞI
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Erimtan Müzesi Ankara Hazinesi Bilgi Kartı"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--meb-red)" />
                    ANKARA KÜLTÜR ROTASI KATEGORİSİ
                  </label>
                  <select
                    className="form-control"
                    value={routeCategory}
                    onChange={(e) => setRouteCategory(e.target.value as RouteCategory)}
                  >
                    {routeCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>İLÇE / KONUM</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Altındağ"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>HEDEF SINIF / SEVİYE</label>
                    <select
                      className="form-control"
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(e.target.value)}
                    >
                      <option value="İlkokul (1-4. Sınıf)">İlkokul (1-4. Sınıf)</option>
                      <option value="Ortaokul (5-8. Sınıf)">Ortaokul (5-8. Sınıf)</option>
                      <option value="Lise (9-12. Sınıf)">Lise (9-12. Sınıf)</option>
                      <option value="Tüm Seviyeler">Tüm Seviyeler</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} color="var(--meb-red)" />
                    ETİKETLER (VİRGÜL İLE AYIRINIZ)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Müze, Tarih, Ankara, Kültür"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column - Visual Upload & Preview Card */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  DİJİTAL AFİŞ VEYA TASARIM GÖRSELİ
                </label>

                {imageUrl ? (
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                    <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', marginBottom: '10px' }}>
                      <img src={imageUrl} alt="Afiş Önizleme" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={16} /> Görsel Hazır
                      </span>
                      <button
                        type="button"
                        className="btn-meb-outline"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => document.getElementById('poster-file-input')?.click()}
                      >
                        <RefreshCw size={12} /> Görseli Değiştir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-zone-modern" onClick={() => document.getElementById('poster-file-input')?.click()}>
                    <UploadCloud size={40} color="var(--meb-red)" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                      Görsel Yüklemek İçin Tıklayın
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      PNG, JPG veya WEBP (1 Sayfalık Görsel Afiş)
                    </div>
                  </div>
                )}

                <input
                  id="poster-file-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleSimulatedImageUpload}
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} color="var(--meb-red)" />
                DİJİTAL HİKAYE ÖZETİ VE AKADEMİK / KÜLTÜREL AÇIKLAMA
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Öğrenciler için hazırladığınız 1 sayfalık afişin ana konusu, eğitsel kazanımları ve rota içeriği hakkında detaylı açıklama giriniz..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {validationError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px 14px', color: '#e30613', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
                {validationError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button type="button" className="btn-meb-outline" onClick={onClose}>
                İptal
              </button>
              <button type="submit" className="btn-meb-primary">
                <UploadCloud size={16} />
                <span>Sisteme Yükle ve Yayınla</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
