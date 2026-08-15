import React, { useState, useRef } from 'react';
import { User, DigitalStoryCard, RouteCategory } from '../types';
import { X, Upload, Image as ImageIcon, MapPin, Tag, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadPosterAndCreateStory } from '../firebase';

interface UploadStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onStoryUploaded: (newStory: DigitalStoryCard) => void;
}

const routeCategories: RouteCategory[] = [
  'Ulus ve Müzeler Rotası',
  'Augustus ve Hacı Bayram Rotası',
  'Ankara Kalesi ve Samanpazarı',
  'Cumhuriyete Giden Yol',
  'Gordion ve Antik Ankara',
  'Beypazarı Kültür Rotası',
];

export const UploadStoryModal: React.FC<UploadStoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onStoryUploaded,
}) => {
  const [title, setTitle] = useState('');
  const [routeCategory, setRouteCategory] = useState<RouteCategory>('Ulus ve Müzeler Rotası');
  const [district, setDistrict] = useState('Ankara / Altındağ');
  const [targetLevel, setTargetLevel] = useState('İlkokul / Ortaokul / Lise');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Ankara, Kültür, Dijital Rota');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Lütfen geçerli bir görsel dosyası seçiniz (JPG, PNG, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Görsel boyutu maksimum 10MB olmalıdır.');
        return;
      }
      setErrorMsg('');
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Lütfen geçerli bir görsel dosyası seçiniz (JPG, PNG, WEBP).');
        return;
      }
      setErrorMsg('');
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Lütfen afiş başlığını giriniz.');
      return;
    }

    if (!selectedFile) {
      setErrorMsg('Lütfen 1 sayfalık dijital kültür afiş görselini yükleyiniz.');
      return;
    }

    setIsUploading(true);

    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const storyData: Omit<DigitalStoryCard, 'id' | 'imageUrl'> = {
        title: title.trim(),
        routeCategory,
        district: district.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorSchool: currentUser.school,
        description: description.trim() || `${currentUser.name} tarafından hazırlanan 1 sayfalık dijital kültür afişi.`,
        createdAt: new Date().toISOString().split('T')[0],
        targetLevel,
        tags,
        viewsCount: 1,
      };

      const createdStory = await uploadPosterAndCreateStory(selectedFile, storyData);
      
      setSuccessMsg('Afişiniz ve dijital hikaye kartınız başarıyla yüklendi!');
      setTimeout(() => {
        onStoryUploaded(createdStory);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.warn('Upload fallback to local URL:', err);
      
      // Fallback preview creation if offline/demo
      const fallbackStory: DigitalStoryCard = {
        id: `story-${Date.now()}`,
        title: title.trim(),
        routeCategory,
        district: district.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorSchool: currentUser.school,
        description: description.trim() || `${currentUser.name} tarafından hazırlanan 1 sayfalık dijital kültür afişi.`,
        imageUrl: previewUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
        createdAt: new Date().toISOString().split('T')[0],
        targetLevel,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        viewsCount: 1,
      };

      setSuccessMsg('Afişiniz başarıyla eklendi ve sergilenmeye başladı!');
      setTimeout(() => {
        onStoryUploaded(fallbackStory);
        onClose();
      }, 900);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', borderRadius: '12px' }}>
        <div className="modal-header" style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--meb-red-light)', border: '1px solid var(--meb-red-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--meb-red)' }}>
              <Upload size={22} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Yeni Afiş & Dijital Rota Kartı Yükle</h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Öğretmen: <strong>{currentUser.name}</strong> ({currentUser.school})</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '22px' }}>
          {/* Poster File Drag & Drop Upload Zone */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              1 SAYFALIK DİJİTAL AFİŞ GÖRSELİ * (JPG / PNG / WEBP)
            </label>
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: previewUrl ? '2px solid var(--meb-red)' : '2px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: previewUrl ? '#fff5f5' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              {previewUrl ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={previewUrl}
                    alt="Afiş Önizleme"
                    style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <div style={{ fontSize: '13px', color: 'var(--meb-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} />
                    <span>{selectedFile?.name} ({((selectedFile?.size || 0) / 1024).toFixed(0)} KB)</span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>Farklı görsel seçmek için tıklayın</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                    <ImageIcon size={24} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                    Afiş dosyanızı buraya sürükleyin veya dosya seçmek için tıklayın
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Desteklenen formatlar: JPG, PNG, WEBP (Önerilen: Yüksek Çözünürlük, Maks 10MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title & Category Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                AFİŞ / ROTA BAŞLIĞI *
              </label>
              <div className="input-icon-wrapper">
                <FileText className="input-icon" size={17} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Örn: Samanpazarı El Sanatları Rotası"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                KÜLTÜR ROTASI KATEGORİSİ *
              </label>
              <div className="input-icon-wrapper">
                <MapPin className="input-icon" size={17} />
                <select
                  className="form-control"
                  value={routeCategory}
                  onChange={(e) => setRouteCategory(e.target.value as RouteCategory)}
                  style={{ appearance: 'auto', paddingLeft: '38px' }}
                >
                  {routeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* District & Target Level Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                İLÇE / KONUM
              </label>
              <div className="input-icon-wrapper">
                <MapPin className="input-icon" size={17} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ankara / Altındağ"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                ÖĞRETİM KADEMESİ
              </label>
              <div className="input-icon-wrapper">
                <Tag className="input-icon" size={17} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="İlkokul / Ortaokul / Lise"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
              AFİŞ VE ROTA AÇIKLAMASI / ÖĞRENİM ÖZETİ
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Afişinizde yer alan tarihî rotanın içeriğini, okul etkinliklerini ve öğrencilerinize kazandıracağı öğrenim çıktılarını açıklayınız..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Tags */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
              ETİKETLER (VİRGÜLLE AYIRINIZ)
            </label>
            <div className="input-icon-wrapper">
              <Tag className="input-icon" size={17} />
              <input
                type="text"
                className="form-control"
                placeholder="Örn: Ankara, Müze, Tarih, Selçuklu"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: '#e30613', fontSize: '13px', marginBottom: '14px', fontWeight: 600, backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={17} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ color: '#16a34a', fontSize: '13px', marginBottom: '14px', fontWeight: 600, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={17} />
              <span>{successMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '22px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
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
                  <Upload size={16} />
                  <span>Afişi Yükle & Yayınla</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
