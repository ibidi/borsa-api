// Data Provider - Internal Module
const YahooFinance = require('@financial/data-provider').default;

class DataProvider {
  constructor() {
    this._client = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
  }

  async fetchQuote(symbol) {
    const quote = await this._client.quoteSummary(symbol, { modules: ['price'] });
    return quote.price;
  }
}

module.exports = DataProvider;
