<div align="center">

# 📈 borsa-api

### Turkish Stock Market (BIST) API Wrapper & CLI Tool

**Türk Borsası (BIST) için API wrapper ve CLI aracı**

[![npm version](https://img.shields.io/npm/v/borsa-api?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/borsa-api)
[![npm downloads](https://img.shields.io/npm/dm/borsa-api?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/borsa-api)
[![license](https://img.shields.io/npm/l/borsa-api?style=for-the-badge)](https://github.com/ibidi/borsa-api/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ibidi/borsa-api?style=for-the-badge&logo=github)](https://github.com/ibidi/borsa-api)

[Installation](#-installation--kurulum) •
[Features](#-features--özellikler) •
[Usage](#-cli-usage--cli-kullanımı) •
[API](#-programmatic-usage--kod-içinde-kullanım) •
[Examples](#-usage-example)

</div>

---

## 🚀 Features / Özellikler

- 📊 **BIST Indexes** - XU100, XU030, XBANK, and more
- 📈 **Stock Data** - Delayed stock prices and information
- 🔍 **Search** - Find stocks by name or symbol (Turkish character support)
- ⭐ **Watchlist** - Save and track your favorite stocks
- ⚖️ **Compare** - Compare two stocks side by side
- 📈 **Top Gainers/Losers** - See best and worst performers
- 💹 **Volume Leaders** - Highest volume stocks
- 💻 **Beautiful CLI** - Professional terminal interface with colors and tables
- 📦 **API Wrapper** - Use programmatically in your code
- 🇹🇷 **Turkish Support** - Native Turkish language support
- ⚡ **Fast & Reliable** - Optimized for performance
- 📘 **TypeScript** - Full TypeScript support with type definitions

## 📦 Installation / Kurulum

### Global (CLI kullanımı için)

```bash
npm install -g borsa-api
```

### Local (Kod içinde kullanım için)

```bash
npm install borsa-api
```

## 🎯 CLI Usage / CLI Kullanımı

### Endeks Görüntüleme

```bash
# XU100 endeksi (varsayılan)
borsa endeks

# Belirli bir endeks
borsa endeks XU030
borsa endeks XBANK
```

### Hisse Senedi Görüntüleme

```bash
borsa hisse THYAO
borsa hisse GARAN
borsa hisse EREGL
```

### Popüler Hisseler

```bash
borsa populer
```

### Tüm Endeksler

```bash
borsa endeksler
```

### Hisse Arama

```bash
borsa ara garanti
borsa ara turkcell
```

### İzleme Listesi (Watchlist)

```bash
# İzleme listesine ekle
borsa watchlist --add THYAO
borsa watchlist --add GARAN

# İzleme listesini göster
borsa watchlist

# İzleme listesinden çıkar
borsa watchlist --remove THYAO

# İzleme listesini temizle
borsa watchlist --clear
```

### Hisse Karşılaştırma

```bash
borsa karsilastir THYAO GARAN
borsa compare AKBNK ISCTR
```

### En Çok Yükselenler/Düşenler

```bash
# En çok yükselenler (varsayılan 10)
borsa yukselenler
borsa yukselenler 5

# En çok düşenler
borsa dusenler
borsa dusenler 5

# En yüksek hacimli hisseler
borsa hacim
borsa hacim 5
```

### Historik Veri ve Detaylı Bilgi

```bash
# Geçmiş fiyat verileri
borsa gecmis THYAO          # Son 1 ay (varsayılan)
borsa gecmis THYAO 5d       # Son 5 gün
borsa gecmis THYAO 1y       # Son 1 yıl
borsa historical AKBNK 3mo  # Son 3 ay

# Detaylı hisse bilgisi (market cap, P/E ratio, sektör, vb.)
borsa detay THYAO
borsa details GARAN
```

## 💻 Programmatic Usage / Kod İçinde Kullanım

```javascript
const BorsaAPI = require('borsa-api');

const api = new BorsaAPI();

// Endeks verisi al
async function getIndex() {
  try {
    const xu100 = await api.getIndex('XU100');
    console.log(xu100);
    // {
    //   symbol: 'XU100',
    //   name: 'BIST 100',
    //   value: 9234.56,
    //   change: 123.45,
    //   changePercent: 1.35,
    //   high: 9250.00,
    //   low: 9100.00,
    //   volume: 12345678,
    //   timestamp: '2024-11-16T...'
    // }
  } catch (error) {
    console.error(error.message);
  }
}

// Hisse senedi verisi al
async function getStock() {
  try {
    const thyao = await api.getStock('THYAO');
    console.log(thyao);
    // {
    //   symbol: 'THYAO',
    //   name: 'TURK HAVA YOLLARI',
    //   price: 234.50,
    //   change: 5.25,
    //   changePercent: 2.29,
    //   high: 236.00,
    //   low: 230.00,
    //   open: 231.00,
    //   close: 229.25,
    //   volume: 1234567,
    //   timestamp: '2024-11-16T...'
    // }
  } catch (error) {
    console.error(error.message);
  }
}

// Popüler hisseler
async function getPopular() {
  const stocks = await api.getPopularStocks();
  console.log(stocks);
}

// Tüm endeksler
async function getAllIndexes() {
  const indexes = await api.getAllIndexes();
  console.log(indexes);
}

// Hisse arama
async function search() {
  const results = await api.searchStock('garanti');
  console.log(results);
}

// Historik veri
async function getHistorical() {
  const data = await api.getHistoricalData('THYAO', {
    period: '1mo',  // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    interval: '1d'  // 1d, 1wk, 1mo
  });
  console.log(data);
  // {
  //   meta: {
  //     currency: 'TRY',
  //     symbol: 'THYAO',
  //     longName: 'Türk Hava Yollari...',
  //     fiftyTwoWeekHigh: 346.25,
  //     fiftyTwoWeekLow: 249.20,
  //     ...
  //   },
  //   quotes: [
  //     {
  //       date: Date,
  //       open: 273.00,
  //       high: 274.75,
  //       low: 271.50,
  //       close: 273.00,
  //       adjClose: 266.68,
  //       volume: 19991989
  //     },
  //     ...
  //   ]
  // }
}

// Detaylı hisse bilgisi
async function getDetails() {
  const details = await api.getStockDetails('THYAO');
  console.log(details);
  // {
  //   ...StockData,
  //   marketCap: 123456789000,
  //   peRatio: 15.23,
  //   eps: 12.34,
  //   dividendYield: 0.025,
  //   fiftyTwoWeekHigh: 346.25,
  //   fiftyTwoWeekLow: 249.20,
  //   averageVolume: 25000000,
  //   beta: 1.15,
  //   sector: 'Industrials',
  //   industry: 'Airlines',
  //   description: 'Company description...'
  // }
}

// İki hisseyi karşılaştır
async function compare() {
  const comparison = await api.compareStocks('THYAO', 'GARAN');
  console.log(comparison);
}

// En çok yükselenler
async function topGainers() {
  const gainers = await api.getTopGainers(5);
  console.log(gainers);
}

// En çok düşenler
async function topLosers() {
  const losers = await api.getTopLosers(5);
  console.log(losers);
}

// En yüksek hacimli hisseler
async function topVolume() {
  const volume = await api.getTopVolume(5);
  console.log(volume);
}

// Watchlist işlemleri
api.watchlist.addToWatchlist('THYAO', 'Türk Hava Yolları');
api.watchlist.addToWatchlist('GARAN', 'Garanti Bankası');

const watchlist = api.watchlist.getWatchlist();
console.log(watchlist);

// Watchlist verilerini getir
async function getWatchlistData() {
  const stocks = await api.getWatchlistData();
  console.log(stocks);
}

// Verileri export et
const { exportToJSON, exportToCSV } = api.utils;
const stocks = await api.getPopularStocks();
exportToJSON(stocks, 'stocks.json');
exportToCSV(stocks, 'stocks.csv');
```

## 🎨 CLI Screenshots / Ekran Görüntüleri

```
$ borsa endeks XU100

📊 BIST 100 (XU100)
──────────────────────────────────────────────────
Değer:      9234.56
Değişim:    ▲ 123.45 (1.35%)
Yüksek:     9250.00
Düşük:      9100.00
Hacim:      12,345,678
──────────────────────────────────────────────────
```

## 🔧 API Methods / API Metodları

### `getIndex(symbol)`
Get index data / Endeks verisi al

**Parameters:**
- `symbol` (string) - Index symbol (XU100, XU030, etc.)

**Returns:** Promise<Object>

### `getStock(symbol)`
Get stock data / Hisse senedi verisi al

**Parameters:**
- `symbol` (string) - Stock symbol (THYAO, GARAN, etc.)

**Returns:** Promise<Object>

### `getPopularStocks()`
Get popular stocks / Popüler hisseleri al

**Returns:** Promise<Array>

### `getAllIndexes()`
Get all BIST indexes / Tüm BIST endekslerini al

**Returns:** Promise<Array>

### `searchStock(query)`
Search stocks / Hisse ara

**Parameters:**
- `query` (string) - Search term

**Returns:** Promise<Array>

### `compareStocks(symbol1, symbol2)`
Compare two stocks / İki hisseyi karşılaştır

**Parameters:**
- `symbol1` (string) - First stock symbol
- `symbol2` (string) - Second stock symbol

**Returns:** Promise<Object>

### `getTopGainers(limit)`
Get top gaining stocks / En çok yükselenleri al

**Parameters:**
- `limit` (number) - Number of results (default: 10)

**Returns:** Promise<Array>

### `getTopLosers(limit)`
Get top losing stocks / En çok düşenleri al

**Parameters:**
- `limit` (number) - Number of results (default: 10)

**Returns:** Promise<Array>

### `getTopVolume(limit)`
Get highest volume stocks / En yüksek hacimli hisseleri al

**Parameters:**
- `limit` (number) - Number of results (default: 10)

**Returns:** Promise<Array>

### `getWatchlistData()`
Get watchlist stocks data / İzleme listesi verilerini al

**Returns:** Promise<Array>

### Watchlist Methods

- `api.watchlist.addToWatchlist(symbol, name)` - Add to watchlist
- `api.watchlist.removeFromWatchlist(symbol)` - Remove from watchlist
- `api.watchlist.getWatchlist()` - Get watchlist
- `api.watchlist.clearWatchlist()` - Clear watchlist

### Utility Methods

- `api.utils.exportToJSON(data, filename)` - Export to JSON
- `api.utils.exportToCSV(data, filename)` - Export to CSV
- `api.utils.getTopGainers(stocks, limit)` - Filter top gainers
- `api.utils.getTopLosers(stocks, limit)` - Filter top losers
- `api.utils.getTopVolume(stocks, limit)` - Filter by volume

## 📋 Available Indexes / Mevcut Endeksler

- `XU100` - BIST 100
- `XU030` - BIST 30
- `XBANK` - Banka Endeksi
- `XUSIN` - Sınai Endeksi
- `XGIDA` - Gıda Endeksi
- `XHOLD` - Holding Endeksi
- `XUTEK` - Teknoloji Endeksi

## ❓ FAQ / Sık Sorulan Sorular

### Veri kaynağınız nedir?

Bu paket Yahoo Finance gibi üçüncü parti kaynaklardan **gecikmeli ve halka açık** borsa verilerini çeker. BIST'in resmi API'si değildir.

### Veriler gerçek zamanlı mı?

Hayır. Veriler gecikmeli (delayed) olarak sağlanır. Gerçek zamanlı veri için BIST'ten resmi lisans almanız gerekmektedir.

### Lisans durumu nedir?

BIST verileri telif hakkı ve lisans haklarına tabidir. Bu paket:
- Sadece gecikmeli ve halka açık verileri kullanır
- Eğitim ve kişisel kullanım içindir
- Ticari veri dağıtımı yapmaz
- Gerçek zamanlı veri dağıtımı için BIST lisansı gereklidir

### Ticari projemde kullanabilir miyim?

Bu paket eğitim ve kişisel kullanım amaçlıdır. Ticari kullanım için:
1. BIST'ten resmi veri dağıtım lisansı almanız
2. Veri sağlayıcınızın (Yahoo Finance vb.) kullanım koşullarına uymanız gerekir

### Yatırım kararlarımda kullanabilir miyim?

Bu araç sadece bilgilendirme amaçlıdır, yatırım tavsiyesi değildir. Yatırım kararlarınızı verirken:
- Profesyonel danışmanlık alın
- Güncel ve resmi kaynaklardan veri kullanın
- Risk yönetimi yapın

### What is your data source?

This package fetches **delayed and publicly available** stock market data from third-party sources like Yahoo Finance. It is not an official BIST API.

### Is the data real-time?

No. Data is provided with delay. For real-time data, you need to obtain an official license from BIST.

### What about licensing?

BIST data is subject to copyright and licensing rights. This package:
- Only uses delayed and publicly available data
- Is for educational and personal use
- Does not distribute commercial data
- Real-time data distribution requires BIST license

### Can I use it in my commercial project?

This package is for educational and personal use. For commercial use:
1. You need to obtain an official data distribution license from BIST
2. You must comply with your data provider's (Yahoo Finance, etc.) terms of service

### Can I use it for investment decisions?

This tool is for informational purposes only, not financial advice. When making investment decisions:
- Consult with professionals
- Use current and official data sources
- Practice risk management

## 🤝 Contributing / Katkıda Bulunma

Contributions are welcome! / Katkılarınızı bekliyoruz!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License / Lisans

MIT License - see LICENSE file for details

## 👨‍💻 Author / Geliştirici

<div align="center">

### İhsan Baki Doğan

**Full Stack Developer | Open Source Enthusiast**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ibidi)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ibidi)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/ihsanbakidogann)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/ihsanbakidogan)

📧 info@ihsanbakidogan.com

</div>

## ⚠️ Disclaimer / Uyarı

### Veri Kaynağı ve Lisans / Data Source & License

**Önemli:** Bu paket, Yahoo Finance gibi üçüncü parti kaynaklardan **gecikmeli ve halka açık** borsa verilerini çeker. 

- ✅ Veriler **gecikmeli** (delayed) olarak sağlanır
- ✅ Eğitim ve kişisel kullanım amaçlıdır
- ❌ BIST'in resmi API'si değildir
- ❌ Gerçek zamanlı (real-time) veri sağlamaz
- ❌ Ticari kullanım için uygun değildir

**Important:** This package fetches **delayed and publicly available** stock market data from third-party sources like Yahoo Finance.

- ✅ Data is provided with **delay**
- ✅ For educational and personal use
- ❌ Not an official BIST API
- ❌ Does not provide real-time data
- ❌ Not suitable for commercial use

### Lisans Uyarısı / License Notice

BIST verileri telif hakkı, lisans ve dağıtım haklarına tabidir. Gerçek zamanlı veri dağıtımı için BIST'ten resmi lisans almanız gerekmektedir. Bu paket:

- Sadece gecikmeli ve halka açık verileri kullanır
- Eğitim ve araştırma amaçlıdır
- Ticari veri dağıtımı yapmaz
- Kullanıcıların kendi sorumluluğundadır

BIST data is subject to copyright, licensing, and distribution rights. For real-time data distribution, you need to obtain an official license from BIST. This package:

- Only uses delayed and publicly available data
- Is for educational and research purposes
- Does not distribute commercial data
- Users are responsible for their own usage

### Yatırım Tavsiyesi Değildir / Not Financial Advice

Bu araç sadece bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir. Yatırım kararlarınızı verirken profesyonel danışmanlık alınız.

This tool is for informational purposes only. Not financial advice. Consult with professionals before making investment decisions.

---

<div align="center">

**Made with ❤️ by [ibidi](https://github.com/ibidi)**

If you find this project helpful, please give it a ⭐️

</div>
