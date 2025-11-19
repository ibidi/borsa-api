/**
 * Utility Functions
 */

/**
 * Verileri JSON formatında export et
 * @param {Object|Array} data - Export edilecek veri
 * @param {string} filename - Dosya adı
 */
function exportToJSON(data, filename = 'borsa-data.json') {
  const fs = require('fs');
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  return filename;
}

/**
 * Verileri CSV formatında export et
 * @param {Array} data - Export edilecek veri (array of objects)
 * @param {string} filename - Dosya adı
 */
function exportToCSV(data, filename = 'borsa-data.csv') {
  const fs = require('fs');
  
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('CSV export için veri array olmalı ve boş olmamalı');
  }

  // Header
  const headers = Object.keys(data[0]);
  let csv = headers.join(',') + '\n';

  // Rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Virgül içeren değerleri tırnak içine al
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });

  fs.writeFileSync(filename, csv);
  return filename;
}

/**
 * Basit ASCII grafik oluştur
 * @param {Array} values - Değerler
 * @param {number} height - Grafik yüksekliği
 * @returns {string}
 */
function createASCIIChart(values, height = 10) {
  if (!values || values.length === 0) return '';

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;

  if (range === 0) return '─'.repeat(values.length);

  const normalized = values.map(v => Math.round(((v - min) / range) * height));
  
  let chart = '';
  for (let h = height; h >= 0; h--) {
    for (let i = 0; i < normalized.length; i++) {
      if (normalized[i] >= h) {
        chart += '█';
      } else {
        chart += ' ';
      }
    }
    chart += '\n';
  }

  return chart;
}

/**
 * Yüzdelik değişime göre sırala
 * @param {Array} stocks - Hisse listesi
 * @param {string} order - 'asc' veya 'desc'
 * @returns {Array}
 */
function sortByChange(stocks, order = 'desc') {
  return stocks.sort((a, b) => {
    const changeA = a.changePercent || 0;
    const changeB = b.changePercent || 0;
    return order === 'desc' ? changeB - changeA : changeA - changeB;
  });
}

/**
 * En çok yükselenleri filtrele
 * @param {Array} stocks - Hisse listesi
 * @param {number} limit - Limit
 * @returns {Array}
 */
function getTopGainers(stocks, limit = 10) {
  return sortByChange(stocks, 'desc')
    .filter(s => s.changePercent > 0)
    .slice(0, limit);
}

/**
 * En çok düşenleri filtrele
 * @param {Array} stocks - Hisse listesi
 * @param {number} limit - Limit
 * @returns {Array}
 */
function getTopLosers(stocks, limit = 10) {
  return sortByChange(stocks, 'asc')
    .filter(s => s.changePercent < 0)
    .slice(0, limit);
}

/**
 * Hacme göre sırala
 * @param {Array} stocks - Hisse listesi
 * @param {number} limit - Limit
 * @returns {Array}
 */
function getTopVolume(stocks, limit = 10) {
  return stocks
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, limit);
}

module.exports = {
  exportToJSON,
  exportToCSV,
  createASCIIChart,
  sortByChange,
  getTopGainers,
  getTopLosers,
  getTopVolume
};
