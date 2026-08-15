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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

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
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
  };

  const handleOpenUploadModal = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
    } else {
      setIsUploadModalOpen(true);
    }
  };

  return (
    <div className="site-page-wrapper">
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenUploadModal={handleOpenUploadModal}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      <main style={{ flexGrow: 1 }}>
        {activeTab === 'gallery' ? (
          <CardGallery
            cards={cards}
            onCardView={handleCardViewCountIncrement}
            onOpenUpload={handleOpenUploadModal}
            isLoggedIn={!!currentUser}
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
          />
        </>
      )}
    </div>
  );
};

export default App;
