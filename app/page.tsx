'use client';

import { LastPriceDisplay } from './components/order-book/LastPriceDisplay';
import QuoteTable from './components/order-book/QuoteTable';
import { useOrderBookStream } from './hooks/useOrderBook';
import { useTradeStream } from './hooks/useTradeStream';
import { useMemo } from 'react';

export default function Home() {
  const { bids, asks, isLoading: isOrderBookLoading } = useOrderBookStream();
  const lastPriceInfo = useTradeStream();

  const sortedBids = useMemo(() => {
    return [...bids.entries()]
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .slice(0, 8);
  }, [bids]);

  const sortedAsks = useMemo(() => {
    return [...asks.entries()]
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .slice(0, 8);
  }, [asks]);

  if (isOrderBookLoading || lastPriceInfo.current == null) {
    return (
      <div className='bg-[#131B29] text-[#F0F4F8] min-h-screen flex items-center justify-center'>
        Loading data...
      </div>
    );
  }

  return (
    <main className='bg-[#131B29] text-[#F0F4F8] min-h-screen p-4 font-sans'>
      <div className='w-full max-w-xs mx-auto'>
        {/* 頁面標題 */}
        <h1 className='text-lg font-bold mb-2'>訂單簿</h1>
        <h2 className='text-sm text-[#8698aa] mb-4'>BTCPFC</h2>

        {/* 賣盤 (Asks) 表格 */}
        <QuoteTable quotes={sortedAsks} isBid={false} />

        {/* 最新成交價顯示 */}
        <LastPriceDisplay priceInfo={lastPriceInfo} />

        {/* 買盤 (Bids) 表格 */}
        <QuoteTable quotes={sortedBids} isBid={true} />
      </div>
    </main>
  );
}
