const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Watchlist Manager - İzleme Listesi Yöneticisi
 * Kullanıcının favori hisselerini lokal olarak saklar
 */
class WatchlistManager {
  constructor(options = {}) {
    this.disabled = options.disabled || false;
    
    if (!this.disabled) {
      try {
        this.configDir = path.join(os.homedir(), '.borsa-api');
        this.watchlistFile = path.join(this.configDir, 'watchlist.json');
        this._ensureConfigDir();
      } catch (error) {
        // Serverless ortamda dosya sistemi kullanılamaz
        this.disabled = true;
      }
    }
  }

  /**
   * Config klasörünü oluştur
   * @private
   */
  _ensureConfigDir() {
    if (this.disabled) return;
    
    try {
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }
    } catch (error) {
      this.disabled = true;
    }
  }

  /**
   * Watchlist'i oku
   * @returns {Array}
   */
  getWatchlist() {
    if (this.disabled) return [];
    
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
    if (this.disabled) {
      return { success: false, message: 'Watchlist not available in serverless environment' };
    }
    
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

    try {
      fs.writeFileSync(this.watchlistFile, JSON.stringify(watchlist, null, 2));
      return { success: true, message: 'İzleme listesine eklendi' };
    } catch (error) {
      return { success: false, message: 'Failed to save watchlist' };
    }
  }

  /**
   * Watchlist'ten hisse çıkar
   * @param {string} symbol - Hisse sembolü
   */
  removeFromWatchlist(symbol) {
    if (this.disabled) {
      return { success: false, message: 'Watchlist not available in serverless environment' };
    }
    
    let watchlist = this.getWatchlist();
    const initialLength = watchlist.length;
    
    watchlist = watchlist.filter(item => item.symbol !== symbol.toUpperCase());
    
    if (watchlist.length === initialLength) {
      return { success: false, message: 'Hisse izleme listesinde bulunamadı' };
    }

    try {
      fs.writeFileSync(this.watchlistFile, JSON.stringify(watchlist, null, 2));
      return { success: true, message: 'İzleme listesinden çıkarıldı' };
    } catch (error) {
      return { success: false, message: 'Failed to save watchlist' };
    }
  }

  /**
   * Watchlist'i temizle
   */
  clearWatchlist() {
    if (this.disabled) {
      return { success: false, message: 'Watchlist not available in serverless environment' };
    }
    
    try {
      fs.writeFileSync(this.watchlistFile, JSON.stringify([], null, 2));
      return { success: true, message: 'İzleme listesi temizlendi' };
    } catch (error) {
      return { success: false, message: 'Failed to clear watchlist' };
    }
  }
}

module.exports = WatchlistManager;
