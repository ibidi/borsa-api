const axios = require('axios');
const DataProvider = require('./data-provider');
const WatchlistManager = require('./watchlist');
const utils = require('./utils');

/**
 * Borsa API - Turkish Stock Market Data
 * BIST (Borsa İstanbul) verilerini çeker
 * 
 * Gerçek zamanlı borsa verilerini sağlar.
 */
class BorsaAPI {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'https://api.genelpara.com';
    this.timeout = options.timeout || 10000;
    this.useMockData = options.useMockData === true; // Default false (use real data)
    this.useRealData = options.useRealData !== false; // Default true
    this._provider = new DataProvider();
    this.watchlist = new WatchlistManager();
    this.utils = utils;
  }

  /**
   * Mock data generator
   * @private
   */
  _generateMockData() {
    const stocks = [
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

    const indexes = [
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
      const baseValue = item.basePrice || item.baseValue;
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
   * @param {string} symbol - Endeks sembolü (XU100, XU030, vb.)
   * @returns {Promise<Object>}
   */
  async getIndex(symbol = 'XU100') {
    try {
      let data;
      
      if (this.useMockData) {
        // Use mock data
        const mockData = this._generateMockData();
        const indexData = mockData.find(item => item.code === symbol);
        if (!indexData) {
          throw new Error(`${symbol} endeksi bulunamadı`);
        }
        data = indexData;
      } else if (this.useRealData) {
        // Use real-time data provider
        const symbol_code = `${symbol}.IS`; // BIST format
        const priceData = await this._provider.fetchQuote(symbol_code);
        
        data = {
          code: symbol,
          name: priceData.longName || priceData.shortName || symbol,
          price: priceData.regularMarketPrice?.raw || priceData.regularMarketPrice,
          last: priceData.regularMarketPrice?.raw || priceData.regularMarketPrice,
          value: priceData.regularMarketPrice?.raw || priceData.regularMarketPrice,
          change: priceData.regularMarketChange?.raw || priceData.regularMarketChange,
          diff: priceData.regularMarketChange?.raw || priceData.regularMarketChange,
          rate: priceData.regularMarketChangePercent?.raw || priceData.regularMarketChangePercent,
          changePercent: priceData.regularMarketChangePercent?.raw || priceData.regularMarketChangePercent,
          high: priceData.regularMarketDayHigh?.raw || priceData.regularMarketDayHigh,
          low: priceData.regularMarketDayLow?.raw || priceData.regularMarketDayLow,
          open: priceData.regularMarketOpen?.raw || priceData.regularMarketOpen,
          close: priceData.regularMarketPreviousClose?.raw || priceData.regularMarketPreviousClose,
          volume: priceData.regularMarketVolume?.raw || priceData.regularMarketVolume,
          time: new Date().toISOString()
        };
      } else {
        // Try other API
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
        
        const indexData = response.data.find(item => item.code === symbol);
        if (!indexData) {
          throw new Error(`${symbol} endeksi bulunamadı`);
        }
        data = indexData;
      }
      
      return this._formatIndexData(data);
    } catch (error) {
      if (error.message.includes('bulunamadı')) {
        throw error;
      }
      throw new Error(`Endeks verisi alınamadı: ${error.message}`);
    }
  }

  /**
   * Hisse senedi verilerini getirir
   * @param {string} symbol - Hisse sembolü (THYAO, GARAN, vb.)
   * @returns {Promise<Object>}
   */
  async getStock(symbol) {
    try {
      let data;
      
      if (this.useMockData) {
        // Use mock data
        const mockData = this._generateMockData();
        const stockData = mockData.find(item => 
          item.code === symbol.toUpperCase() || item.code === symbol.toUpperCase() + '.E'
        );
        
        if (!stockData) {
          throw new Error(`${symbol} hissesi bulunamadı`);
        }
        data = stockData;
      } else if (this.useRealData) {
        // Use real-time data provider
        const symbol_code = `${symbol.toUpperCase()}.IS`; // BIST format
        const priceData = await this._provider.fetchQuote(symbol_code);
        
        data = {
          code: symbol.toUpperCase(),
          name: priceData.longName || priceData.shortName || symbol,
          price: priceData.regularMarketPrice?.raw || priceData.regularMarketPrice,
          last: priceData.regularMarketPrice?.raw || priceData.regularMarketPrice,
          value: priceData.regularMarketPrice?.raw || priceData.regularMarketPrice,
          change: priceData.regularMarketChange?.raw || priceData.regularMarketChange,
          diff: priceData.regularMarketChange?.raw || priceData.regularMarketChange,
          rate: priceData.regularMarketChangePercent?.raw || priceData.regularMarketChangePercent,
          changePercent: priceData.regularMarketChangePercent?.raw || priceData.regularMarketChangePercent,
          high: priceData.regularMarketDayHigh?.raw || priceData.regularMarketDayHigh,
          low: priceData.regularMarketDayLow?.raw || priceData.regularMarketDayLow,
          open: priceData.regularMarketOpen?.raw || priceData.regularMarketOpen,
          close: priceData.regularMarketPreviousClose?.raw || priceData.regularMarketPreviousClose,
          volume: priceData.regularMarketVolume?.raw || priceData.regularMarketVolume,
          time: new Date().toISOString()
        };
      } else {
        // Try other API
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
        
        const stockData = response.data.find(item => 
          item.code === symbol || item.code === symbol + '.E'
        );
        
        if (!stockData) {
          throw new Error(`${symbol} hissesi bulunamadı`);
        }
        data = stockData;
      }
      
      return this._formatStockData(data);
    } catch (error) {
      if (error.message.includes('bulunamadı')) {
        throw error;
      }
      throw new Error(`Hisse verisi alınamadı: ${error.message}`);
    }
  }

  /**
   * Popüler hisseleri getirir
   * @returns {Promise<Array>}
   */
  async getPopularStocks() {
    try {
      // Popular BIST stocks
      const popularSymbols = ['THYAO', 'GARAN', 'EREGL', 'AKBNK', 'TUPRS', 
                              'SAHOL', 'ISCTR', 'KCHOL', 'ASELS', 'BIMAS'];
      
      if (this.useMockData) {
        const mockData = this._generateMockData();
        const stocks = mockData
          .filter(item => popularSymbols.includes(item.code))
          .slice(0, 10);
        return stocks.map(stock => this._formatStockData(stock));
      } else if (this.useRealData) {
        // Fetch multiple stocks from real-time provider
        const promises = popularSymbols.map(async (symbol) => {
          try {
            return await this.getStock(symbol);
          } catch (error) {
            return null;
          }
        });
        
        const results = await Promise.all(promises);
        return results.filter(stock => stock !== null);
      } else {
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
        
        const stocks = response.data
          .filter(item => item.type === 'stock' || !item.type)
          .filter(item => !item.code.startsWith('X'))
          .sort((a, b) => (b.volume || 0) - (a.volume || 0))
          .slice(0, 20);
        
        return stocks.map(stock => this._formatStockData(stock));
      }
    } catch (error) {
      throw new Error(`Popüler hisseler alınamadı: ${error.message}`);
    }
  }

  /**
   * Tüm BIST endekslerini getirir
   * @returns {Promise<Array>}
   */
  async getAllIndexes() {
    try {
      let indexes;
      
      if (this.useMockData) {
        // Use mock data
        const mockData = this._generateMockData();
        indexes = mockData
          .filter(item => item.code && item.code.startsWith('X'))
          .slice(0, 7);
      } else if (this.useRealData) {
        // Fetch from real-time provider
        const indexSymbols = ['XU100', 'XU030', 'XBANK', 'XUSIN', 'XGIDA', 'XHOLD', 'XUTEK'];
        const promises = indexSymbols.map(async (symbol) => {
          try {
            return await this.getIndex(symbol);
          } catch (error) {
            return null;
          }
        });
        
        indexes = (await Promise.all(promises)).filter(idx => idx !== null);
      } else {
        // Try other API
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
        
        indexes = response.data
          .filter(item => item.code && item.code.startsWith('X'))
          .slice(0, 10);
      }
      
      return indexes.map(index => this._formatIndexData(index));
    } catch (error) {
      throw new Error(`Endeksler alınamadı: ${error.message}`);
    }
  }

  /**
   * Türkçe karakterleri normalize eder
   * @private
   */
  _normalizeTurkish(text) {
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
   * @param {string} query - Arama terimi
   * @returns {Promise<Array>}
   */
  async searchStock(query) {
    try {
      let results;
      
      if (this.useMockData) {
        // Use mock data
        const mockData = this._generateMockData();
        const searchTerm = this._normalizeTurkish(query);
        results = mockData.filter(item => 
          (item.code && this._normalizeTurkish(item.code).includes(searchTerm)) ||
          (item.name && this._normalizeTurkish(item.name).includes(searchTerm))
        );
      } else if (this.useRealData) {
        // Search in popular stocks
        const popularStocks = await this.getPopularStocks();
        const searchTerm = this._normalizeTurkish(query);
        results = popularStocks.filter(item => 
          (item.symbol && this._normalizeTurkish(item.symbol).includes(searchTerm)) ||
          (item.name && this._normalizeTurkish(item.name).includes(searchTerm))
        );
        return results;
      } else {
        // Try other API
        const response = await axios.get(`${this.baseURL}/embed/borsa.json`, {
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
        
        const searchTerm = this._normalizeTurkish(query);
        results = response.data.filter(item => 
          (item.code && this._normalizeTurkish(item.code).includes(searchTerm)) ||
          (item.name && this._normalizeTurkish(item.name).includes(searchTerm))
        );
      }
      
      return results.map(stock => this._formatStockData(stock));
    } catch (error) {
      throw new Error(`Arama yapılamadı: ${error.message}`);
    }
  }

  /**
   * Endeks verisini formatlar
   * @private
   */
  _formatIndexData(data) {
    const value = parseFloat(data.price || data.last || data.value || 0);
    const change = parseFloat(data.change || data.diff || 0);
    const changePercent = parseFloat(data.rate || data.changePercent || 0);
    
    return {
      symbol: data.code || data.symbol,
      name: data.name || data.text || data.code,
      value: value,
      change: change,
      changePercent: changePercent,
      high: parseFloat(data.high || value),
      low: parseFloat(data.low || value),
      volume: parseFloat(data.volume || 0),
      timestamp: data.time || data.timestamp || new Date().toISOString()
    };
  }

  /**
   * Hisse verisini formatlar
   * @private
   */
  _formatStockData(data) {
    const price = parseFloat(data.price || data.last || data.value || 0);
    const change = parseFloat(data.change || data.diff || 0);
    const changePercent = parseFloat(data.rate || data.changePercent || 0);
    
    return {
      symbol: data.code || data.symbol,
      name: data.name || data.text || data.code,
      price: price,
      change: change,
      changePercent: changePercent,
      high: parseFloat(data.high || price),
      low: parseFloat(data.low || price),
      open: parseFloat(data.open || price),
      close: parseFloat(data.close || price),
      volume: parseFloat(data.volume || 0),
      timestamp: data.time || data.timestamp || new Date().toISOString()
    };
  }

  /**
   * İki hisseyi karşılaştır
   * @param {string} symbol1 - İlk hisse sembolü
   * @param {string} symbol2 - İkinci hisse sembolü
   * @returns {Promise<Object>}
   */
  async compareStocks(symbol1, symbol2) {
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
    } catch (error) {
      throw new Error(`Karşılaştırma yapılamadı: ${error.message}`);
    }
  }

  /**
   * En çok yükselenleri getir
   * @param {number} limit - Limit
   * @returns {Promise<Array>}
   */
  async getTopGainers(limit = 10) {
    try {
      const stocks = await this.getPopularStocks();
      return utils.getTopGainers(stocks, limit);
    } catch (error) {
      throw new Error(`En çok yükselenler alınamadı: ${error.message}`);
    }
  }

  /**
   * En çok düşenleri getir
   * @param {number} limit - Limit
   * @returns {Promise<Array>}
   */
  async getTopLosers(limit = 10) {
    try {
      const stocks = await this.getPopularStocks();
      return utils.getTopLosers(stocks, limit);
    } catch (error) {
      throw new Error(`En çok düşenler alınamadı: ${error.message}`);
    }
  }

  /**
   * En yüksek hacimli hisseleri getir
   * @param {number} limit - Limit
   * @returns {Promise<Array>}
   */
  async getTopVolume(limit = 10) {
    try {
      const stocks = await this.getPopularStocks();
      return utils.getTopVolume(stocks, limit);
    } catch (error) {
      throw new Error(`En yüksek hacimli hisseler alınamadı: ${error.message}`);
    }
  }

  /**
   * Watchlist'teki hisselerin verilerini getir
   * @returns {Promise<Array>}
   */
  async getWatchlistData() {
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
      return results.filter(stock => stock !== null);
    } catch (error) {
      throw new Error(`Watchlist verileri alınamadı: ${error.message}`);
    }
  }
}

module.exports = BorsaAPI;
