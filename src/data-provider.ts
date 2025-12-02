// Data Provider - Internal Module
const YahooFinanceClass = require('yahoo-finance2').default;

interface QuoteData {
  longName?: string;
  shortName?: string;
  regularMarketPrice?: number | { raw: number };
  regularMarketChange?: number | { raw: number };
  regularMarketChangePercent?: number | { raw: number };
  regularMarketDayHigh?: number | { raw: number };
  regularMarketDayLow?: number | { raw: number };
  regularMarketOpen?: number | { raw: number };
  regularMarketPreviousClose?: number | { raw: number };
  regularMarketVolume?: number | { raw: number };
}

class DataProvider {
  private yahooFinance: any;

  constructor() {
    this.yahooFinance = new YahooFinanceClass({ suppressNotices: ['yahooSurvey'] });
  }

  async fetchQuote(symbol: string): Promise<QuoteData> {
    const quote = await this.yahooFinance.quoteSummary(symbol, { modules: ['price'] });
    return quote.price;
  }

  async fetchChart(symbol: string, options: any): Promise<any> {
    return await this.yahooFinance.chart(symbol, options);
  }

  async fetchQuoteSummary(symbol: string): Promise<any> {
    return await this.yahooFinance.quoteSummary(symbol, {
      modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'assetProfile']
    });
  }
}

export = DataProvider;
