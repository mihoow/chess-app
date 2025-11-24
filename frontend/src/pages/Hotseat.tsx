import { Board } from '../components/Board';
import { ThemeSelector } from '../components/ThemeSelector';
import { Toolbar } from '../components/Toolbar';
import { HotseatProvider } from '../context/Hotseat.provider';

export function Hotseat() {
  return (
    <HotseatProvider>
      <div className='w-screen h-screen flex items-center justify-center'>
        <div className='relative'>
          <Toolbar
            className='absolute bottom-full -translate-y-8 w-full'
            onPrev={() => console.log('prev')}
            onNext={() => console.log('next')}
          />
          <ThemeSelector className='absolute left-full translate-x-8' />
          <Board />
        </div>
      </div>
    </HotseatProvider>
  );
}
