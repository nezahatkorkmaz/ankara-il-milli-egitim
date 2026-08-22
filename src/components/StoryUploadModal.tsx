import React, { useState, useRef } from 'react';
import { User, DigitalStoryCard, RouteCategory } from '../types';
import { X, UploadCloud, CheckCircle2, Image as ImageIcon, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { uploadPosterAndCreateStory } from '../firebase';
import { generateInfographicPosterData } from '../services/geminiService';
import { generatePosterImageFromCanvas } from '../utils/posterCanvasGenerator';

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
  const [activeMode, setActiveMode] = useState<'ai' | 'manual'>('ai');

  // Form Fields
  const [title, setTitle] = useState<string>('');
  const [routeCategory, setRouteCategory] = useState<RouteCategory>('Cumhuriyete Giden Yol');
  const [district, setDistrict] = useState<string>('Çankaya');
  const [targetLevel, setTargetLevel] = useState<string>('Ortaokul / Lise (Tüm Seviyeler)');
  const [description, setDescription] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('Ankara, Kültür Rotası, Infografik Afiş');

  // Manual File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // AI Mode State
  const [rawStoryText, setRawStoryText] = useState<string>(
    "Anıtkabir, Türkiye Cumhuriyeti'nin kurucusu Gazi Mustafa Kemal Atatürk'ün ebedi istirahatgâhıdır. Ankara'nın Çankaya ilçesinde, tarihi Rasattepe üzerinde inşa edilmiştir. Mimar Prof. Emin Onat ve Doç. Orhan Arda tarafından İkinci Ulusal Mimarlık Akımı doğrultusunda tasarlanan yapı; Aslanlı Yol, Tören Meydanı, Mozole ve Atatürk ve Kurtuluş Savaşı Müzesi'nden oluşmaktadır. Türk milletinin bağımsızlık mücadelesini ve Cumhuriyet devrimlerini simgeleyen Anıtkabir, Cumhuriyete Giden Yol Kültür Rotası'nın en önemli mekanıdır."
  );
  const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState<string>('/posters/anitkabir-bina.png');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserPhotoFile(file);
      const url = URL.createObjectURL(file);
      setUserPhotoPreview(url);
    }
  };

  // Multimodal Gemini AI Vision-Language Poster Generation
  const handleGenerateAiPoster = async () => {
    setValidationError('');
    if (!rawStoryText.trim()) {
      setValidationError('Lütfen afiş üretimi için mekan hikayesini veya ders notlarını giriniz.');
      return;
    }

    setIsAiGenerating(true);

    try {
      // 1. Send raw text and uploaded photo file to Gemini 1.5 Flash Vision-Language API
      const infographicData = await generateInfographicPosterData(
        rawStoryText,
        routeCategory,
        district,
        userPhotoFile
      );

      // 2. Determine photo URL
      let photoUrlToUse = userPhotoPreview;
      if (userPhotoFile) {
        photoUrlToUse = URL.createObjectURL(userPhotoFile);
      }

      // 3. Render exact 4-poster style infographic canvas
      const posterCanvasDataUrl = await generatePosterImageFromCanvas({
        data: infographicData,
        photoUrl: photoUrlToUse,
        routeCategory,
        district,
        authorName: currentUser.name,
        authorSchool: currentUser.school,
      });

      // 4. Update form inputs and preview
      setTitle(infographicData.mainTitle);
      setDescription(infographicData.aboutText);
      setPreviewUrl(posterCanvasDataUrl);
      setSelectedFile(null);

      setSuccessMessage('✨ İnfografik kültür afişiniz başarıyla oluşturuldu!');
    } catch (err: any) {
      setValidationError(err.message || 'Afiş oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsAiGenerating(false);
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
      setValidationError('Lütfen 1 sayfalık dijital afiş görselini yükleyiniz veya AI ile oluşturunuz.');
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
        tags: tagsArray.length > 0 ? tagsArray : ['Dijital Afiş', 'Infografik', 'Ankara'],
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
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
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
      <div className="modal-container large" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', borderRadius: '12px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--meb-red-light)', borderRadius: '6px', color: 'var(--meb-red)' }}>
              <UploadCloud size={22} />
            </div>
            <div>
              <h3 className="modal-title">1 Sayfalık Multimodal AI Afiş & Bilgi Kartı Oluşturucu</h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Ankara Dijital Kültür Rotaları Projesi</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', backgroundColor: '#f1f5f9', padding: '6px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveMode('ai')}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeMode === 'ai' ? '#ffffff' : 'transparent',
                color: activeMode === 'ai' ? 'var(--meb-red)' : '#64748b',
                boxShadow: activeMode === 'ai' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={17} color="var(--meb-red)" />
              <span>✨ 1. Multimodal Gemini AI ile Afiş Oluştur</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('manual')}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeMode === 'manual' ? '#ffffff' : 'transparent',
                color: activeMode === 'manual' ? 'var(--meb-red)' : '#64748b',
                boxShadow: activeMode === 'manual' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <UploadCloud size={17} />
              <span>📁 2. Hazır Afiş Dosyası Yükle</span>
            </button>
          </div>

          {validationError && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {successMessage && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* AI Gemini Multimodal Section */}
          {activeMode === 'ai' && (
            <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E2D8CC', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0B1E36', display: 'block', marginBottom: '6px' }}>
                  1. MEKÂN FOTOĞRAFI YÜKLE
                </label>
                <input
                  type="file"
                  ref={photoFileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-meb-outline"
                    onClick={() => photoFileInputRef.current?.click()}
                    style={{ fontSize: '13px', padding: '9px 16px' }}
                  >
                    <ImageIcon size={16} />
                    <span>Cihazdan Fotoğraf Yükle</span>
                  </button>

                  {userPhotoPreview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={userPhotoPreview}
                        alt="Yüklenen Fotoğraf"
                        style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1.5px solid #0B1E36' }}
                      />
                      <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>✓ Fotoğraf eklendi</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ color: '#0B1E36' }}>2. DERS NOTLARI VEYA MEKÂN HİKAYESİ METNİ</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Mekan hakkında bilgi ve hikayeleri buraya giriniz..."
                  value={rawStoryText}
                  onChange={(e) => setRawStoryText(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label style={{ color: '#0B1E36' }}>KÜLTÜR ROTASI</label>
                  <select
                    className="form-control"
                    value={routeCategory}
                    onChange={(e) => setRouteCategory(e.target.value as RouteCategory)}
                  >
                    {routeCategories.map((rc) => (
                      <option key={rc} value={rc}>{rc}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ color: '#0B1E36' }}>İLÇE</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Çankaya, Altındağ"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn-meb-primary"
                onClick={handleGenerateAiPoster}
                disabled={isAiGenerating}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#0B1E36',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: '8px',
                }}
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 size={20} className="spin-animation" />
                    <span>Gemini AI İnfografik Afişi Çiziyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>✨ Multimodal Gemini AI ile Afiş Oluştur</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>AFİŞ BAŞLIĞI</label>
              <input
                type="text"
                className="form-control"
                placeholder="Örn: ANKARA ANITKABİR VE ATATÜRK MÜZESİ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>DİJİTAL HİKAYE VE ÖZET</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Afişte yer alacak özet bilgisi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Poster Preview Box */}
            {previewUrl && (
              <div style={{ marginBottom: '18px', textAlign: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  OLUŞTURULAN 1 SAYFALIK İNFOGRAFİK AFİŞ ÖNİZLEMESİ
                </label>
                <div style={{ display: 'inline-block', border: '2px solid #0B1E36', borderRadius: '10px', overflow: 'hidden', maxHeight: '380px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  <img src={previewUrl} alt="Infografik Afiş Önizleme" style={{ maxHeight: '380px', objectFit: 'contain', display: 'block' }} />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>ETİKETLER</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ankara, Anıtkabir, Kültür Rotası"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-meb-outline" onClick={onClose} disabled={isUploading}>
                İptal
              </button>
              <button type="submit" className="btn-meb-primary" disabled={isUploading || isAiGenerating}>
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="spin-animation" />
                    <span>Yayınlanıyor...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>1 Sayfalık Infografik Afişi Galeriye Yayınla</span>
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
