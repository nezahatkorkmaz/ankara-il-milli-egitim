import React, { useState, useEffect } from 'react';
import { User, DigitalStoryCard } from './types';
import { sampleDigitalCards } from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CardGallery } from './components/CardGallery';
import { ProjectReportView } from './components/ProjectReportView';
import { LoginModal } from './components/LoginModal';
import { StoryUploadModal } from './components/StoryUploadModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { Toast, ToastMessage } from './components/Toast';
import { fetchStoriesFromFirestore } from './firebase';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('meb_portal_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [cards, setCards] = useState<DigitalStoryCard[]>(() => {
    const savedCards = localStorage.getItem('meb_portal_cards');
    if (savedCards) {
      try {
        return JSON.parse(savedCards);
      } catch (e) {
        return sampleDigitalCards;
      }
    }
    return sampleDigitalCards;
  });

  const [activeTab, setActiveTab] = useState<'gallery' | 'report'>('gallery');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch live stories from Firestore on page load
  useEffect(() => {
    const loadLiveStories = async () => {
      try {
        const firestoreStories = await fetchStoriesFromFirestore();
        if (firestoreStories && firestoreStories.length > 0) {
          // Merge unique firestore stories with initial sample cards
          setCards((prev) => {
            const firestoreIds = new Set(firestoreStories.map((s) => s.id));
            const existingNonFirestore = prev.filter((c) => !firestoreIds.has(c.id));
            return [...firestoreStories, ...existingNonFirestore];
          });
        }
      } catch (err) {
        console.warn('Live stories fetch notice:', err);
      }
    };

    loadLiveStories();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('meb_portal_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('meb_portal_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('meb_portal_cards', JSON.stringify(cards));
  }, [cards]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    addToast(`Hoş geldiniz Sayın ${user.name}! Öğretmen girişi başarılı.`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addToast('Öğretmen oturumu kapatıldı.', 'info');
  };

  const handleCardViewCountIncrement = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === cardId ? { ...c, viewsCount: c.viewsCount + 1 } : c
      )
    );
  };

  const handleUploadSuccess = (newCard: DigitalStoryCard) => {
    setCards((prevCards) => [newCard, ...prevCards]);
    setActiveTab('gallery');
    addToast('1 sayfalık dijital kültür afişiniz başarıyla yayınlandı!', 'success');
  };

  const handleOpenUploadModal = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      addToast('Afiş yükleyebilmek için lütfen öğretmen girişi yapınız.', 'info');
    } else {
      setIsUploadModalOpen(true);
    }
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    addToast('Profil bilgileriniz güncellendi.', 'success');
  };

  const handleDeleteStory = (storyId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== storyId));
    addToast('Afiş portalımızdan silindi.', 'info');
  };

  const handleUpdateStory = (updatedStory: DigitalStoryCard) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedStory.id ? updatedStory : c))
    );
    addToast('Afiş bilgileri başarıyla güncellendi.', 'success');
  };

  const handleSearchFromHeader = (query: string) => {
    setSearchQuery(query);
    if (activeTab !== 'gallery') {
      setActiveTab('gallery');
    }
  };

  return (
    <div className="site-page-wrapper">
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenUploadModal={handleOpenUploadModal}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchFromHeader}
      />

      <main style={{ flexGrow: 1 }}>
        {activeTab === 'gallery' ? (
          <CardGallery
            cards={cards}
            onCardView={handleCardViewCountIncrement}
            onOpenUpload={handleOpenUploadModal}
            isLoggedIn={!!currentUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToast={addToast}
          />
        ) : (
          <ProjectReportView />
        )}
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {currentUser && (
        <>
          <StoryUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            currentUser={currentUser}
            onUploadSuccess={handleUploadSuccess}
          />

          <TeacherProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            currentUser={currentUser}
            teacherStories={cards}
            onOpenUploadModal={handleOpenUploadModal}
            onProfileUpdate={handleProfileUpdate}
            onDeleteStory={handleDeleteStory}
            onUpdateStory={handleUpdateStory}
          />
        </>
      )}
    </div>
  );
};

export default App;
