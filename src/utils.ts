import * as fs from 'fs';
import { StockData } from './types';

/**
 * Verileri JSON formatında export et
 */
export function exportToJSON(data: any, filename: string = 'borsa-data.json'): string {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  return filename;
}

/**
 * Verileri CSV formatında export et
 */
export function exportToCSV(data: any[], filename: string = 'borsa-data.csv'): string {
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
 */
export function createASCIIChart(values: number[], height: number = 10): string {
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
 */
export function sortByChange(stocks: StockData[], order: 'asc' | 'desc' = 'desc'): StockData[] {
  return stocks.sort((a, b) => {
    const changeA = a.changePercent || 0;
    const changeB = b.changePercent || 0;
    return order === 'desc' ? changeB - changeA : changeA - changeB;
  });
}

/**
 * En çok yükselenleri filtrele
 */
export function getTopGainers(stocks: StockData[], limit: number = 10): StockData[] {
  return sortByChange(stocks, 'desc')
    .filter(s => s.changePercent > 0)
    .slice(0, limit);
}

/**
 * En çok düşenleri filtrele
 */
export function getTopLosers(stocks: StockData[], limit: number = 10): StockData[] {
  return sortByChange(stocks, 'asc')
    .filter(s => s.changePercent < 0)
    .slice(0, limit);
}

/**
 * Hacme göre sırala
 */
export function getTopVolume(stocks: StockData[], limit: number = 10): StockData[] {
  return stocks
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, limit);
}
