# borsa-api 📈

Turkish Stock Market (BIST) API wrapper with beautiful CLI support.

Türk Borsası (BIST) için API wrapper ve CLI aracı.

[![npm version](https://img.shields.io/npm/v/borsa-api?style=flat-square)](https://www.npmjs.com/package/borsa-api)
[![license](https://img.shields.io/npm/l/borsa-api?style=flat-square)](https://github.com/ibidi/borsa-api/blob/main/LICENSE)

## 🚀 Features / Özellikler

- 📊 **BIST Indexes** - XU100, XU030, XBANK, and more
- 📈 **Stock Data** - Real-time stock prices and information
- 🔍 **Search** - Find stocks by name or symbol
- 💻 **CLI Tool** - Beautiful terminal interface
- 📦 **API Wrapper** - Use programmatically in your code
- 🇹🇷 **Turkish Support** - Native Turkish language support

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

## 📋 Available Indexes / Mevcut Endeksler

- `XU100` - BIST 100
- `XU030` - BIST 30
- `XBANK` - Banka Endeksi
- `XUSIN` - Sınai Endeksi
- `XGIDA` - Gıda Endeksi
- `XHOLD` - Holding Endeksi
- `XUTEK` - Teknoloji Endeksi

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

**İhsan Bakıdoğan (ibidi)**

- LinkedIn: [linkedin.com/in/ibidi](https://linkedin.com/in/ibidi)
- Instagram: [instagram.com/ihsanbakidogann](https://instagram.com/ihsanbakidogann)
- X (Twitter): [x.com/ihsanbakidogan](https://x.com/ihsanbakidogan)
- GitHub: [github.com/ibidi](https://github.com/ibidi)

## ⚠️ Disclaimer / Uyarı

**Demo Mode:** This version uses mock/demo data for demonstration purposes. For real-time data, you'll need to integrate with a real BIST API provider.

**Demo Modu:** Bu sürüm demo amaçlı örnek veri kullanmaktadır. Gerçek zamanlı veriler için gerçek bir BIST API sağlayıcısı ile entegrasyon gereklidir.

This tool is for informational purposes only. Not financial advice.

Bu araç sadece bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.

---

<div align="center">

**Made with ❤️ by [ibidi](https://github.com/ibidi)**

If you find this project helpful, please give it a ⭐️

</div>
