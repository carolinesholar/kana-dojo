'use client';
import useCalligraphyStore from '@/features/Calligraphy/store/useCalligraphyStore';

interface StatsPanelProps {
  layout?: 'horizontal' | 'vertical';
  compact?: boolean;
}

const StatsPanel = ({
  layout = 'vertical',
  compact = false
}: StatsPanelProps) => {
  const correctStrokes = useCalligraphyStore(state => state.correctStrokes);
  const missedStrokes = useCalligraphyStore(state => state.missedStrokes);
  const completedCharacters = useCalligraphyStore(
    state => state.completedCharacters
  );
  const selectedKanaType = useCalligraphyStore(state => state.selectedKanaType);

  const totalCharacters = 46; // Both hiragana and katakana have 46 basic characters
  const accuracy =
    correctStrokes + missedStrokes > 0
      ? Math.round((correctStrokes / (correctStrokes + missedStrokes)) * 100)
      : 0;

  if (layout === 'horizontal') {
    return (
      <div className='flex items-center gap-4 sm:gap-6 text-xs sm:text-sm'>
        <div>
          <span className='text-[var(--secondary-color)]'>Correct: </span>
          <span className='text-green-500 font-medium'>{correctStrokes}</span>
        </div>
        <div>
          <span className='text-[var(--secondary-color)]'>Missed: </span>
          <span className='text-red-500 font-medium'>{missedStrokes}</span>
        </div>
        <div>
          <span className='text-[var(--secondary-color)]'>Progress: </span>
          <span className='text-[var(--main-color)] font-medium'>
            {completedCharacters.length}/{totalCharacters}
          </span>
        </div>
        <div>
          <span className='text-[var(--secondary-color)]'>Accuracy: </span>
          <span
            className={
              accuracy >= 80
                ? 'text-green-500 font-medium'
                : 'text-[var(--main-color)] font-medium'
            }
          >
            {accuracy}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-1.5' : 'space-y-2'}>
      {!compact && (
        <div className='text-xs text-[var(--secondary-color)] mb-2'>
          Session Stats
        </div>
      )}

      <div
        className={`rounded-lg bg-[var(--background-color)] border border-[var(--border-color)] ${compact ? 'p-2 flex justify-between items-center' : 'p-2.5'}`}
      >
        <div className='text-xs text-[var(--secondary-color)]'>Correct</div>
        <div
          className={`text-green-500 font-medium ${compact ? 'text-base' : 'text-lg'}`}
        >
          {correctStrokes}
        </div>
      </div>

      <div
        className={`rounded-lg bg-[var(--background-color)] border border-[var(--border-color)] ${compact ? 'p-2 flex justify-between items-center' : 'p-2.5'}`}
      >
        <div className='text-xs text-[var(--secondary-color)]'>Missed</div>
        <div
          className={`text-red-500 font-medium ${compact ? 'text-base' : 'text-lg'}`}
        >
          {missedStrokes}
        </div>
      </div>

      <div
        className={`rounded-lg bg-[var(--background-color)] border border-[var(--border-color)] ${compact ? 'p-2 flex justify-between items-center' : 'p-2.5'}`}
      >
        <div className='text-xs text-[var(--secondary-color)]'>Completed</div>
        <div
          className={`text-[var(--main-color)] font-medium ${compact ? 'text-base' : 'text-lg'}`}
        >
          {completedCharacters.length}/{totalCharacters}
        </div>
      </div>

      <div
        className={`rounded-lg bg-[var(--background-color)] border border-[var(--border-color)] ${compact ? 'p-2 flex justify-between items-center' : 'p-2.5'}`}
      >
        <div className='text-xs text-[var(--secondary-color)]'>Accuracy</div>
        <div
          className={`font-medium ${accuracy >= 80 ? 'text-green-500' : 'text-[var(--main-color)]'} ${compact ? 'text-base' : 'text-lg'}`}
        >
          {accuracy}%
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
