import IconArrowDown from '@/app/components/icons/IconArrowDown.svg';
import Image from 'next/image';

interface ArrowIconProps {
  direction: 'up' | 'down' | 'same';
  className?: string;
}

export const ArrowIcon = ({ direction, className }: ArrowIconProps) => {
  const transformClass = direction === 'up' ? 'rotate-180' : 'rotate-0';

  return (
    <svg
      className={`${transformClass} ${className}`}
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      role='presentation'
      fill='none'
      fill-rule='nonzero'
      stroke='currentColor'
      stroke-width='4'
      stroke-linecap='round'
      stroke-linejoin='round'
    >
      <line x1='12' y1='5' x2='12' y2='19'></line>
      <polyline points='19 12 12 19 5 12'></polyline>
    </svg>
  );
};
