import React, { useState } from 'react';
import { User, DigitalStoryCard, RouteCategory } from '../types';
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
  Layers, 
  Maximize2,
  Edit3,
  Edit2,
  Trash2,
  Save,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { updateTeacherProfile, deleteStoryFromFirestore, updateStoryInFirestore } from '../firebase';

const ROUTE_CATEGORIES: RouteCategory[] = [
  'Ulus ve Müzeler Rotası',
  'Augustus ve Hacı Bayram Rotası',
  'Ankara Kalesi ve Samanpazarı',
  'Cumhuriyete Giden Yol',
  'Gordion ve Antik Ankara',
  'Beypazarı Kültür Rotası',
];

const TEACHER_BRANCHES = [
  'Tarih Öğretmeni',
  'Sosyal Bilgiler Öğretmeni',
  'Görsel Sanatlar Öğretmeni',
  'Müzik Öğretmeni',
  'Türk Dili ve Edebiyatı Öğretmeni',
  'Türkçe Öğretmeni',
  'Sınıf Öğretmeni',
  'Coğrafya Öğretmeni',
  'Felsefe Öğretmeni',
  'İngilizce Öğretmeni',
  'Matematik Öğretmeni',
  'Fen Bilimleri / Fizik / Kimya / Biyoloji',
  'Din Kültürü ve Ahlak Bilgisi',
  'Bilişim Teknolojileri / Yazılım',
  'Beden Eğitimi ve Spor',
  'Teknoloji ve Tasarım',
  'Okul Öncesi Öğretmeni',
  'Özel Eğitim Öğretmeni',
  'Rehberlik ve Psikolojik Danışmanlık (PD/RAM)',
  'Felsefe Grubu Öğretmeni',
  'Almanca Öğretmeni',
  'Fransızca Öğretmeni',
  'İspanyolca Öğretmeni',
  'Arapça Öğretmeni',
  'Sanat Tarihi Öğretmeni',
  'Halk Oyunları Öğretmeni',
  'Grafik ve Fotoğraf Öğretmeni',
  'El Sanatları / Nakış Öğretmeni',
  'Radyo Televizyon Öğretmeni',
  'Konaklama ve Seyahat Hizmetleri',
  'Yiyecek İçecek Hizmetleri',
  'Giyim Üretim Teknolojisi',
  'Çocuk Gelişimi ve Eğitimi',
  'Adalet Öğretmeni',
  'Motorlu Araçlar Teknolojisi',
  'Elektrik-Elektronik Teknolojisi',
  'Bilişim Teknolojileri Öğretmeni',
  'Okul Yöneticisi / Müdür / Müdür Yardımcısı'
];

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  teacherStories: DigitalStoryCard[];
  onOpenUploadModal: () => void;
  onProfileUpdate: (updatedUser: User) => void;
  onDeleteStory: (storyId: string) => void;
  onUpdateStory: (updatedStory: DigitalStoryCard) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  teacherStories,
  onOpenUploadModal,
  onProfileUpdate,
  onDeleteStory,
  onUpdateStory,
}) => {
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Delete Confirmation state
  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);

  // Edit Story state
  const [editingStory, setEditingStory] = useState<DigitalStoryCard | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editRouteCategory, setEditRouteCategory] = useState<RouteCategory>('Ulus ve Müzeler Rotası');
  const [editDistrict, setEditDistrict] = useState('');
  const [editTargetLevel, setEditTargetLevel] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPosterFile, setEditPosterFile] = useState<File | null>(null);

  // Profile Edit Form State
  const [editName, setEditName] = useState(currentUser.name);
  const [editSchool, setEditSchool] = useState(currentUser.school);
  const [editBranch, setEditBranch] = useState(currentUser.branch || 'Tarih Öğretmeni');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editBirthDate, setEditBirthDate] = useState(currentUser.birthDate || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const myUploads = teacherStories.filter(
    (story) =>
      story.authorId === currentUser.id ||
      story.authorName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('Girdiğiniz yeni şifreler birbiriyle eşleşmiyor.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg('Yeni şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedData: Partial<User> = {
        name: editName.trim(),
        school: editSchool.trim(),
        branch: editBranch,
        phone: editPhone.trim(),
        birthDate: editBirthDate,
      };

      const updatedUser = await updateTeacherProfile(currentUser.id, updatedData, newPassword || undefined);
      onProfileUpdate(updatedUser);
      setSuccessMsg('Profil bilgileriniz başarıyla güncellendi!');
      setIsEditingProfile(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Profil güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStoryConfirm = async (storyId: string) => {
    setIsLoading(true);
    try {
      await deleteStoryFromFirestore(storyId);
      onDeleteStory(storyId);
      setSuccessMsg('Afiş çalışması veritabanından başarıyla silindi.');
      setDeletingStoryId(null);
    } catch (err) {
      console.error(err);
      setErrorMsg('Afiş silinirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditStory = (story: DigitalStoryCard) => {
    setEditingStory(story);
    setEditTitle(story.title);
    setEditRouteCategory(story.routeCategory);
    setEditDistrict(story.district || 'Ankara');
    setEditTargetLevel(story.targetLevel || 'İlkokul / Ortaokul / Lise');
    setEditDescription(story.description || '');
    setEditPosterFile(null);
    setErrorMsg('');
  };

  const handleSaveStoryUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;

    setIsLoading(true);
    try {
      const updatedCard = await updateStoryInFirestore(
        editingStory.id,
        {
          title: editTitle.trim(),
          routeCategory: editRouteCategory as RouteCategory,
          district: editDistrict.trim(),
          targetLevel: editTargetLevel,
          description: editDescription.trim(),
        },
        editPosterFile || undefined
      );

      onUpdateStory(updatedCard);
      setSuccessMsg('Afiş bilgileri başarıyla güncellendi!');
      setEditingStory(null);
    } catch (err) {
      console.error(err);
      setErrorMsg('Afiş güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '860px', width: '95%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', borderRadius: '14px', overflow: 'hidden' }}
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
          
          {successMsg && (
            <div style={{ color: '#166534', fontSize: '13.5px', marginBottom: '16px', fontWeight: 600, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Teacher Info Card Header & Actions */}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-meb-outline"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={15} />
                  <span>{isEditingProfile ? 'İptal' : 'Profilimi Düzenle'}</span>
                </button>

                <button 
                  type="button" 
                  className="btn-meb-primary"
                  onClick={() => {
                    onClose();
                    onOpenUploadModal();
                  }}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  <Upload size={15} />
                  <span>Yeni Afiş Yükle</span>
                </button>
              </div>
            </div>

            {/* Profile Edit Form vs Read-only Attributes */}
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} style={{ marginTop: '10px' }}>
                {errorMsg && (
                  <div style={{ color: '#e30613', fontSize: '13px', marginBottom: '14px', fontWeight: 600, backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>AD SOYAD *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>GÖREV YAPTIĞI OKUL / KURUM *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editSchool}
                      onChange={(e) => setEditSchool(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>BRANŞ *</label>
                    <select
                      className="form-control"
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value)}
                      required
                    >
                      {TEACHER_BRANCHES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>TELEFON NUMARASI</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>DOĞUM TARİHİ</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editBirthDate}
                      onChange={(e) => setEditBirthDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>E-POSTA ADRESİ (Değiştirilemez)</label>
                    <input
                      type="email"
                      className="form-control"
                      value={currentUser.email}
                      disabled
                      style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={15} color="var(--meb-red)" />
                    <span>Şifre Değiştir (Opsiyonel)</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Yeni Şifre (Boş bırakılabilir)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Yeni Şifre Tekrarı"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-meb-outline" onClick={() => setIsEditingProfile(false)}>
                    İptal
                  </button>
                  <button type="submit" className="btn-meb-primary" disabled={isLoading}>
                    <Save size={15} />
                    <span>{isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                  </button>
                </div>
              </form>
            ) : (
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
            )}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
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

                    <div>
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} /> {story.district || 'Ankara'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0f172a', fontWeight: 600 }}>
                          <Eye size={13} color="var(--meb-red)" /> {story.viewsCount || 1} Görüntülenme
                        </span>
                      </div>

                      {/* Poster Action Buttons: Edit & Delete */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditStory(story)}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#1e293b',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit2 size={13} color="#2563eb" />
                          <span>Düzenle</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingStoryId(story.id)}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #fecaca',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={13} color="#dc2626" />
                          <span>Sil</span>
                        </button>
                      </div>

                      {/* Inline Delete Confirmation prompt */}
                      {deletingStoryId === story.id && (
                        <div style={{ marginTop: '10px', backgroundColor: '#fff1f2', border: '1px solid #fda4af', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ fontSize: '11.5px', color: '#9f1239', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={14} />
                            <span>Afişi silmek istediğinize emin misiniz?</span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteStoryConfirm(story.id)}
                              style={{ flex: 1, padding: '4px 8px', backgroundColor: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                              disabled={isLoading}
                            >
                              Evet, Sil
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingStoryId(null)}
                              style={{ flex: 1, padding: '4px 8px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Vazgeç
                            </button>
                          </div>
                        </div>
                      )}
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

      {/* Edit Story Modal */}
      {editingStory && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="modal-container" style={{ maxWidth: '600px', width: '90%', borderRadius: '12px' }}>
            <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit2 size={20} color="var(--meb-red)" />
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Afiş & Hikaye Kartını Düzenle</h4>
              </div>
              <button className="modal-close-btn" onClick={() => setEditingStory(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStoryUpdate} style={{ padding: '20px' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>AFİŞ BAŞLIĞI *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>ROTA KATEGORİSİ *</label>
                  <select
                    className="form-control"
                    value={editRouteCategory}
                    onChange={(e) => setEditRouteCategory(e.target.value as RouteCategory)}
                    required
                  >
                    {ROUTE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>KONUM / İLÇE *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>HEDEF ÖĞRENİM SEVİYESİ *</label>
                <select
                  className="form-control"
                  value={editTargetLevel}
                  onChange={(e) => setEditTargetLevel(e.target.value)}
                  required
                >
                  <option value="İlkokul">İlkokul (1 - 4. Sınıflar)</option>
                  <option value="Ortaokul">Ortaokul (5 - 8. Sınıflar)</option>
                  <option value="Lise">Lise (9 - 12. Sınıflar)</option>
                  <option value="İlkokul / Ortaokul / Lise">Tüm Eğitim Kademeleri (İlkokul / Ortaokul / Lise)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>AÇIKLAMA / HİKAYE ÖZETİ *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>YENİ AFİŞ GÖRSELİ SEÇ (Opsiyonel)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditPosterFile(e.target.files[0]);
                    }
                  }}
                />
                <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Yalnızca mevcut afiş görselini değiştirmek istiyorsanız yeni bir görsel dosyası seçiniz.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-meb-outline" onClick={() => setEditingStory(null)}>
                  İptal
                </button>
                <button type="submit" className="btn-meb-primary" disabled={isLoading}>
                  <Save size={15} />
                  <span>{isLoading ? 'Kaydediliyor...' : 'Afiş Bilgilerini Güncelle'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
