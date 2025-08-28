import usePrevious from '@/app/hooks/usePrevious';
import QuoteRow from './QuoteRow';

interface QuoteTableProps {
  quotes: [string, string][];
  isBid: boolean;
}

export type AnimationType = 'new' | 'size-up' | 'size-down' | null;

const QuoteTable = ({ quotes, isBid }: QuoteTableProps) => {
  const prevQuotes = usePrevious(quotes);
  const prevQuotesMap = new Map(prevQuotes || []);

  let cumulativeTotal = 0;

  const quotesWithTotal = quotes.map(([price, size]) => {
    cumulativeTotal += Number(size);
    const prevSize = prevQuotesMap.get(price);
    let animation: AnimationType = null;

    if (prevSize === undefined) {
      animation = 'new';
    } else if (prevSize !== size) {
      animation = Number(size) > Number(prevSize) ? 'size-up' : 'size-down';
    }

    return {
      price,
      size,
      total: cumulativeTotal.toString(),
      animation,
    };
  });

  const totalSizeOfVisibleQuotes = cumulativeTotal;
  const displayQuotes = isBid
    ? quotesWithTotal
    : [...quotesWithTotal].reverse();

  return (
    <div>
      <div className='grid grid-cols-3 w-full text-right text-[#8698aa] text-xs pr-4 mb-1 font-sans'>
        <span>價格 (USD)</span>
        <span>數量</span>
        <span>總計</span>
      </div>

      {displayQuotes.map(({ price, size, total, animation }) => (
        <QuoteRow
          key={price}
          price={price}
          size={size}
          total={total}
          isBid={isBid}
          percentage={
            totalSizeOfVisibleQuotes > 0
              ? (Number(total) / totalSizeOfVisibleQuotes) * 100
              : 0
          }
          animationType={animation}
        />
      ))}
    </div>
  );
};

export default QuoteTable;
