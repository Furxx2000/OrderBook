import { LastPriceState } from '@/app/hooks/useTradeStream';
import { formatNumberWithCommas } from '@/app/lib/utils';
import { ArrowIcon } from '../icons/ArrowIcon';

const priceColors = {
  up: 'text-[#00b15b]',
  down: 'text-[#ff5B5A]',
  same: 'text-[#F0F4F8]',
};

export const LastPriceDisplay = ({
  priceInfo,
}: {
  priceInfo: LastPriceState;
}) => {
  const colorClass = priceColors[priceInfo.direction];

  if (!priceInfo.current) {
    return <div className='text-xl font-bold my-2 text-center h-[28px]'>-</div>;
  }

  return (
    <div
      className={`flex items-center justify-center text-xl font-bold my-2 h-[28px] transition-colors duration-200 ${colorClass}`}
    >
      <span>{formatNumberWithCommas(priceInfo.current)}</span>

      <span className='ml-2'>
        <ArrowIcon direction={priceInfo.direction} />
      </span>

      {/* {priceInfo.direction !== 'same' && (
        <span className='ml-2'>
          <ArrowIcon direction={priceInfo.direction} />
        </span>
      )} */}
    </div>
  );
};
