import React, { useState } from 'react';
import { User } from '../types';
import { defaultMockUsers } from '../data/initialData';
import { X, Lock, Mail, ShieldCheck, UserCheck } from 'lucide-react';

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
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(0);
  const [email, setEmail] = useState<string>(defaultMockUsers[0].email);
  const [password, setPassword] = useState<string>('123456');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPredefinedUser = (index: number) => {
    setSelectedUserIndex(index);
    setEmail(defaultMockUsers[index].email);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Lütfen T.C. Kimlik / E-Posta adresi ve şifrenizi giriniz.');
      return;
    }

    const matchedUser = defaultMockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.tcNo === email
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
      onClose();
    } else {
      const customUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        tcNo: '12345678901',
        email: email,
        role: 'teacher',
        school: 'İMKB Alpaslan İ.H. Ortaokulu',
        branch: 'Dijital Hikaye Eğitimi Katılımcısı',
        trainingCompleted: true,
      };
      onLoginSuccess(customUser);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="#c8102e" />
            <h3 className="modal-title">Öğretmen Girişi & Kimlik Doğrulama</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            Ankara İl Millî Eğitim Müdürlüğü Dijital Kültür Rotaları eğitimi alan öğretmenler sisteme giriş yaparak kendi ürettikleri 1 sayfalık dijital afişleri yükleyebilirler.
          </p>

          <div style={{ marginBottom: '20px', backgroundColor: '#f4f6f9', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: '#1f2937' }}>
              HIZLI DENEME HESABI SEÇİNİZ:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {defaultMockUsers.map((usr, idx) => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleSelectPredefinedUser(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: selectedUserIndex === idx ? '1.5px solid #c8102e' : '1px solid #d1d5db',
                    backgroundColor: selectedUserIndex === idx ? '#fff0f2' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <strong style={{ color: '#1f2937' }}>{usr.name}</strong> ({usr.branch})
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{usr.school}</div>
                  </div>
                  {selectedUserIndex === idx && <UserCheck size={16} color="#c8102e" />}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>T.C. KİMLİK NO VEYA KURUMSAL E-POSTA</label>
              <div className="search-input-wrap">
                <Mail className="search-icon-pos" size={18} />
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Örn: ayse.yilmaz@meb.k12.tr veya T.C. No"
                />
              </div>
            </div>

            <div className="form-group">
              <label>ŞİFRE</label>
              <div className="search-input-wrap">
                <Lock className="search-icon-pos" size={18} />
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMessage && (
              <div style={{ color: '#c8102e', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
                {errorMessage}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn-meb-outline" onClick={onClose}>
                İptal
              </button>
              <button type="submit" className="btn-meb-primary">
                Giriş Yap
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
