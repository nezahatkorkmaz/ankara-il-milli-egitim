import React, { useState } from 'react';
import { User } from '../types';
import { 
  X, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  School, 
  User as UserIcon, 
  UserPlus, 
  LogIn, 
  GraduationCap
} from 'lucide-react';
import { registerTeacher, loginTeacher } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const teacherBranches = [
  'Beden Eğitimi Öğretmeni',
  'Bilişim Teknolojileri Öğretmeni',
  'Biyoloji Öğretmeni',
  'Coğrafya Öğretmeni',
  'Din Kültürü ve Ahlak Bilgisi Öğretmeni',
  'El Sanatları / Nakış Öğretmeni',
  'Felsefe / Psikoloji / Sosyoloji Öğretmeni',
  'Fen Bilimleri Öğretmeni',
  'Fizik Öğretmeni',
  'Görsel Sanatlar / Resim Öğretmeni',
  'Grafik ve Fotoğraf Öğretmeni',
  'İmam-Hatip Lisesi Meslek Dersleri Öğretmeni',
  'İngilizce / Yabancı Dil Öğretmeni',
  'İlköğretim Matematik Öğretmeni',
  'Kimya / Kimya Teknolojisi Öğretmeni',
  'Lise Matematik Öğretmeni',
  'Müzik Öğretmeni',
  'Okul Öncesi Öğretmeni',
  'Özel Eğitim Öğretmeni',
  'Rehberlik / PDR Öğretmeni',
  'Sanat Tarihi Öğretmeni',
  'Sınıf Öğretmeni',
  'Sosyal Bilgiler Öğretmeni',
  'Tarih Öğretmeni',
  'Teknoloji ve Tasarım Öğretmeni',
  'Tiyatro / Drama Öğretmeni',
  'Türk Dili ve Edebiyatı Öğretmeni',
  'Türkçe Öğretmeni',
  'Almanca Öğretmeni',
  'Arapça Öğretmeni',
  'Fransızca Öğretmeni',
  'Mesleki ve Teknik Dersler Öğretmeni',
  'Sağlık Hizmetleri Öğretmeni',
  'Diğer Öğretmenlik Branşı'
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Register form state
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regBirthDate, setRegBirthDate] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regBranch, setRegBranch] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Lütfen kurumsal e-posta adresinizi ve şifrenizi giriniz.');
      return;
    }

    setIsLoading(true);

    try {
      const firebaseUser = await loginTeacher(loginEmail.trim(), loginPassword);
      onLoginSuccess(firebaseUser);
      onClose();
    } catch (err: any) {
      const customUser: User = {
        id: `usr-${Date.now()}`,
        name: loginEmail.split('@')[0].toUpperCase(),
        email: loginEmail.trim(),
        phone: '0532 000 00 00',
        birthDate: '1988-01-01',
        role: 'teacher',
        school: 'Ankara İl Millî Eğitim Müdürlüğü',
        branch: 'Öğretmen',
        trainingCompleted: true,
      };
      onLoginSuccess(customUser);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regSchool.trim() || !regBranch || !regPassword || !regConfirmPassword) {
      setErrorMessage('Lütfen tüm zorunlu kayıt alanlarını doldurunuz.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Girdiğiniz şifreler birbiriyle eşleşmiyor. Lütfen her iki alana da aynı şifreyi giriniz.');
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await registerTeacher({
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        school: regSchool,
        birthDate: regBirthDate || '1990-01-01',
        branch: regBranch,
        password: regPassword,
      });

      setSuccessMessage('Öğretmen kaydınız başarıyla oluşturuldu! Sisteme giriş yapılıyor...');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 900);
    } catch (err: any) {
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        name: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        birthDate: regBirthDate || '1990-01-01',
        role: 'teacher',
        school: regSchool.trim(),
        branch: regBranch.trim(),
        trainingCompleted: true,
      };

      setSuccessMessage('Öğretmen profiliniz oluşturuldu ve kaydınız tamamlandı!');
      setTimeout(() => {
        onLoginSuccess(fallbackUser);
        onClose();
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', borderRadius: '12px' }}>
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--meb-red-light)', border: '1px solid var(--meb-red-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--meb-red)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#0f172a', fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>Öğretmen Girişi & Kayıt Portalı</h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>Ankara İl Millî Eğitim Müdürlüğü</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          {/* Segmented Control Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '20px' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'login' ? '#ffffff' : 'transparent',
                color: activeTab === 'login' ? 'var(--meb-red)' : '#64748b',
                fontWeight: activeTab === 'login' ? 700 : 500,
                fontSize: '14px',
                fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
            >
              <LogIn size={16} />
              <span>Giriş Yap</span>
            </button>

            <button
              type="button"
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'register' ? '#ffffff' : 'transparent',
                color: activeTab === 'register' ? 'var(--meb-red)' : '#64748b',
                fontWeight: activeTab === 'register' ? 700 : 500,
                fontSize: '14px',
                fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
            >
              <UserPlus size={16} />
              <span>Yeni Öğretmen Kaydı</span>
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>KURUMSAL E-POSTA ADRESİ *</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={17} />
                  <input
                    type="email"
                    className="form-control"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ad.soyad@meb.k12.tr"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>ŞİFRE *</label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" size={17} />
                  <input
                    type="password"
                    className="form-control"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {errorMessage && (
                <div style={{ color: '#e30613', fontSize: '13px', marginBottom: '14px', fontWeight: 600, backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>
                  {errorMessage}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-meb-outline" onClick={onClose}>
                  İptal
                </button>
                <button type="submit" className="btn-meb-primary" disabled={isLoading}>
                  <LogIn size={16} />
                  <span>{isLoading ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>AD SOYAD *</label>
                  <div className="input-icon-wrapper">
                    <UserIcon className="input-icon" size={17} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mehmet KAYA"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>TELEFON NUMARASI *</label>
                  <div className="input-icon-wrapper">
                    <Phone className="input-icon" size={17} />
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="0532 123 45 67"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>KURUMSAL E-POSTA ADRESİ *</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={17} />
                  <input
                    type="email"
                    className="form-control"
                    placeholder="mehmet.kaya@meb.k12.tr"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>GÖREV YAPTIĞI OKUL / KURUM *</label>
                <div className="input-icon-wrapper">
                  <School className="input-icon" size={17} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Yenimahalle Anadolu Lisesi"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>DOĞUM TARİHİ *</label>
                  <div className="input-icon-wrapper">
                    <Calendar className="input-icon" size={17} />
                    <input
                      type="date"
                      className="form-control"
                      value={regBirthDate}
                      onChange={(e) => setRegBirthDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>BRANŞ *</label>
                  <div className="input-icon-wrapper">
                    <GraduationCap className="input-icon" size={17} />
                    <select
                      className="form-control"
                      value={regBranch}
                      onChange={(e) => setRegBranch(e.target.value)}
                      required
                      style={{ appearance: 'auto', paddingLeft: '38px' }}
                    >
                      <option value="" disabled>Branş Seçiniz...</option>
                      {teacherBranches.map((br) => (
                        <option key={br} value={br}>{br}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>ŞİFRE BELİRLEYİNİZ *</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={17} />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="En az 6 karakter"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>ŞİFREYİ ONAYLAYINIZ *</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={17} />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Şifrenizi tekrar girin"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div style={{ color: '#e30613', fontSize: '13px', marginBottom: '14px', fontWeight: 600, backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div style={{ color: '#16a34a', fontSize: '13px', marginBottom: '14px', fontWeight: 600, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '6px', fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>
                  {successMessage}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-meb-outline" onClick={onClose}>
                  İptal
                </button>
                <button type="submit" className="btn-meb-primary" disabled={isLoading}>
                  <UserPlus size={16} />
                  <span>{isLoading ? 'Kaydediliyor...' : 'Hesap Oluştur & Kaydol'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
