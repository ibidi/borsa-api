import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { WatchlistItem, WatchlistResult, WatchlistManagerOptions } from './types';

/**
 * Watchlist Manager - İzleme Listesi Yöneticisi
 * Kullanıcının favori hisselerini lokal olarak saklar
 */
class WatchlistManager {
  private disabled: boolean;
  private configDir?: string;
  private watchlistFile?: string;

  constructor(options: WatchlistManagerOptions = {}) {
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
   */
  private _ensureConfigDir(): void {
    if (this.disabled || !this.configDir) return;

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
   */
  getWatchlist(): WatchlistItem[] {
    if (this.disabled || !this.watchlistFile) return [];

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
   */
  addToWatchlist(symbol: string, name: string = ''): WatchlistResult {
    if (this.disabled || !this.watchlistFile) {
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
   */
  removeFromWatchlist(symbol: string): WatchlistResult {
    if (this.disabled || !this.watchlistFile) {
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
  clearWatchlist(): WatchlistResult {
    if (this.disabled || !this.watchlistFile) {
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

export = WatchlistManager;
