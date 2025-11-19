const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Watchlist Manager - İzleme Listesi Yöneticisi
 * Kullanıcının favori hisselerini lokal olarak saklar
 */
class WatchlistManager {
  constructor() {
    this.configDir = path.join(os.homedir(), '.borsa-api');
    this.watchlistFile = path.join(this.configDir, 'watchlist.json');
    this._ensureConfigDir();
  }

  /**
   * Config klasörünü oluştur
   * @private
   */
  _ensureConfigDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  /**
   * Watchlist'i oku
   * @returns {Array}
   */
  getWatchlist() {
    try {
      if (fs.existsSync(this.watchlistFile)) {
        const data = fs.readFileSync(this.watchlistFile, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Watchlist'e hisse ekle
   * @param {string} symbol - Hisse sembolü
   * @param {string} name - Hisse adı (opsiyonel)
   */
  addToWatchlist(symbol, name = '') {
    const watchlist = this.getWatchlist();
    
    // Zaten varsa ekleme
    if (watchlist.some(item => item.symbol === symbol.toUpperCase())) {
      return { success: false, message: 'Bu hisse zaten izleme listesinde' };
    }

    watchlist.push({
      symbol: symbol.toUpperCase(),
      name: name,
      addedAt: new Date().toISOString()
    });

    fs.writeFileSync(this.watchlistFile, JSON.stringify(watchlist, null, 2));
    return { success: true, message: 'İzleme listesine eklendi' };
  }

  /**
   * Watchlist'ten hisse çıkar
   * @param {string} symbol - Hisse sembolü
   */
  removeFromWatchlist(symbol) {
    let watchlist = this.getWatchlist();
    const initialLength = watchlist.length;
    
    watchlist = watchlist.filter(item => item.symbol !== symbol.toUpperCase());
    
    if (watchlist.length === initialLength) {
      return { success: false, message: 'Hisse izleme listesinde bulunamadı' };
    }

    fs.writeFileSync(this.watchlistFile, JSON.stringify(watchlist, null, 2));
    return { success: true, message: 'İzleme listesinden çıkarıldı' };
  }

  /**
   * Watchlist'i temizle
   */
  clearWatchlist() {
    fs.writeFileSync(this.watchlistFile, JSON.stringify([], null, 2));
    return { success: true, message: 'İzleme listesi temizlendi' };
  }
}

module.exports = WatchlistManager;
