import axios from 'axios';
import DataProvider = require('./data-provider');
import WatchlistManager = require('./watchlist');
import * as utils from './utils';
import { StockData, IndexData, BorsaAPIOptions } from './types';

interface MockStock {
  code: string;
  name: string;
  basePrice?: number;
  baseValue?: number;
}

interface RawData {
  code?: string;
  symbol?: string;
  name?: string;
  text?: string;
  price?: number;
  last?: number;
  value?: number;
  change?: number;
  diff?: number;
  rate?: number;
  changePercent?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
  volume?: number;
  time?: string;
  timestamp?: string;
  type?: string;
}

/**
 * Borsa API - Turkish Stock Market Data
 * BIST (Borsa İstanbul) verilerini çeker
 */
class BorsaAPI {
  private baseURL: string;
  private timeout: number;
  private useMockData: boolean;
  private useRealData: boolean;
  private _provider: DataProvider;
  public watchlist: WatchlistManager;
  public utils: typeof utils;

  constructor(options: BorsaAPIOptions = {}) {
    this.baseURL = options.baseURL || 'https://api.genelpara.com';
    this.timeout = options.timeout || 10000;
    this.useMockData = options.useMockData === true;
    this.useRealData = options.useRealData !== false;
    this._provider = new DataProvider();
    this.watchlist = new WatchlistManager();
    this.utils = utils;
  }

  /**
   * Mock data generator
   */
  private _generateMockData(): RawData[] {
    const stocks: MockStock[] = [
      { code: 'THYAO', name: 'TURK HAVA YOLLARI', basePrice: 234.50 },
      { code: 'GARAN', name: 'GARANTI BANKASI', basePrice: 89.75 },
      { code: 'EREGL', name: 'EREGLI DEMIR CELIK', basePrice: 45.20 },
      { code: 'AKBNK', name: 'AKBANK', basePrice: 56.80 },
      { code: 'TUPRS', name: 'TUPRAS', basePrice: 178.90 },
      { code: 'SAHOL', name: 'SABANCI HOLDING', basePrice: 67.30 },
      { code: 'ISCTR', name: 'IS BANKASI', basePrice: 12.45 },
      { code: 'KCHOL', name: 'KOC HOLDING', basePrice: 145.60 },
      { code: 'ASELS', name: 'ASELSAN', basePrice: 89.40 },
      { code: 'BIMAS', name: 'BIM', basePrice: 456.70 }
    ];

    const indexes: MockStock[] = [
      { code: 'XU100', name: 'BIST 100', baseValue: 9234.56 },
      { code: 'XU030', name: 'BIST 30', baseValue: 10456.78 },
      { code: 'XBANK', name: 'BIST BANKA', baseValue: 7890.12 },
      { code: 'XUSIN', name: 'BIST SINAI', baseValue: 5678.90 },
      { code: 'XGIDA', name: 'BIST GIDA', baseValue: 3456.78 },
      { code: 'XHOLD', name: 'BIST HOLDING', baseValue: 8901.23 },
      { code: 'XUTEK', name: 'BIST TEKNOLOJI', baseValue: 4567.89 }
    ];

    return [...stocks, ...indexes].map(item => {
      const isIndex = item.code.startsWith('X');
      const baseValue = item.basePrice || item.baseValue || 0;
      const randomChange = (Math.random() - 0.5) * 10;
      const value = baseValue + randomChange;
      const change = randomChange;
      const changePercent = (change / baseValue) * 100;

      return {
        code: item.code,
        name: item.name,
        price: value,
        last: value,
        value: value,
        change: change,
        diff: change,
        rate: changePercent,
        changePercent: changePercent,
        high: value + Math.abs(randomChange) * 0.5,
        low: value - Math.abs(randomChange) * 0.5,
        open: baseValue,
        close: baseValue,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        type: isIndex ? 'index' : 'stock',
        time: new Date().toISOString()
      };
    });
  }

  /**
   * BIST endeks verilerini getirir
   */
  async getIndex(symbol: string = 'XU100'): Promise<IndexData> {
    try {
      let data: RawData;

      if (this.useMockData) {
        const mockData = this._generateMockData();
        const indexData = mockData.find(item => item.code === symbol);
        if (!indexData) {
          throw new Error(`${symbol} endeksi bulunamadı`);
        }
        data = indexData;
      } else if (this.useRealData) {
        const symbol_code = `${symbol}.IS`;
        const priceData = await this._provider.fetchQuote(symbol_code);

        data = {
          code: symbol,
          name: priceData.longName || priceData.shortName || symbol,
          price: typeof priceData.regularMarketPrice === 'object' ? priceData.regularMarketPrice.raw : priceData.regularMarketPrice,
          change: typeof priceData.regularMarketChange === 'object' ? priceData.regularMarketChange.raw : priceData.regularMarketChange,
          rate: typeof priceData.regularMarketChangePercent === 'object' ? priceData.regularMarketChangePercent.raw : priceData.regularMarketChangePercent,
          high: typeof priceData.regularMarketDayHigh === 'object' ? priceData.regularMarketDayHigh.raw : priceData.regularMarketDayHigh,
          low: typeof priceData.regularMarketDayLow === 'object' ? priceData.regularMarketDayLow.raw : priceData.regularMarketDayLow,
          open: typeof priceData.regularMarketOpen === 'object' ? priceData.regularMarketOpen.raw : priceData.regularMarketOpen,
          close: typeof priceData.regularMarketPreviousClose === 'object' ? priceData.regularMarketPreviousClose.raw : priceData.regularMarketPreviousClose,
          volume: typeof priceData.regularMarketVolume === 'object' ? priceData.regularMarketVolume.raw : priceData.regularMarketVolume,
          time: new Date().toISOString()
        };
      } else {
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const indexData = response.data.find((item: RawData) => item.code === symbol);
        if (!indexData) {
          throw new Error(`${symbol} endeksi bulunamadı`);
        }
        data = indexData;
      }

      return this._formatIndexData(data);
    } catch (error: any) {
      if (error.message.includes('bulunamadı')) {
        throw error;
      }
      throw new Error(`Endeks verisi alınamadı: ${error.message}`);
    }
  }

  /**
   * Hisse senedi verilerini getirir
   */
  async getStock(symbol: string): Promise<StockData> {
    try {
      let data: RawData;

      if (this.useMockData) {
        const mockData = this._generateMockData();
        const stockData = mockData.find(item =>
          item.code === symbol.toUpperCase() || item.code === symbol.toUpperCase() + '.E'
        );

        if (!stockData) {
          throw new Error(`${symbol} hissesi bulunamadı`);
        }
        data = stockData;
      } else if (this.useRealData) {
        const symbol_code = `${symbol.toUpperCase()}.IS`;
        const priceData = await this._provider.fetchQuote(symbol_code);

        data = {
          code: symbol.toUpperCase(),
          name: priceData.longName || priceData.shortName || symbol,
          price: typeof priceData.regularMarketPrice === 'object' ? priceData.regularMarketPrice.raw : priceData.regularMarketPrice,
          change: typeof priceData.regularMarketChange === 'object' ? priceData.regularMarketChange.raw : priceData.regularMarketChange,
          rate: typeof priceData.regularMarketChangePercent === 'object' ? priceData.regularMarketChangePercent.raw : priceData.regularMarketChangePercent,
          high: typeof priceData.regularMarketDayHigh === 'object' ? priceData.regularMarketDayHigh.raw : priceData.regularMarketDayHigh,
          low: typeof priceData.regularMarketDayLow === 'object' ? priceData.regularMarketDayLow.raw : priceData.regularMarketDayLow,
          open: typeof priceData.regularMarketOpen === 'object' ? priceData.regularMarketOpen.raw : priceData.regularMarketOpen,
          close: typeof priceData.regularMarketPreviousClose === 'object' ? priceData.regularMarketPreviousClose.raw : priceData.regularMarketPreviousClose,
          volume: typeof priceData.regularMarketVolume === 'object' ? priceData.regularMarketVolume.raw : priceData.regularMarketVolume,
          time: new Date().toISOString()
        };
      } else {
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const stockData = response.data.find((item: RawData) =>
          item.code === symbol || item.code === symbol + '.E'
        );

        if (!stockData) {
          throw new Error(`${symbol} hissesi bulunamadı`);
        }
        data = stockData;
      }

      return this._formatStockData(data);
    } catch (error: any) {
      if (error.message.includes('bulunamadı')) {
        throw error;
      }
      throw new Error(`Hisse verisi alınamadı: ${error.message}`);
    }
  }

  /**
   * Popüler hisseleri getirir
   */
  async getPopularStocks(): Promise<StockData[]> {
    try {
      const popularSymbols = ['THYAO', 'GARAN', 'EREGL', 'AKBNK', 'TUPRS',
        'SAHOL', 'ISCTR', 'KCHOL', 'ASELS', 'BIMAS'];

      if (this.useMockData) {
        const mockData = this._generateMockData();
        const stocks = mockData
          .filter(item => popularSymbols.includes(item.code || ''))
          .slice(0, 10);
        return stocks.map(stock => this._formatStockData(stock));
      } else if (this.useRealData) {
        const promises = popularSymbols.map(async (symbol) => {
          try {
            return await this.getStock(symbol);
          } catch (error) {
            return null;
          }
        });

        const results = await Promise.all(promises);
        return results.filter((stock): stock is StockData => stock !== null);
      } else {
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const stocks = response.data
          .filter((item: RawData) => item.type === 'stock' || !item.type)
          .filter((item: RawData) => !item.code?.startsWith('X'))
          .sort((a: RawData, b: RawData) => (b.volume || 0) - (a.volume || 0))
          .slice(0, 20);

        return stocks.map((stock: RawData) => this._formatStockData(stock));
      }
    } catch (error: any) {
      throw new Error(`Popüler hisseler alınamadı: ${error.message}`);
    }
  }

  /**
   * Tüm BIST endekslerini getirir
   */
  async getAllIndexes(): Promise<IndexData[]> {
    try {
      let indexes: RawData[];

      if (this.useMockData) {
        const mockData = this._generateMockData();
        indexes = mockData
          .filter(item => item.code && item.code.startsWith('X'))
          .slice(0, 7);
      } else if (this.useRealData) {
        const indexSymbols = ['XU100', 'XU030', 'XBANK', 'XUSIN', 'XGIDA', 'XHOLD', 'XUTEK'];
        const promises = indexSymbols.map(async (symbol) => {
          try {
            return await this.getIndex(symbol);
          } catch (error) {
            return null;
          }
        });

        const results = await Promise.all(promises);
        return results.filter((idx): idx is IndexData => idx !== null);
      } else {
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        indexes = response.data
          .filter((item: RawData) => item.code && item.code.startsWith('X'))
          .slice(0, 10);
      }

      return indexes.map(index => this._formatIndexData(index));
    } catch (error: any) {
      throw new Error(`Endeksler alınamadı: ${error.message}`);
    }
  }

  /**
   * Türkçe karakterleri normalize eder
   */
  private _normalizeTurkish(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
  }

  /**
   * Hisse arama
   */
  async searchStock(query: string): Promise<StockData[]> {
    try {
      let results: RawData[];

      if (this.useMockData) {
        const mockData = this._generateMockData();
        const searchTerm = this._normalizeTurkish(query);
        results = mockData.filter(item =>
          (item.code && this._normalizeTurkish(item.code).includes(searchTerm)) ||
          (item.name && this._normalizeTurkish(item.name).includes(searchTerm))
        );
      } else if (this.useRealData) {
        const popularStocks = await this.getPopularStocks();
        const searchTerm = this._normalizeTurkish(query);
        return popularStocks.filter(item =>
          (item.symbol && this._normalizeTurkish(item.symbol).includes(searchTerm)) ||
          (item.name && this._normalizeTurkish(item.name).includes(searchTerm))
        );
      } else {
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const searchTerm = this._normalizeTurkish(query);
        results = response.data.filter((item: RawData) =>
          (item.code && this._normalizeTurkish(item.code).includes(searchTerm)) ||
          (item.name && this._normalizeTurkish(item.name).includes(searchTerm))
        );
      }

      return results.map(stock => this._formatStockData(stock));
    } catch (error: any) {
      throw new Error(`Arama yapılamadı: ${error.message}`);
    }
  }

  /**
   * İki hisseyi karşılaştır
   */
  async compareStocks(symbol1: string, symbol2: string): Promise<{
    stock1: StockData;
    stock2: StockData;
    comparison: {
      priceDiff: number;
      changeDiff: number;
      volumeDiff: number;
    };
  }> {
    try {
      const [stock1, stock2] = await Promise.all([
        this.getStock(symbol1),
        this.getStock(symbol2)
      ]);

      return {
        stock1,
        stock2,
        comparison: {
          priceDiff: stock1.price - stock2.price,
          changeDiff: stock1.changePercent - stock2.changePercent,
          volumeDiff: stock1.volume - stock2.volume
        }
      };
    } catch (error: any) {
      throw new Error(`Karşılaştırma yapılamadı: ${error.message}`);
    }
  }

  /**
   * En çok yükselenleri getir
   */
  async getTopGainers(limit: number = 10): Promise<StockData[]> {
    try {
      const stocks = await this.getPopularStocks();
      return utils.getTopGainers(stocks, limit);
    } catch (error: any) {
      throw new Error(`En çok yükselenler alınamadı: ${error.message}`);
    }
  }

  /**
   * En çok düşenleri getir
   */
  async getTopLosers(limit: number = 10): Promise<StockData[]> {
    try {
      const stocks = await this.getPopularStocks();
      return utils.getTopLosers(stocks, limit);
    } catch (error: any) {
      throw new Error(`En çok düşenler alınamadı: ${error.message}`);
    }
  }

  /**
   * En yüksek hacimli hisseleri getir
   */
  async getTopVolume(limit: number = 10): Promise<StockData[]> {
    try {
      const stocks = await this.getPopularStocks();
      return utils.getTopVolume(stocks, limit);
    } catch (error: any) {
      throw new Error(`En yüksek hacimli hisseler alınamadı: ${error.message}`);
    }
  }

  /**
   * Watchlist'teki hisselerin verilerini getir
   */
  async getWatchlistData(): Promise<StockData[]> {
    try {
      const watchlist = this.watchlist.getWatchlist();

      if (watchlist.length === 0) {
        return [];
      }

      const promises = watchlist.map(async (item) => {
        try {
          return await this.getStock(item.symbol);
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(promises);
      return results.filter((stock): stock is StockData => stock !== null);
    } catch (error: any) {
      throw new Error(`Watchlist verileri alınamadı: ${error.message}`);
    }
  }

  /**
   * Endeks verisini formatlar
   */
  private _formatIndexData(data: RawData): IndexData {
    const value = parseFloat(String(data.price || data.last || data.value || 0));
    const change = parseFloat(String(data.change || data.diff || 0));
    const changePercent = parseFloat(String(data.rate || data.changePercent || 0));

    return {
      symbol: data.code || data.symbol || '',
      name: data.name || data.text || data.code || '',
      value: value,
      change: change,
      changePercent: changePercent,
      high: parseFloat(String(data.high || value)),
      low: parseFloat(String(data.low || value)),
      volume: parseFloat(String(data.volume || 0)),
      timestamp: data.time || data.timestamp || new Date().toISOString()
    };
  }

  /**
   * Hisse verisini formatlar
   */
  private _formatStockData(data: RawData): StockData {
    const price = parseFloat(String(data.price || data.last || data.value || 0));
    const change = parseFloat(String(data.change || data.diff || 0));
    const changePercent = parseFloat(String(data.rate || data.changePercent || 0));

    return {
      symbol: data.code || data.symbol || '',
      name: data.name || data.text || data.code || '',
      price: price,
      change: change,
      changePercent: changePercent,
      high: parseFloat(String(data.high || price)),
      low: parseFloat(String(data.low || price)),
      open: parseFloat(String(data.open || price)),
      close: parseFloat(String(data.close || price)),
      volume: parseFloat(String(data.volume || 0)),
      timestamp: data.time || data.timestamp || new Date().toISOString()
    };
  }

  /**
   * Historik fiyat verilerini getirir
   * @param symbol - Hisse sembolü (örn: THYAO)
   * @param options - Zaman aralığı ve interval seçenekleri
   * @returns Historik veri ve meta bilgiler
   */
  async getHistoricalData(
    symbol: string,
    options: import('./types').HistoricalOptions = {}
  ): Promise<import('./types').HistoricalData> {
    try {
      const symbolCode = `${symbol.toUpperCase()}.IS`;
      const {
        period = '1mo',
        interval = '1d',
        period1,
        period2
      } = options;

      const chartOptions: any = { interval };

      if (period1 && period2) {
        chartOptions.period1 = period1;
        chartOptions.period2 = period2;
      } else if (period1) {
        chartOptions.period1 = period1;
      } else {
        chartOptions.period1 = this._calculatePeriodStart(period);
      }

      const result = await this._provider.fetchChart(symbolCode, chartOptions);

      return {
        meta: {
          currency: result.meta.currency,
          symbol: symbol.toUpperCase(),
          exchangeName: result.meta.exchangeName,
          fullExchangeName: result.meta.fullExchangeName,
          instrumentType: result.meta.instrumentType,
          firstTradeDate: new Date(result.meta.firstTradeDate),
          regularMarketTime: new Date(result.meta.regularMarketTime),
          regularMarketPrice: result.meta.regularMarketPrice,
          fiftyTwoWeekHigh: result.meta.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: result.meta.fiftyTwoWeekLow,
          regularMarketDayHigh: result.meta.regularMarketDayHigh,
          regularMarketDayLow: result.meta.regularMarketDayLow,
          regularMarketVolume: result.meta.regularMarketVolume,
          longName: result.meta.longName,
          shortName: result.meta.shortName,
          chartPreviousClose: result.meta.chartPreviousClose,
          timezone: result.meta.timezone,
          exchangeTimezoneName: result.meta.exchangeTimezoneName,
          dataGranularity: result.meta.dataGranularity,
          validRanges: result.meta.validRanges
        },
        quotes: result.quotes.map((q: any) => ({
          date: new Date(q.date),
          open: q.open,
          high: q.high,
          low: q.low,
          close: q.close,
          adjClose: q.adjclose || q.adjClose,
          volume: q.volume
        }))
      };
    } catch (error: any) {
      throw new Error(`Historik veri alınamadı: ${error.message}`);
    }
  }

  /**
   * Detaylı hisse bilgilerini getirir (market cap, P/E ratio, vb.)
   */
  async getStockDetails(symbol: string): Promise<import('./types').StockDetails> {
    try {
      const symbolCode = `${symbol.toUpperCase()}.IS`;
      const summaryData = await this._provider.fetchQuoteSummary(symbolCode);

      const basicData = await this.getStock(symbol);

      return {
        ...basicData,
        marketCap: summaryData.price?.marketCap?.raw || summaryData.summaryDetail?.marketCap?.raw,
        peRatio: summaryData.summaryDetail?.trailingPE?.raw,
        eps: summaryData.defaultKeyStatistics?.trailingEps?.raw,
        dividendYield: summaryData.summaryDetail?.dividendYield?.raw,
        fiftyTwoWeekHigh: summaryData.summaryDetail?.fiftyTwoWeekHigh?.raw,
        fiftyTwoWeekLow: summaryData.summaryDetail?.fiftyTwoWeekLow?.raw,
        averageVolume: summaryData.summaryDetail?.averageVolume?.raw,
        beta: summaryData.summaryDetail?.beta?.raw,
        sector: summaryData.assetProfile?.sector,
        industry: summaryData.assetProfile?.industry,
        description: summaryData.assetProfile?.longBusinessSummary
      };
    } catch (error: any) {
      throw new Error(`Detaylı hisse bilgisi alınamadı: ${error.message}`);
    }
  }

  /**
   * Period string'ini başlangıç tarihine çevirir
   */
  private _calculatePeriodStart(period: import('./types').TimePeriod): string {
    const now = new Date();
    const periodMap: Record<string, number> = {
      '1d': 1,
      '5d': 5,
      '1mo': 30,
      '3mo': 90,
      '6mo': 180,
      '1y': 365,
      '2y': 730,
      '5y': 1825,
      '10y': 3650,
      'ytd': Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)),
      'max': 7300 // ~20 years
    };

    const days = periodMap[period] || 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return startDate.toISOString().split('T')[0];
  }
}

export = BorsaAPI;
