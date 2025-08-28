import { useEffect, useState } from 'react';
import { TradeFill } from '../types';

const WS_URL = 'wss://ws.btse.com/ws/futures';
const SYMBOL = 'BTCPFC';

export interface LastPriceState {
  current: number | null;
  previous: number | null;
  direction: 'up' | 'down' | 'same';
}

export const useTradeStream = () => {
  const [lastPrice, setLastPrice] = useState<LastPriceState>({
    current: null,
    previous: null,
    direction: 'same',
  });

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('Trade stream WebSocket connection established.');
      socket.send(
        JSON.stringify({ op: 'subscribe', args: [`tradeHistoryApi:${SYMBOL}`] })
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.topic === 'tradeHistoryApi') {
        const trades = message.data as TradeFill[];

        if (trades.length > 0) {
          const newPrice = trades[0].price;
          console.log(newPrice);
          setLastPrice((prev) => {
            const newDirection =
              prev.current === null || newPrice === prev.current
                ? 'same'
                : newPrice > prev.current
                ? 'up'
                : 'down';
            return {
              current: newPrice,
              previous: prev.current,
              direction: newDirection,
            };
          });
        }
      }
    };

    socket.onclose = () => {
      console.log('Trade stream WebSocket connection closed.');
    };

    socket.onerror = (error) => {
      console.error('Trade stream WebSocket error:', error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            op: 'unsubscribe',
            args: [`tradeHistoryApi:${SYMBOL}`],
          })
        );
      }
      socket.close();
    };
  }, []);

  return lastPrice;
};
