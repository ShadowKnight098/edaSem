import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LessonContainer from './components/LessonContainer';
import PresentationView from './components/PresentationView';
import { LESSONS_DATA } from './data/lessonsData';

export default function App() {
  const [lessons] = useState(LESSONS_DATA);
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [visitedLessons, setVisitedLessons] = useState(new Set([1]));
  const [activeSectionId, setActiveSectionId] = useState('learning');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [presentationSectionIndex, setPresentationSectionIndex] = useState(0);

  const currentLesson =
    lessons.find((l) => l.id === currentLessonId) || lessons[0];

  // Track visited lessons
  const handleSelectLesson = (lessonId) => {
    setCurrentLessonId(lessonId);
    setVisitedLessons((prev) => new Set([...prev, lessonId]));
    setPresentationSectionIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to section
  const handleSelectSection = (sectionId) => {
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Next / Previous Lesson
  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex < lessons.length - 1) {
      const nextId = lessons[currentIndex + 1].id;
      handleSelectLesson(nextId);
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex > 0) {
      const prevId = lessons[currentIndex - 1].id;
      handleSelectLesson(prevId);
    }
  };

  // Hotkey listener for 'P' key to toggle presentation mode
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setIsPresentationMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased">
      {isPresentationMode ? (
        <PresentationView
          lesson={currentLesson}
          activeSectionIndex={presentationSectionIndex}
          setActiveSectionIndex={setPresentationSectionIndex}
          onPrevLesson={handlePrevLesson}
          onNextLesson={handleNextLesson}
          onClose={() => setIsPresentationMode(false)}
          totalLessons={lessons.length}
        />
      ) : (
        <div className="flex flex-1 min-h-screen">
          {/* Sidebar */}
          <Sidebar
            lessons={lessons}
            currentLessonId={currentLessonId}
            onSelectLesson={handleSelectLesson}
            visitedLessons={visitedLessons}
            activeSectionId={activeSectionId}
            onSelectSection={handleSelectSection}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isPresentationMode={isPresentationMode}
            setIsPresentationMode={setIsPresentationMode}
          />

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#0b0f19]">
            <Header
              currentLesson={currentLesson}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onTogglePresentation={setIsPresentationMode}
              totalLessons={lessons.length}
            />

            <div className="flex-1 pb-16">
              <LessonContainer
                lesson={currentLesson}
                onPrevLesson={handlePrevLesson}
                onNextLesson={handleNextLesson}
                isFirstLesson={currentLessonId === 1}
                isLastLesson={currentLessonId === lessons[lessons.length - 1].id}
              />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
