import React, { useState } from 'react';
import { User, DigitalStoryCard, RouteCategory } from '../types';
import { X, UploadCloud, CheckCircle2 } from 'lucide-react';

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
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UploadCloud size={24} color="#e30613" />
            <h3 className="modal-title">Yeni 1 Sayfalık Dijital Afiş & Bilgi Kartı Yükleme</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#e30613' }}>
            <strong>Yükleyen Öğretmen:</strong> {currentUser.name} ({currentUser.school} - {currentUser.branch})
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div className="form-group">
                  <label>AFİŞ / HİKAYE BAŞLIĞI</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Erimtan Müzesi Ankara Hazinesi Bilgi Kartı"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>ANKARA KÜLTÜR ROTASI KATEGORİSİ</label>
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
                  <div className="form-group">
                    <label>İLÇE / KONUM</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Altındağ"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
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

                <div className="form-group">
                  <label>ETİKETLER (VİRGÜL İLE AYIRINIZ)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Müze, Tarih, Ankara, Kültür"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label>DİJİTAL AFİŞ GÖRSELİ VEYA TASARIM GÖRSELİ</label>
                  <div className="file-dropzone" onClick={() => document.getElementById('poster-file-input')?.click()} style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f8fafc' }}>
                    <UploadCloud size={36} color="#e30613" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                      Dijital Afiş / Bilgi Kartı Görseli Yüklemek İçin Tıklayın
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      PNG, JPG veya WEBP (1 Sayfalık Görsel Afiş)
                    </div>
                    <input
                      id="poster-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleSimulatedImageUpload}
                    />
                  </div>
                </div>

                {imageUrl && (
                  <div className="poster-preview-box" style={{ marginTop: '12px' }}>
                    <img src={imageUrl} alt="Afiş Önizleme" style={{ maxHeight: '220px', objectFit: 'contain' }} />
                    <div style={{ padding: '8px 12px', fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                      <CheckCircle2 size={16} /> Görsel Yüklendi ve Hazır
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>DİJİTAL HİKAYE ÖZETİ VE AKADEMİK / KÜLTÜREL AÇIKLAMA</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Öğrenciler için hazırladığınız 1 sayfalık afişin ana konusu, eğitsel kazanımları ve rota içeriği hakkında detaylı açıklama giriniz..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {validationError && (
              <div style={{ color: '#e30613', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
                {validationError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn-meb-outline" onClick={onClose}>
                İptal
              </button>
              <button type="submit" className="btn-meb-primary">
                Sisteme Yükle ve Yayınla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
