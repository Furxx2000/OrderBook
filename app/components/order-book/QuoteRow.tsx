import { formatNumberWithCommas } from '@/app/lib/utils';
import { AnimationType } from './QuoteTable';
import { useEffect, useState } from 'react';

interface QuoteRowProps {
  price: string;
  size: string;
  total: string;
  isBid: boolean;
  percentage: number;
  animationType: AnimationType;
}

const QuoteRow = ({
  price,
  size,
  total,
  isBid,
  percentage,
  animationType,
}: QuoteRowProps) => {
  const [rowAmin, setRowAnim] = useState('');
  const [sizeAnim, setSizeAnim] = useState('');

  useEffect(() => {
    if (!animationType) return;

    let timer: NodeJS.Timeout;

    if (animationType === 'new') {
      const animClass = isBid ? 'animate-flash-green' : 'animate-flash-red';
      setRowAnim(animClass);
      timer = setTimeout(() => setRowAnim(''), 500);
    } else {
      const animClass =
        animationType === 'size-up'
          ? 'animate-flash-green'
          : 'animate-flash-red';
      setSizeAnim(animClass);
      timer = setTimeout(() => setSizeAnim(''), 500);
    }

    return () => clearTimeout(timer);
  }, [animationType, isBid, price]);

  const priceColorClass = isBid ? 'text-[#00b15b]' : 'text-[#FF5B5A]';

  const barColor = isBid
    ? 'rgba(16, 186, 104, 0.12)'
    : 'rgba(255, 90, 90, 0.12)';

  return (
    <div
      className={`flex items-center h-7 text-sm hover:bg-[#1E3059] cursor-pointer font-mono ${rowAmin}`}
    >
      <div className='grid grid-cols-3 w-full text-right pr-4'>
        <span className={`${priceColorClass}`}>
          {formatNumberWithCommas(price)}
        </span>

        <span className={`rounded-sm ${sizeAnim}`}>
          {formatNumberWithCommas(size)}
        </span>

        <span className='relative'>
          <div
            className='absolute top-0 right-0 h-full'
            style={{
              width: `${percentage}%`,
              backgroundColor: barColor,
              transition: 'width 0.2s ease-in-out',
            }}
          />

          <span className='relative z-10'>{formatNumberWithCommas(total)}</span>
        </span>
      </div>
    </div>
  );
};

export default QuoteRow;
