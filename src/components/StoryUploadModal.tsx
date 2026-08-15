import React, { useState, useRef } from 'react';
import { User, DigitalStoryCard, RouteCategory } from '../types';
import { X, UploadCloud, CheckCircle2, GraduationCap, Image as ImageIcon, MapPin, Tag, FileText, Sparkles, RefreshCw, Loader2, AlertCircle, Wand2, ArrowRight } from 'lucide-react';
import { uploadPosterAndCreateStory } from '../firebase';
import { generateInfographicPosterData, generateAiBuildingImage } from '../services/geminiService';
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
  const [routeCategory, setRouteCategory] = useState<RouteCategory>('Ulus ve Müzeler Rotası');
  const [district, setDistrict] = useState<string>('Altındağ');
  const [targetLevel, setTargetLevel] = useState<string>('Ortaokul / Lise (Tüm Seviyeler)');
  const [description, setDescription] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('Ankara, Kültür Rotası, Infografik Afiş');

  // Manual File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // AI Mode State
  const [rawStoryText, setRawStoryText] = useState<string>(
    "Ankara Devlet Resim ve Heykel Müzesi 1927 yılında mimar Arif Hikmet Koyunoğlu tarafından Birinci Ulusal Mimarlık Akımı doğrultusunda inşa edilmiştir. Türk resim ve heykel sanatının en nadide şaheserlerini barındırmaktadır. Müze Altındağ ilçesinde Ulus ve Müzeler Rotası üzerindedir."
  );
  const [aiPhotoFile, setAiPhotoFile] = useState<File | null>(null);
  const [aiPhotoPreview, setAiPhotoPreview] = useState<string>('/posters/resim-heykel-bina.png');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const aiFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAiPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAiPhotoFile(file);
      const url = URL.createObjectURL(file);
      setAiPhotoPreview(url);
    }
  };

  // Dedicated AI Building Photo Generator
  const handleGenerateAiPhoto = async () => {
    setValidationError('');
    setIsGeneratingAiImage(true);

    try {
      const prompt = rawStoryText.substring(0, 50) || 'Ankara Resim ve Heykel Müzesi';
      const generatedImageUrl = await generateAiBuildingImage(prompt);
      setAiPhotoPreview(generatedImageUrl);
      setAiPhotoFile(null);
      setSuccessMessage('🎨 Yapay zeka mekân görselini başarıyla oluşturdu!');
    } catch (err: any) {
      setValidationError('AI Görseli oluşturulurken bir hata oluştu.');
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // Multimodal Gemini AI Poster Generation
  const handleGenerateAiPoster = async () => {
    setValidationError('');
    if (!rawStoryText.trim()) {
      setValidationError('Lütfen AI afiş üretimi için mekan hikayesini veya ders notlarını giriniz.');
      return;
    }

    setIsAiGenerating(true);

    try {
      // 1. Send Multimodal Input (Text + Photo File) to Gemini AI
      const infographicData = await generateInfographicPosterData(
        rawStoryText,
        routeCategory,
        district,
        aiPhotoFile
      );

      // Use uploaded image or AI generated photo
      const finalPhotoUrl = aiPhotoPreview || infographicData.aiGeneratedImageUrl || '/posters/resim-heykel-bina.png';

      // 2. Dynamically synthesize 1-page Infographic Poster based on Gemini AI design system tokens
      const generatedPosterDataUrl = await generatePosterImageFromCanvas({
        data: infographicData,
        photoUrl: finalPhotoUrl,
        routeCategory,
        district,
        authorName: currentUser.name,
        authorSchool: currentUser.school,
      });

      // 3. Populate form fields automatically
      setTitle(infographicData.mainTitle);
      setDescription(infographicData.aboutText);
      setPreviewUrl(generatedPosterDataUrl);
      setSelectedFile(null);

      setSuccessMessage('✨ Multimodal Gemini AI metni ve fotoğrafı analiz ederek Özgün Dinamik Afişi tasarladı!');
    } catch (err: any) {
      setValidationError(err.message || 'AI Afiş oluşturulurken bir hata meydana geldi.');
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
      <div className="modal-container large" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', borderRadius: '12px' }}>
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
              <span>✨ 1. Multimodal Gemini AI ile Dinamik Afiş Tasarla</span>
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
              
              {/* Visual Showcase Guide Card */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #0B1E36',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '18px',
                boxShadow: '0 4px 12px rgba(11,30,54,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sparkles size={20} color="var(--meb-red)" />
                  <h4 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: '#0B1E36' }}>
                    💡 Multimodal Gemini AI ile Dinamik Afiş Üretimi
                  </h4>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '12px',
                  alignItems: 'center',
                  backgroundColor: '#FAF7F2',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #E2D8CC',
                  marginBottom: '12px'
                }}>
                  {/* Step 1: Input Building Photo */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--meb-red)', marginBottom: '6px' }}>
                      1. FOTOĞRAF VEYA AI GÖRSELİ
                    </div>
                    <img
                      src={aiPhotoPreview}
                      alt="Mimari Yapı Görseli"
                      style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', border: '1.5px solid #cbd5e1' }}
                    />
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Fotoğraf veya Üretilen AI Görseli
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div style={{ textAlign: 'center', padding: '0 4px' }}>
                    <div style={{
                      backgroundColor: '#0B1E36',
                      color: '#ffffff',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 4px auto',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      ➔
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#0B1E36' }}>Multimodal Gemini AI</div>
                  </div>

                  {/* Step 2: Output Infographic Poster */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>
                      2. DİNAMİK İNFOGRAFİK AFİŞ
                    </div>
                    <img
                      src="/posters/erimtan-infografik-ornek.jpg"
                      alt="Infografik Afiş Çıktısı"
                      style={{ width: '100%', height: '110px', objectFit: 'contain', borderRadius: '6px', border: '1.5px solid #86efac' }}
                    />
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Dinamik Temalı Kültür Afişi
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '12.5px', color: '#334155', margin: 0, lineHeight: 1.55, textAlign: 'left' }}>
                  📢 <strong>Multimodal Yapay Zeka:</strong> Fotoğrafı ve doğal dil anlatımınızı doğrudan Gemini AI'a girdi olarak veriyoruz. Sistem promptu sayesinde Gemini AI mekanın ruhuna uygun <strong>özgün renk paletini, temayı ve bilgileri dinamik olarak belirleyip afişinizi üretir!</strong>
                </p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B1E36', display: 'block', marginBottom: '6px' }}>
                  1. MİMARİ YAPI / MEKÂN FOTOĞRAFI (GEMINI MULTIMODAL GİRDİSİ)
                </label>
                <input
                  type="file"
                  ref={aiFileInputRef}
                  onChange={handleAiPhotoChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-meb-outline"
                    onClick={() => aiFileInputRef.current?.click()}
                    style={{ fontSize: '12.5px', padding: '9px 14px' }}
                  >
                    <ImageIcon size={16} />
                    <span>Cihazdan Fotoğraf Seç (Gemini Girdisi)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateAiPhoto}
                    disabled={isGeneratingAiImage}
                    style={{
                      fontSize: '12.5px',
                      padding: '9px 14px',
                      backgroundColor: '#1E293B',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isGeneratingAiImage ? (
                      <>
                        <Loader2 size={16} className="spin-animation" />
                        <span>AI Görsel Üretiliyor...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 size={16} color="#F59E0B" />
                        <span>🎨 AI Yapay Zeka Fotoğrafı Üret</span>
                      </>
                    )}
                  </button>

                  {aiPhotoPreview && (
                    <img
                      src={aiPhotoPreview}
                      alt="Seçilen Fotoğraf"
                      style={{ width: '55px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ color: '#0B1E36' }}>2. DOĞAL DİLLE DERS NOTLARI VEYA MEKÂN HİKAYESİ</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Örn: Ankara Devlet Resim ve Heykel Müzesi 1927 yılında mimar Arif Hikmet Koyunoğlu tarafından inşa edilmiştir. Türk resim ve heykel sanatının nadide eserlerini barındırmaktadır. Ulus ve Müzeler Rotası üzerindedir..."
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
                    placeholder="Örn: Altındağ, Çankaya, Polatlı"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn-meb-primary"
                onClick={handleGenerateAiPoster}
                disabled={isAiGenerating || isGeneratingAiImage}
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
                    <span>Multimodal Gemini AI Dinamik Afiş Tasarlıyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>✨ Multimodal Gemini AI ile Dinamik Afiş Tasarla</span>
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
                placeholder="Örn: ANKARA RESİM VE HEYKEL MÜZESİ"
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
                <div style={{ display: 'inline-block', border: '2px solid #0B1E36', borderRadius: '10px', overflow: 'hidden', maxHeight: '340px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  <img src={previewUrl} alt="Infografik AfİŞ Önizleme" style={{ maxHeight: '340px', objectFit: 'contain', display: 'block' }} />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>ETİKETLER</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ankara, Resim ve Heykel Müzesi, Kültür Rotası"
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
