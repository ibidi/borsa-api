const axios = require('axios');

/**
 * Borsa API - Turkish Stock Market Data
 * BIST (Borsa İstanbul) verilerini çeker
 */
class BorsaAPI {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'https://api.bigpara.hurriyet.com.tr';
    this.timeout = options.timeout || 10000;
  }

  /**
   * BIST endeks verilerini getirir
   * @param {string} symbol - Endeks sembolü (XU100, XU030, vb.)
   * @returns {Promise<Object>}
   */
  async getIndex(symbol = 'XU100') {
    try {
      const response = await axios.get(`${this.baseURL}/endeks/api/endeks/${symbol}`, {
        timeout: this.timeout
      });
      return this._formatIndexData(response.data);
    } catch (error) {
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
      const response = await axios.get(`${this.baseURL}/hisse/api/hisse/${symbol}`, {
        timeout: this.timeout
      });
      return this._formatStockData(response.data);
    } catch (error) {
      throw new Error(`Hisse verisi alınamadı: ${error.message}`);
    }
  }

  /**
   * Popüler hisseleri getirir
   * @returns {Promise<Array>}
   */
  async getPopularStocks() {
    try {
      const response = await axios.get(`${this.baseURL}/hisse/api/populer`, {
        timeout: this.timeout
      });
      return response.data.map(stock => this._formatStockData(stock));
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
      const indexes = ['XU100', 'XU030', 'XBANK', 'XUSIN', 'XGIDA', 'XHOLD', 'XUTEK'];
      const promises = indexes.map(symbol => this.getIndex(symbol));
      return await Promise.all(promises);
    } catch (error) {
      throw new Error(`Endeksler alınamadı: ${error.message}`);
    }
  }

  /**
   * Hisse arama
   * @param {string} query - Arama terimi
   * @returns {Promise<Array>}
   */
  async searchStock(query) {
    try {
      const response = await axios.get(`${this.baseURL}/hisse/api/ara/${query}`, {
        timeout: this.timeout
      });
      return response.data.map(stock => this._formatStockData(stock));
    } catch (error) {
      throw new Error(`Arama yapılamadı: ${error.message}`);
    }
  }

  /**
   * Endeks verisini formatlar
   * @private
   */
  _formatIndexData(data) {
    return {
      symbol: data.sembol || data.symbol,
      name: data.ad || data.name,
      value: parseFloat(data.deger || data.value),
      change: parseFloat(data.degisim || data.change),
      changePercent: parseFloat(data.yuzdelik || data.changePercent),
      high: parseFloat(data.yuksek || data.high),
      low: parseFloat(data.dusuk || data.low),
      volume: parseFloat(data.hacim || data.volume),
      timestamp: data.zaman || data.timestamp || new Date().toISOString()
    };
  }

  /**
   * Hisse verisini formatlar
   * @private
   */
  _formatStockData(data) {
    return {
      symbol: data.sembol || data.symbol,
      name: data.ad || data.name,
      price: parseFloat(data.fiyat || data.price),
      change: parseFloat(data.degisim || data.change),
      changePercent: parseFloat(data.yuzdelik || data.changePercent),
      high: parseFloat(data.yuksek || data.high),
      low: parseFloat(data.dusuk || data.low),
      open: parseFloat(data.acilis || data.open),
      close: parseFloat(data.kapanis || data.close),
      volume: parseFloat(data.hacim || data.volume),
      timestamp: data.zaman || data.timestamp || new Date().toISOString()
    };
  }
}

module.exports = BorsaAPI;
