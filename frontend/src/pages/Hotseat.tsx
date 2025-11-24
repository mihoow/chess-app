import { Board } from '../components/Board';
import { ThemeSelector } from '../components/ThemeSelector';
import { Toolbar } from '../components/Toolbar';

export function Hotseat() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='relative'>
        <Toolbar
          className='absolute bottom-full -translate-y-8 w-full'
          sideToMove='white'
          onPrev={() => console.log('prev')}
          onNext={() => console.log('next')}
          onReset={() => console.log('reset game')}
        />
        <ThemeSelector className='absolute left-full translate-x-8' />
        <Board />
      </div>
    </div>
  );
}
