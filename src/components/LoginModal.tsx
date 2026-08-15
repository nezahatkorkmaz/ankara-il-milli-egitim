import React, { useState } from 'react';
import { User } from '../types';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  School, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  LogIn, 
  UserPlus,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { registerTeacher, loginTeacher, resetTeacherPassword } from '../firebase';

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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset'>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Reset Form State
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // Register Form State
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [branch, setBranch] = useState('Tarih Öğretmeni');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (!loginEmail.trim() || !loginPassword) {
        setErrorMessage('Lütfen e-posta ve şifrenizi giriniz.');
        setIsLoading(false);
        return;
      }

      const user = await loginTeacher(loginEmail, loginPassword);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      setErrorMessage('Giriş yapılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetSuccessMessage('');

    if (!resetEmail.trim()) {
      setErrorMessage('Lütfen kurumsal e-posta adresinizi giriniz.');
      return;
    }

    setIsLoading(true);
    try {
      await resetTeacherPassword(resetEmail);
      setResetSuccessMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı ve gerekiyorsa gereksiz (Spam) kutunuzu kontrol ediniz.');
    } catch (err) {
      console.error(err);
      setErrorMessage('Şifre sıfırlama e-postası gönderilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Lütfen Ad ve Soyad alanını doldurunuz.');
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setErrorMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Lütfen telefon numaranızı giriniz.');
      return;
    }
    if (!school.trim()) {
      setErrorMessage('Lütfen görev yaptığınız okulu giriniz.');
      return;
    }
    if (!registerPassword || registerPassword.length < 6) {
      setErrorMessage('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setErrorMessage('Girdiğiniz şifreler birbiriyle eşleşmiyor. Lütfen kontrol ediniz.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await registerTeacher({
        fullName: fullName.trim(),
        email: registerEmail.trim(),
        phone: phone.trim(),
        school: school.trim(),
        birthDate: birthDate,
        branch: branch,
        password: registerPassword
      });

      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      setErrorMessage('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
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
          {activeTab !== 'reset' && (
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
          )}

          {activeTab === 'login' && (
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

              <div className="form-group" style={{ marginBottom: '8px' }}>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('reset'); setErrorMessage(''); setResetSuccessMessage(''); setResetEmail(loginEmail); }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--meb-red)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <KeyRound size={14} />
                  <span>Şifremi Unuttum?</span>
                </button>
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
                  {isLoading ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'reset' && (
            <form onSubmit={handleResetSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>
                <KeyRound size={18} color="var(--meb-red)" />
                <span>Şifre Sıfırlama Bağlantısı İste</span>
              </div>

              <p style={{ fontSize: '13.5px', color: '#475569', marginBottom: '16px', lineHeight: 1.4, fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>
                Hesabınıza kayıtlı e-posta adresinizi giriniz. Güvenli şifre yenileme bağlantısı adresinize e-posta olarak gönderilecektir.
              </p>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>KURUMSAL E-POSTA ADRESİ *</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={17} />
                  <input
                    type="email"
                    className="form-control"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="ad.soyad@meb.k12.tr"
                    required
                  />
                </div>
              </div>

              {resetSuccessMessage && (
                <div style={{ color: '#166534', fontSize: '13px', marginBottom: '14px', fontWeight: 600, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 14px', borderRadius: '6px', fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>
                  {resetSuccessMessage}
                </div>
              )}

              {errorMessage && (
                <div style={{ color: '#e30613', fontSize: '13px', marginBottom: '14px', fontWeight: 600, backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>
                  {errorMessage}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <button type="button" className="btn-meb-outline" onClick={() => { setActiveTab('login'); setErrorMessage(''); }}>
                  <ArrowLeft size={15} />
                  <span>Giriş Ekranına Dön</span>
                </button>
                <button type="submit" className="btn-meb-primary" disabled={isLoading}>
                  {isLoading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="grid-2col-responsive" style={{ marginBottom: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>AD SOYAD *</label>
                  <div className="input-icon-wrapper">
                    <UserIcon className="input-icon" size={17} />
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Örn: Zeynep YILMAZ"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>E-POSTA ADRESİ *</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={17} />
                  <input
                    type="email"
                    className="form-control"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="ad.soyad@meb.k12.tr"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>GÖREV YAPTIĞI OKUL / KURUM *</label>
                <div className="input-icon-wrapper">
                  <School className="input-icon" size={17} />
                  <input
                    type="text"
                    className="form-control"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Örn: Çankaya Şehit Ali İhsan Okul Kompleksi"
                    required
                  />
                </div>
              </div>

              <div className="grid-2col-responsive" style={{ marginBottom: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>BRANŞ *</label>
                  <div className="input-icon-wrapper">
                    <GraduationCap className="input-icon" size={17} />
                    <select
                      className="form-control"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                    >
                      {TEACHER_BRANCHES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>DOĞUM TARİHİ</label>
                  <div className="input-icon-wrapper">
                    <Calendar className="input-icon" size={17} />
                    <input
                      type="date"
                      className="form-control"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-2col-responsive" style={{ marginBottom: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>ŞİFRE OLUŞTUR *</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={17} />
                    <input
                      type="password"
                      className="form-control"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="En az 6 karakter"
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>ŞİFREYİ ONAYLAYIN *</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={17} />
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Şifreyi tekrar yazın"
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn-meb-outline" onClick={onClose}>
                  İptal
                </button>
                <button type="submit" className="btn-meb-primary" disabled={isLoading}>
                  {isLoading ? 'Kayıt Yapılıyor...' : 'Hesap Oluştur & Kaydol'}
                </button>
              </div>
            </form>
          )}

          {/* MEB Security Badge Footer Note */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', fontSize: '11.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'MYRIAD PRO', 'Myriad Pro', sans-serif" }}>
            <CheckCircle2 size={14} color="#16a34a" />
            <span>Kişisel verileriniz KVKK ve MEB Güvenlik Politikaları gereğince korunmaktadır.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
