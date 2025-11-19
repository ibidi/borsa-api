// Data Provider - Internal Module
let YahooFinance;
try {
  YahooFinance = require('yahoo-finance2').default;
} catch (e) {
  // Fallback to mock data if yahoo-finance2 not available
  YahooFinance = null;
}

class DataProvider {
  constructor() {
    if (YahooFinance) {
      this._client = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
      this._useReal = true;
    } else {
      this._useReal = false;
    }
  }

  async fetchQuote(symbol) {
    if (!this._useReal) {
      // Return mock data
      throw new Error('Real-time data provider not available. Using mock data.');
    }
    
    const quote = await this._client.quoteSummary(symbol, { modules: ['price'] });
    return quote.price;
  }
}

module.exports = DataProvider;
