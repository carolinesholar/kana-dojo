'use client';
import { useEffect } from 'react';
import clsx from 'clsx';
import useCalligraphyStore from '@/features/Calligraphy/store/useCalligraphyStore';
import { hiraganaData } from '@/features/Calligraphy/data/hiraganaStrokes';
import { katakanaData } from '@/features/Calligraphy/data/katakanaStrokes';
import Canvas from './Canvas';
import BrushSelector from './BrushSelector';
import StatsPanel from './StatsPanel';
import StrokeProgress from './StrokeProgress';
import HowToUseModal from './HowToUseModal';
import WrongStrokeOverlay from './WrongStrokeOverlay';
import CelebrationOverlay from './CelebrationOverlay';

// Step configuration
const STEPS = [
  { id: 1, titleEn: 'SELECT CHARACTER', titleJp: '文字を選ぶ' },
  { id: 2, titleEn: 'CHOOSE BRUSH', titleJp: '筆を選ぶ' },
  { id: 3, titleEn: 'STROKE-BY-STROKE', titleJp: '練習' }
];

const CalligraphyPage = () => {
  // Store state
  const selectedKanaType = useCalligraphyStore(state => state.selectedKanaType);
  const setSelectedKanaType = useCalligraphyStore(
    state => state.setSelectedKanaType
  );
  const selectedCharacter = useCalligraphyStore(
    state => state.selectedCharacter
  );
  const setSelectedCharacter = useCalligraphyStore(
    state => state.setSelectedCharacter
  );
  const setShowHowToUse = useCalligraphyStore(state => state.setShowHowToUse);
  const showGuide = useCalligraphyStore(state => state.showGuide);
  const toggleGuide = useCalligraphyStore(state => state.toggleGuide);
  const currentStrokeIndex = useCalligraphyStore(
    state => state.currentStrokeIndex
  );
  const completedCharacters = useCalligraphyStore(
    state => state.completedCharacters
  );
  const resetStrokes = useCalligraphyStore(state => state.resetStrokes);
  const activeStep = useCalligraphyStore(state => state.activeStep);
  const setActiveStep = useCalligraphyStore(state => state.setActiveStep);

  const characterData =
    selectedKanaType === 'hiragana' ? hiraganaData : katakanaData;
  const totalStrokes = selectedCharacter?.strokes?.length || 0;

  // Set default character on mount
  useEffect(() => {
    if (!selectedCharacter) {
      const data =
        selectedKanaType === 'hiragana' ? hiraganaData : katakanaData;
      if (data.length > 0) {
        setSelectedCharacter(data[0]);
      }
    }
  }, [selectedCharacter, selectedKanaType, setSelectedCharacter]);

  // Get next character
  const getNextCharacter = () => {
    if (!selectedCharacter) return null;
    const currentIndex = characterData.findIndex(
      c => c.character === selectedCharacter.character
    );
    if (currentIndex < characterData.length - 1) {
      return characterData[currentIndex + 1];
    }
    return characterData[0];
  };

  const nextChar = getNextCharacter();

  // Handle character selection
  const handleSelectCharacter = (char: (typeof characterData)[0]) => {
    setSelectedCharacter(char);
    resetStrokes();
    setActiveStep(2); // Move to brush selection
  };

  // Handle clear and undo
  const handleClear = () => {
    window.dispatchEvent(new CustomEvent('calligraphy:clear'));
  };

  const handleUndo = () => {
    window.dispatchEvent(new CustomEvent('calligraphy:undo'));
  };

  // ============================================
  // FRAME 0: Default - 3 Vertical Bars Centered
  // ============================================
  if (activeStep === 0) {
    return (
      <div className='min-h-[100dvh] flex flex-col'>
        {/* Header */}
        <header className='flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--card-color)]'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>🥷</span>
            <div>
              <h1 className='font-semibold text-[var(--main-color)]'>
                かな道場
              </h1>
              <p className='text-xs text-[var(--secondary-color)]'>
                Japanese Calligraphy Practice
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHowToUse(true)}
            className='px-3 py-2 rounded-xl text-[var(--secondary-color)] text-sm hover:text-[var(--main-color)] transition-colors'
          >
            ? Guide
          </button>
        </header>

        {/* Main - 3 Vertical Bars */}
        <div className='flex-1 flex items-center justify-center p-8'>
          <div className='flex items-center justify-center gap-8'>
            {STEPS.map(step => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className='w-28 h-72 bg-[var(--card-color)] hover:bg-[var(--background-color)] rounded-2xl border border-[var(--border-color)] hover:border-[var(--main-color)] flex flex-col items-center justify-center relative transition-all'
              >
                <div
                  className='text-[11px] font-medium text-[var(--secondary-color)] tracking-wider text-center'
                  style={{ writingMode: 'vertical-lr' }}
                >
                  {step.titleEn}
                </div>
                <div
                  className='text-[9px] text-[var(--secondary-color)] mt-1 opacity-60'
                  style={{ writingMode: 'vertical-lr' }}
                >
                  {step.titleJp}
                </div>
                <div className='w-9 h-9 rounded-full bg-[var(--background-color)] border border-[var(--border-color)] text-[var(--secondary-color)] flex items-center justify-center font-semibold absolute bottom-5'>
                  {step.id}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modals */}
        <HowToUseModal />
      </div>
    );
  }

  // ============================================
  // FRAME 1: Step 1 Active - Select Character
  // ============================================
  if (activeStep === 1) {
    return (
      <div className='min-h-[100dvh] flex flex-col'>
        {/* Header */}
        <header className='flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--card-color)]'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>🥷</span>
            <div>
              <h1 className='font-semibold text-[var(--main-color)]'>
                かな道場
              </h1>
              <p className='text-xs text-[var(--secondary-color)]'>
                Japanese Calligraphy Practice
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHowToUse(true)}
            className='px-3 py-2 rounded-xl text-[var(--secondary-color)] text-sm hover:text-[var(--main-color)] transition-colors'
          >
            ? Guide
          </button>
        </header>

        {/* Main Content */}
        <div className='flex-1 p-4 flex flex-col gap-3 max-w-5xl mx-auto w-full'>
          {/* Top: Step 2 bar */}
          <button
            onClick={() => setActiveStep(2)}
            className='h-12 bg-[var(--card-color)] rounded-xl flex items-center justify-between px-4 border border-[var(--border-color)] hover:border-[var(--main-color)] transition-colors'
          >
            <div className='flex items-center gap-3'>
              <div className='w-7 h-7 rounded-full bg-[var(--background-color)] border border-[var(--border-color)] text-[var(--secondary-color)] flex items-center justify-center text-sm font-medium'>
                2
              </div>
              <span className='text-sm text-[var(--secondary-color)]'>
                CHOOSE BRUSH
              </span>
              <span className='text-xs text-[var(--secondary-color)] opacity-60'>
                筆を選ぶ
              </span>
            </div>
            <svg
              className='w-4 h-4 text-[var(--secondary-color)]'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>

          {/* Middle: Step 1 bar + Content */}
          <div className='flex-1 flex gap-3'>
            {/* Step 1 Vertical Bar (Active) */}
            <div className='w-16 bg-[var(--card-color)] border-2 border-[var(--main-color)] rounded-xl flex flex-col items-center justify-center py-4 relative'>
              <div
                className='text-[10px] font-medium text-[var(--main-color)] tracking-wider'
                style={{ writingMode: 'vertical-lr' }}
              >
                SELECT CHARACTER
              </div>
              <div
                className='text-[8px] text-[var(--secondary-color)] mt-1'
                style={{ writingMode: 'vertical-lr' }}
              >
                文字を選ぶ
              </div>
              <div className='w-7 h-7 rounded-full bg-[var(--main-color)] text-[var(--background-color)] flex items-center justify-center font-medium text-sm absolute bottom-3'>
                1
              </div>
            </div>

            {/* Content: Character Selection */}
            <div className='flex-1 bg-[var(--card-color)] rounded-xl border border-[var(--border-color)] p-4 overflow-auto'>
              {/* Toggle */}
              <div className='flex justify-center mb-5'>
                <div className='inline-flex bg-[var(--background-color)] rounded-xl p-1 border border-[var(--border-color)]'>
                  <button
                    onClick={() => setSelectedKanaType('hiragana')}
                    className={clsx(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                      selectedKanaType === 'hiragana'
                        ? 'bg-[var(--main-color)] text-[var(--background-color)]'
                        : 'text-[var(--secondary-color)] hover:text-[var(--main-color)]'
                    )}
                  >
                    ひらがな Hiragana
                    <span className='text-xs opacity-70 ml-1'>0/46</span>
                  </button>
                  <button
                    onClick={() => setSelectedKanaType('katakana')}
                    className={clsx(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                      selectedKanaType === 'katakana'
                        ? 'bg-[var(--main-color)] text-[var(--background-color)]'
                        : 'text-[var(--secondary-color)] hover:text-[var(--main-color)]'
                    )}
                  >
                    カタカナ Katakana
                    <span className='text-xs opacity-70 ml-1'>0/46</span>
                  </button>
                </div>
              </div>

              {/* Character Grid - Square cards */}
              <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-w-3xl mx-auto'>
                {characterData.map(char => {
                  const isSelected =
                    selectedCharacter?.character === char.character;
                  const isCompleted = completedCharacters.includes(
                    char.character
                  );

                  return (
                    <button
                      key={char.character}
                      onClick={() => handleSelectCharacter(char)}
                      className={clsx(
                        'aspect-square rounded-xl font-japanese text-2xl sm:text-3xl flex items-center justify-center transition-all',
                        isSelected
                          ? 'bg-[var(--main-color)]/20 border-2 border-[var(--main-color)] text-[var(--main-color)]'
                          : isCompleted
                            ? 'bg-green-500/10 border border-green-500/40 text-green-500'
                            : 'bg-[var(--background-color)] border border-[var(--border-color)] text-[var(--main-color)] hover:border-[var(--main-color)]'
                      )}
                    >
                      {char.character}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom: Step 3 bar (disabled) */}
          <div className='h-12 bg-[var(--card-color)] rounded-xl flex items-center justify-between px-4 border border-[var(--border-color)] opacity-50'>
            <div className='flex items-center gap-3'>
              <div className='w-7 h-7 rounded-full bg-[var(--background-color)] border border-[var(--border-color)] text-[var(--secondary-color)] flex items-center justify-center text-sm font-medium'>
                3
              </div>
              <span className='text-sm text-[var(--secondary-color)]'>
                STROKE-BY-STROKE
              </span>
              <span className='text-xs text-[var(--secondary-color)] opacity-60'>
                練習
              </span>
            </div>
            <svg
              className='w-4 h-4 text-[var(--secondary-color)]'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
        </div>

        {/* Modals */}
        <HowToUseModal />
      </div>
    );
  }

  // ============================================
  // FRAME 2: Step 2 Active - Choose Brush
  // ============================================
  if (activeStep === 2) {
    return (
      <div className='min-h-[100dvh] flex flex-col'>
        {/* Header */}
        <header className='flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--card-color)]'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>🥷</span>
            <div>
              <h1 className='font-semibold text-[var(--main-color)]'>
                かな道場
              </h1>
              <p className='text-xs text-[var(--secondary-color)]'>
                Japanese Calligraphy Practice
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHowToUse(true)}
            className='px-3 py-2 rounded-xl text-[var(--secondary-color)] text-sm hover:text-[var(--main-color)] transition-colors'
          >
            ? Guide
          </button>
        </header>

        {/* Main Content */}
        <div className='flex-1 p-4 flex flex-col gap-3 max-w-5xl mx-auto w-full'>
          {/* Top: Step 2 (Active - Brush Selection) */}
          <div className='bg-[var(--card-color)] border-2 border-[var(--main-color)] rounded-xl p-4'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-7 h-7 rounded-full bg-[var(--main-color)] text-[var(--background-color)] flex items-center justify-center text-sm font-medium'>
                2
              </div>
              <span className='text-sm font-medium text-[var(--main-color)]'>
                CHOOSE BRUSH
              </span>
              <span className='text-xs text-[var(--secondary-color)]'>
                筆を選ぶ
              </span>
            </div>

            {/* Brush Options */}
            <div className='flex gap-3 justify-center'>
              <BrushSelector showLabels={true} size='md' />
            </div>
          </div>

          {/* Middle */}
          <div className='flex-1 flex gap-3'>
            {/* Step 1 Collapsed */}
            <button
              onClick={() => setActiveStep(1)}
              className='w-20 bg-[var(--card-color)] rounded-xl flex flex-col items-center justify-center py-4 border border-[var(--border-color)] hover:border-[var(--main-color)] transition-colors'
            >
              <div className='text-4xl font-japanese text-[var(--main-color)]'>
                {selectedCharacter?.character || 'あ'}
              </div>
              <p className='text-[9px] text-[var(--secondary-color)] mt-1'>
                {selectedKanaType === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </p>
              <p className='text-[8px] text-[var(--secondary-color)] opacity-60'>
                Next: {nextChar?.character || 'い'}
              </p>
              <div className='w-6 h-6 rounded-full bg-[var(--background-color)] border border-[var(--border-color)] text-[var(--secondary-color)] flex items-center justify-center text-[10px] font-medium mt-2'>
                1
              </div>
            </button>

            {/* Step 3 - Let's Start */}
            <div className='flex-1 flex items-center justify-center'>
              <button
                onClick={() => setActiveStep(3)}
                className='px-12 py-8 bg-[var(--card-color)] hover:bg-[var(--background-color)] rounded-2xl text-center border border-[var(--border-color)] hover:border-[var(--main-color)] transition-all'
              >
                <div className='w-14 h-14 rounded-full bg-[var(--background-color)] border border-[var(--border-color)] text-[var(--secondary-color)] flex items-center justify-center font-bold text-xl mx-auto mb-3'>
                  3
                </div>
                <p className='font-medium text-[var(--main-color)] text-lg'>
                  STROKE-BY-STROKE
                </p>
                <p className='text-[var(--secondary-color)] text-sm mt-1'>
                  練習 • Let's Start →
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <HowToUseModal />
      </div>
    );
  }

  // ============================================
  // FRAME 3: Step 3 Active - Practice Canvas
  // ============================================
  return (
    <div className='min-h-[100dvh] flex flex-col'>
      {/* Header */}
      <header className='flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--card-color)]'>
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>🥷</span>
          <div>
            <h1 className='font-semibold text-[var(--main-color)]'>かな道場</h1>
            <p className='text-xs text-[var(--secondary-color)]'>
              Japanese Calligraphy Practice
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHowToUse(true)}
          className='px-3 py-2 rounded-xl text-[var(--secondary-color)] text-sm hover:text-[var(--main-color)] transition-colors'
        >
          ? Guide
        </button>
      </header>

      {/* Main Content */}
      <div className='flex-1 p-3 flex flex-col gap-2 max-w-6xl mx-auto w-full'>
        {/* Top: Step 2 Collapsed (Clickable to go back) */}
        <button
          onClick={() => setActiveStep(2)}
          className='h-11 bg-[var(--card-color)] rounded-xl flex items-center justify-between px-4 border border-[var(--border-color)] hover:border-[var(--main-color)] transition-colors'
        >
          <div className='flex items-center gap-3'>
            <div className='w-6 h-6 rounded-full bg-[var(--background-color)] border border-[var(--border-color)] text-[var(--secondary-color)] flex items-center justify-center text-xs font-medium'>
              2
            </div>
            <BrushSelector showLabels={false} size='sm' />
          </div>
          <span className='text-xs text-[var(--secondary-color)]'>
            Click to change
          </span>
        </button>

        {/* Main Area */}
        <div className='flex-1 flex gap-2'>
          {/* Left: Step 1 Collapsed (Clickable to go back) */}
          <button
            onClick={() => setActiveStep(1)}
            className='w-16 bg-[var(--card-color)] rounded-xl flex flex-col items-center justify-center py-3 border border-[var(--border-color)] hover:border-[var(--main-color)] transition-colors'
          >
            <div className='text-3xl font-japanese text-[var(--main-color)]'>
              {selectedCharacter?.character || 'あ'}
            </div>
            <p className='text-[8px] text-[var(--secondary-color)]'>
              {selectedKanaType === 'hiragana' ? 'Hiragana' : 'Katakana'}
            </p>
            <p className='text-[7px] text-[var(--secondary-color)] opacity-60'>
              Next: {nextChar?.character || 'い'}
            </p>
            <div className='w-5 h-5 rounded-full bg-[var(--background-color)] border border-[var(--border-color)] text-[var(--secondary-color)] flex items-center justify-center text-[9px] font-medium mt-1'>
              1
            </div>
            <p className='text-[7px] text-[var(--main-color)] mt-1'>Change</p>
          </button>

          {/* Center: Canvas + Step 3 bar below */}
          <div className='flex-1 flex flex-col'>
            {/* Instruction */}
            <div className='bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 mb-2 flex items-center gap-2'>
              <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              <p className='text-sm text-green-600'>
                Start from the green dot and follow the path
              </p>
              <span className='ml-auto text-xs text-[var(--secondary-color)]'>
                Stroke {currentStrokeIndex + 1} of {totalStrokes || 3}
              </span>
            </div>

            {/* Canvas */}
            <div className='flex-1 min-h-[300px]'>
              <Canvas />
            </div>

            {/* Bottom: Step 3 Bar (Below canvas) */}
            <div className='h-12 bg-[var(--card-color)] rounded-xl flex items-center justify-between px-4 border-2 border-[var(--main-color)] mt-2'>
              <div className='flex items-center gap-3'>
                <div className='w-7 h-7 rounded-full bg-[var(--main-color)] text-[var(--background-color)] flex items-center justify-center text-sm font-medium'>
                  3
                </div>
                <span className='text-sm font-medium text-[var(--main-color)]'>
                  STROKE-BY-STROKE
                </span>
                <span className='text-xs text-[var(--secondary-color)]'>
                  練習
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={handleClear}
                  className='px-3 py-1.5 text-xs border border-[var(--border-color)] rounded-lg hover:border-[var(--main-color)] text-[var(--secondary-color)] hover:text-[var(--main-color)] transition-colors'
                >
                  Clear
                </button>
                <button
                  onClick={toggleGuide}
                  className={clsx(
                    'px-3 py-1.5 text-xs rounded-lg transition-colors',
                    showGuide
                      ? 'bg-[var(--main-color)] text-[var(--background-color)]'
                      : 'border border-[var(--border-color)] text-[var(--secondary-color)] hover:border-[var(--main-color)] hover:text-[var(--main-color)]'
                  )}
                >
                  Guide
                </button>
                <button
                  onClick={handleUndo}
                  className='px-3 py-1.5 text-xs border border-[var(--border-color)] rounded-lg hover:border-[var(--main-color)] text-[var(--secondary-color)] hover:text-[var(--main-color)] transition-colors'
                >
                  Undo
                </button>
              </div>
            </div>
          </div>

          {/* Right: Progress Panel */}
          <div className='w-48 bg-[var(--card-color)] rounded-xl border border-[var(--border-color)] p-3 flex flex-col'>
            <h3 className='text-xs font-medium text-[var(--secondary-color)] mb-2'>
              Progress
            </h3>

            {/* Stroke Progress */}
            <StrokeProgress />

            {/* Stats */}
            <div className='mt-3'>
              <StatsPanel layout='vertical' compact={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <HowToUseModal />
      <WrongStrokeOverlay />
      <CelebrationOverlay />
    </div>
  );
};

export default CalligraphyPage;
