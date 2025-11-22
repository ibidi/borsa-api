export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  timestamp: string;
}

export interface IndexData {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: string;
}

export interface WatchlistResult {
  success: boolean;
  message: string;
}

export interface BorsaAPIOptions {
  baseURL?: string;
  timeout?: number;
  useMockData?: boolean;
  useRealData?: boolean;
}

export interface WatchlistManagerOptions {
  disabled?: boolean;
}

// Historical Data Types
export interface HistoricalQuote {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export interface ChartMeta {
  currency: string;
  symbol: string;
  exchangeName: string;
  fullExchangeName: string;
  instrumentType: string;
  firstTradeDate: Date;
  regularMarketTime: Date;
  regularMarketPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  longName: string;
  shortName: string;
  chartPreviousClose: number;
  timezone: string;
  exchangeTimezoneName: string;
  dataGranularity: string;
  validRanges: string[];
}

export interface HistoricalData {
  meta: ChartMeta;
  quotes: HistoricalQuote[];
}

export type TimeInterval = '1d' | '1wk' | '1mo';
export type TimePeriod = '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max';

export interface HistoricalOptions {
  period?: TimePeriod;
  interval?: TimeInterval;
  period1?: string | Date;
  period2?: string | Date;
}

// Stock Details (Extended Info)
export interface StockDetails extends StockData {
  marketCap?: number;
  peRatio?: number;
  eps?: number;
  dividendYield?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  averageVolume?: number;
  beta?: number;
  sector?: string;
  industry?: string;
  description?: string;
}
