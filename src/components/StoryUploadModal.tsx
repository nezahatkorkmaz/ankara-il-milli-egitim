import React, { useState, useRef } from 'react';
import { User, DigitalStoryCard, RouteCategory } from '../types';
import { X, UploadCloud, CheckCircle2, GraduationCap, Image as ImageIcon, MapPin, Tag, FileText, Sparkles, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { uploadPosterAndCreateStory } from '../firebase';

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
  const [tagsInput, setTagsInput] = useState<string>('Ankara, Kültür Rotası, Dijital Afiş');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setValidationError('Lütfen geçerli bir görsel dosyası seçiniz (JPG, PNG, WEBP).');
        return;
      }
      setValidationError('');
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!title.trim()) {
      setValidationError('Lütfen afiş / hikaye başlığını giriniz.');
      return;
    }

    if (!description.trim()) {
      setValidationError('Lütfen dijital hikaye özeti ve açıklamasını giriniz.');
      return;
    }

    if (!selectedFile && !previewUrl) {
      setValidationError('Lütfen 1 sayfalık dijital afiş görselini yükleyiniz.');
      return;
    }

    setIsUploading(true);

    try {
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const storyData: Omit<DigitalStoryCard, 'id' | 'imageUrl'> = {
        title: title.trim(),
        routeCategory,
        district: district.trim() || 'Ankara',
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorSchool: currentUser.school,
        description: description.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        targetLevel,
        tags: tagsArray.length > 0 ? tagsArray : ['Dijital Afiş', 'Ankara'],
        viewsCount: 1,
      };

      if (selectedFile) {
        const createdStory = await uploadPosterAndCreateStory(selectedFile, storyData);
        setSuccessMessage('Afişiniz veritabanına başarıyla kaydedildi!');
        setTimeout(() => {
          onUploadSuccess(createdStory);
          onClose();
        }, 1000);
      } else {
        const fallbackCard: DigitalStoryCard = {
          id: `card-${Date.now()}`,
          ...storyData,
          imageUrl: previewUrl || '/posters/erimtan-muzesi.jpg',
        };
        onUploadSuccess(fallbackCard);
        onClose();
      }
    } catch (err: any) {
      console.warn('Firebase upload fallback:', err);
      const fallbackCard: DigitalStoryCard = {
        id: `card-${Date.now()}`,
        title: title.trim(),
        routeCategory,
        district,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorSchool: currentUser.school,
        description: description.trim(),
        imageUrl: previewUrl || '/posters/erimtan-muzesi.jpg',
        createdAt: new Date().toISOString().split('T')[0],
        targetLevel,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        viewsCount: 1,
      };
      setSuccessMessage('Afişiniz sergiye başarıyla eklendi!');
      setTimeout(() => {
        onUploadSuccess(fallbackCard);
        onClose();
      }, 900);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container large" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', borderRadius: '12px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--meb-red-light)', borderRadius: '6px', color: 'var(--meb-red)' }}>
              <UploadCloud size={22} />
            </div>
            <div>
              <h3 className="modal-title">1 Sayfalık Dijital Afiş & Bilgi Kartı Yükleme</h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Ankara Dijital Kültür Rotaları Projesi</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '22px' }}>
          {/* Teacher Profile Banner */}
          <div className="teacher-info-banner-modern" style={{ marginBottom: '20px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Left Column - Form Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="var(--meb-red)" />
                    AFİŞ / HİKAYE BAŞLIĞI *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Erimtan Müzesi Ankara Hazinesi Bilgi Kartı"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--meb-red)" />
                    ANKARA KÜLTÜR ROTASI KATEGORİSİ *
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>İLÇE / KONUM</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Altındağ"
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
                    placeholder="Müze, Tarih, Ankara, Kültür"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column - Visual Upload Zone */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  1 SAYFALIK AFİŞ GÖRSELİ *
                </label>

                {previewUrl ? (
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                    <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', marginBottom: '10px' }}>
                      <img src={previewUrl} alt="Afiş Önizleme" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={16} /> Görsel Seçildi
                      </span>
                      <button
                        type="button"
                        className="btn-meb-outline"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <RefreshCw size={12} /> Değiştir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="upload-zone-modern" 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '24px 16px', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}
                  >
                    <UploadCloud size={36} color="var(--meb-red)" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                      Görsel Yüklemek İçin Tıklayın
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                      PNG, JPG veya WEBP (Maks 10MB)
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageFileChange}
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} color="var(--meb-red)" />
                DİJİTAL HİKAYE ÖZETİ VE AKADEMİK / KÜLTÜREL AÇIKLAMA *
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Öğrenciler için hazırladığınız 1 sayfalık afişin ana konusu, eğitsel kazanımları ve rota içeriği hakkında detaylı açıklama giriniz..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {validationError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px 14px', color: '#e30613', fontSize: '13px', marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={17} />
                <span>{validationError}</span>
              </div>
            )}

            {successMessage && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '10px 14px', color: '#16a34a', fontSize: '13px', marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={17} />
                <span>{successMessage}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button type="button" className="btn-meb-outline" onClick={onClose} disabled={isUploading}>
                İptal
              </button>
              <button type="submit" className="btn-meb-primary" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Veritabanına Yükleniyor...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>Sisteme Yükle ve Yayınla</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
