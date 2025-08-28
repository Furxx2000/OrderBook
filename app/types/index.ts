export type Quote = [string, string];

export interface OrderBookData {
  type: 'snapshot' | 'delta';
  seqNum: number;
  prevSeqNum?: number;
  bids: Quote[];
  asks: Quote[];
  symbol: string;
  timestamp: number;
}

export interface OrderBookMessage {
  topic: string;
  data: OrderBookData;
}

export interface TradeFill {
  tradeId: number;
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
  timestamp: number;
  symbol: string;
}

export interface TradeHistoryMessage {
  topic: string;
  data: TradeFill[];
}

export interface OrderBookState {
  bids: Map<string, string>;
  asks: Map<string, string>;
  seqNum: number | null;
  isLoading: boolean;
}
