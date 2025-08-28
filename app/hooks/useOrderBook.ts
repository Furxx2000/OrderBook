import { useEffect, useReducer } from 'react';
import { OrderBookState, OrderBookData } from '@/app/types';

const WS_URL_OSS = 'wss://ws.btse.com/ws/oss/futures';
const SYMBOL = 'BTCPFC';

type Action =
  | { type: 'SNAPSHOT'; payload: OrderBookData }
  | { type: 'DELTA'; payload: OrderBookData }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: OrderBookState = {
  bids: new Map(),
  asks: new Map(),
  seqNum: null,
  isLoading: true,
};

const updateQuotes = (
  currentQuotes: Map<string, string>,
  newQuotes: [string, string][]
) => {
  const updatedQuotes = new Map(currentQuotes);
  newQuotes.forEach(([price, size]) => {
    if (Number(size) === 0) {
      updatedQuotes.delete(price);
    } else {
      updatedQuotes.set(price, size);
    }
  });
  return updatedQuotes;
};

function orderBookReducer(
  state: OrderBookState,
  action: Action
): OrderBookState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SNAPSHOT':
      return {
        ...state,
        bids: new Map(action.payload.bids),
        asks: new Map(action.payload.asks),
        seqNum: action.payload.seqNum,
        isLoading: false,
      };

    case 'DELTA':
      if (action.payload.prevSeqNum !== state.seqNum) {
        console.error('Sequence number mismatch. A resubscribe is needed.');
        return state;
      }

      return {
        ...state,
        bids: updateQuotes(state.bids, action.payload.bids),
        asks: updateQuotes(state.asks, action.payload.asks),
        seqNum: action.payload.seqNum,
      };

    default:
      return state;
  }
}

// --- Custom Hook: 封裝 WebSocket 邏輯 ---
export const useOrderBookStream = () => {
  const [state, dispatch] = useReducer(orderBookReducer, initialState);

  useEffect(() => {
    const socket = new WebSocket(WS_URL_OSS);

    socket.onopen = () => {
      console.log('Order book stream WebSocket connection established.');
      socket.send(
        JSON.stringify({ op: 'subscribe', args: [`update:${SYMBOL}`] })
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.topic === `update:${SYMBOL}`) {
        const data = message.data as OrderBookData;
        if (data.type === 'snapshot') {
          dispatch({ type: 'SNAPSHOT', payload: data });
        } else if (data.type === 'delta') {
          dispatch({ type: 'DELTA', payload: data });
        }
      }
    };

    socket.onclose = () => {
      console.log('Order book stream WebSocket connection closed.');
      dispatch({ type: 'SET_LOADING', payload: true });
    };

    socket.onerror = (error) => {
      console.error('Order book stream WebSocket error:', error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ op: 'unsubscribe', args: [`update:${SYMBOL}`] })
        );
      }
      socket.close();
    };
  }, []);

  return state;
};
