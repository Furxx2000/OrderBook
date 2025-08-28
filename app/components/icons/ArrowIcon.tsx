import IconArrowDown from './IconArrowDown.svg';

interface ArrowIconProps {
  direction: 'up' | 'down';
  className?: string;
}

export const ArrowIcon = ({ direction, className }: ArrowIconProps) => {
  const transformClass = direction === 'up' ? 'rotate-180' : 'rotate-0';

  return (
    <IconArrowDown
      className={`w-4 h-4 inline-block transition-transform duration-200 ${transformClass} ${className}`}
    />
  );
};
