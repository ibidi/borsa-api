#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const Table = require('cli-table3');
const ora = require('ora');
const BorsaAPI = require('../src/index');

const program = new Command();
const api = new BorsaAPI();

program
  .name('borsa')
  .description('Türk Borsası (BIST) CLI aracı')
  .version('1.1.2');

// Endeks komutu
program
  .command('endeks [symbol]')
  .description('BIST endeks verilerini gösterir (varsayılan: XU100)')
  .action(async (symbol = 'XU100') => {
    const spinner = ora(`${symbol} endeksi getiriliyor...`).start();
    
    try {
      const data = await api.getIndex(symbol);
      spinner.succeed(chalk.green('Veri alındı!'));
      
      console.log('\n' + chalk.blue.bold(`📊 ${data.name} (${data.symbol})`));
      console.log(chalk.gray('─'.repeat(50)));
      
      const changeColor = data.change >= 0 ? chalk.green : chalk.red;
      const changeSymbol = data.change >= 0 ? '▲' : '▼';
      
      console.log(`${chalk.white('Değer:')}      ${chalk.yellow.bold(data.value.toFixed(2))}`);
      console.log(`${chalk.white('Değişim:')}    ${changeColor(changeSymbol + ' ' + data.change.toFixed(2))} ${changeColor('(' + data.changePercent.toFixed(2) + '%)')}`);
      console.log(`${chalk.white('Yüksek:')}     ${chalk.cyan(data.high.toFixed(2))}`);
      console.log(`${chalk.white('Düşük:')}      ${chalk.cyan(data.low.toFixed(2))}`);
      console.log(`${chalk.white('Hacim:')}      ${chalk.magenta(data.volume.toLocaleString('tr-TR'))}`);
      console.log(chalk.gray('─'.repeat(50)) + '\n');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Hisse komutu
program
  .command('hisse <symbol>')
  .description('Hisse senedi verilerini gösterir')
  .action(async (symbol) => {
    const spinner = ora(`${symbol} hissesi getiriliyor...`).start();
    
    try {
      const data = await api.getStock(symbol.toUpperCase());
      spinner.succeed(chalk.green('Veri alındı!'));
      
      console.log('\n' + chalk.blue.bold(`📈 ${data.name} (${data.symbol})`));
      console.log(chalk.gray('─'.repeat(50)));
      
      const changeColor = data.change >= 0 ? chalk.green : chalk.red;
      const changeSymbol = data.change >= 0 ? '▲' : '▼';
      
      console.log(`${chalk.white('Fiyat:')}      ${chalk.yellow.bold(data.price.toFixed(2) + ' ₺')}`);
      console.log(`${chalk.white('Değişim:')}    ${changeColor(changeSymbol + ' ' + data.change.toFixed(2))} ${changeColor('(' + data.changePercent.toFixed(2) + '%)')}`);
      console.log(`${chalk.white('Açılış:')}     ${chalk.cyan(data.open.toFixed(2) + ' ₺')}`);
      console.log(`${chalk.white('Yüksek:')}     ${chalk.cyan(data.high.toFixed(2) + ' ₺')}`);
      console.log(`${chalk.white('Düşük:')}      ${chalk.cyan(data.low.toFixed(2) + ' ₺')}`);
      console.log(`${chalk.white('Hacim:')}      ${chalk.magenta(data.volume.toLocaleString('tr-TR'))}`);
      console.log(chalk.gray('─'.repeat(50)) + '\n');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Popüler hisseler komutu
program
  .command('populer')
  .description('Popüler hisseleri listeler')
  .action(async () => {
    const spinner = ora('Popüler hisseler getiriliyor...').start();
    
    try {
      const stocks = await api.getPopularStocks();
      spinner.succeed(chalk.green('Veri alındı!'));
      
      console.log('\n' + chalk.blue.bold('🔥 Popüler Hisseler'));
      console.log(chalk.gray('─'.repeat(80)) + '\n');
      
      const table = new Table({
        head: [
          chalk.white.bold('Sembol'),
          chalk.white.bold('Ad'),
          chalk.white.bold('Fiyat'),
          chalk.white.bold('Değişim'),
          chalk.white.bold('%')
        ],
        style: {
          head: [],
          border: ['gray']
        }
      });
      
      stocks.slice(0, 10).forEach(stock => {
        const changeColor = stock.change >= 0 ? chalk.green : chalk.red;
        const changeSymbol = stock.change >= 0 ? '▲' : '▼';
        
        table.push([
          chalk.cyan(stock.symbol),
          stock.name.substring(0, 20),
          chalk.yellow(stock.price.toFixed(2) + ' ₺'),
          changeColor(changeSymbol + ' ' + stock.change.toFixed(2)),
          changeColor(stock.changePercent.toFixed(2) + '%')
        ]);
      });
      
      console.log(table.toString());
      console.log('');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Tüm endeksler komutu
program
  .command('endeksler')
  .description('Tüm BIST endekslerini gösterir')
  .action(async () => {
    const spinner = ora('Endeksler getiriliyor...').start();
    
    try {
      const indexes = await api.getAllIndexes();
      spinner.succeed(chalk.green('Veri alındı!'));
      
      console.log('\n' + chalk.blue.bold('📊 BIST Endeksleri'));
      console.log(chalk.gray('─'.repeat(80)) + '\n');
      
      const table = new Table({
        head: [
          chalk.white.bold('Sembol'),
          chalk.white.bold('Ad'),
          chalk.white.bold('Değer'),
          chalk.white.bold('Değişim'),
          chalk.white.bold('%')
        ],
        style: {
          head: [],
          border: ['gray']
        }
      });
      
      indexes.forEach(index => {
        const changeColor = index.change >= 0 ? chalk.green : chalk.red;
        const changeSymbol = index.change >= 0 ? '▲' : '▼';
        
        table.push([
          chalk.cyan(index.symbol),
          index.name,
          chalk.yellow(index.value.toFixed(2)),
          changeColor(changeSymbol + ' ' + index.change.toFixed(2)),
          changeColor(index.changePercent.toFixed(2) + '%')
        ]);
      });
      
      console.log(table.toString());
      console.log('');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Arama komutu
program
  .command('ara <query>')
  .description('Hisse senedi arar')
  .action(async (query) => {
    const spinner = ora(`"${query}" aranıyor...`).start();
    
    try {
      const results = await api.searchStock(query);
      spinner.succeed(chalk.green(`${results.length} sonuç bulundu!`));
      
      if (results.length === 0) {
        console.log(chalk.yellow('\nSonuç bulunamadı.\n'));
        return;
      }
      
      console.log('\n' + chalk.blue.bold(`🔍 Arama Sonuçları: "${query}"`));
      console.log(chalk.gray('─'.repeat(80)) + '\n');
      
      const table = new Table({
        head: [
          chalk.white.bold('Sembol'),
          chalk.white.bold('Ad'),
          chalk.white.bold('Fiyat'),
          chalk.white.bold('Değişim'),
          chalk.white.bold('%')
        ],
        style: {
          head: [],
          border: ['gray']
        }
      });
      
      results.forEach(stock => {
        const changeColor = stock.change >= 0 ? chalk.green : chalk.red;
        const changeSymbol = stock.change >= 0 ? '▲' : '▼';
        
        table.push([
          chalk.cyan(stock.symbol),
          stock.name.substring(0, 25),
          chalk.yellow(stock.price.toFixed(2) + ' ₺'),
          changeColor(changeSymbol + ' ' + stock.change.toFixed(2)),
          changeColor(stock.changePercent.toFixed(2) + '%')
        ]);
      });
      
      console.log(table.toString());
      console.log('');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Watchlist komutu
program
  .command('watchlist')
  .description('İzleme listesi işlemleri')
  .option('-a, --add <symbol>', 'İzleme listesine ekle')
  .option('-r, --remove <symbol>', 'İzleme listesinden çıkar')
  .option('-c, --clear', 'İzleme listesini temizle')
  .option('-l, --list', 'İzleme listesini göster')
  .action(async (options) => {
    try {
      if (options.add) {
        const result = api.watchlist.addToWatchlist(options.add);
        if (result.success) {
          console.log(chalk.green('✓ ' + result.message));
        } else {
          console.log(chalk.yellow('⚠ ' + result.message));
        }
      } else if (options.remove) {
        const result = api.watchlist.removeFromWatchlist(options.remove);
        if (result.success) {
          console.log(chalk.green('✓ ' + result.message));
        } else {
          console.log(chalk.yellow('⚠ ' + result.message));
        }
      } else if (options.clear) {
        const result = api.watchlist.clearWatchlist();
        console.log(chalk.green('✓ ' + result.message));
      } else {
        // Liste göster
        const spinner = ora('İzleme listesi getiriliyor...').start();
        const stocks = await api.getWatchlistData();
        
        if (stocks.length === 0) {
          spinner.info(chalk.yellow('İzleme listesi boş'));
          console.log(chalk.gray('\nKullanım: borsa watchlist --add THYAO\n'));
          return;
        }
        
        spinner.succeed(chalk.green('Veri alındı!'));
        
        console.log('\n' + chalk.blue.bold('⭐ İzleme Listesi'));
        console.log(chalk.gray('─'.repeat(80)) + '\n');
        
        const table = new Table({
          head: [
            chalk.white.bold('Sembol'),
            chalk.white.bold('Ad'),
            chalk.white.bold('Fiyat'),
            chalk.white.bold('Değişim'),
            chalk.white.bold('%')
          ],
          style: {
            head: [],
            border: ['gray']
          }
        });
        
        stocks.forEach(stock => {
          const changeColor = stock.change >= 0 ? chalk.green : chalk.red;
          const changeSymbol = stock.change >= 0 ? '▲' : '▼';
          
          table.push([
            chalk.cyan(stock.symbol),
            stock.name.substring(0, 25),
            chalk.yellow(stock.price.toFixed(2) + ' ₺'),
            changeColor(changeSymbol + ' ' + stock.change.toFixed(2)),
            changeColor(stock.changePercent.toFixed(2) + '%')
          ]);
        });
        
        console.log(table.toString());
        console.log('');
      }
    } catch (error) {
      console.error(chalk.red('Hata: ' + error.message));
      process.exit(1);
    }
  });

// Karşılaştırma komutu
program
  .command('karsilastir <symbol1> <symbol2>')
  .alias('compare')
  .description('İki hisseyi karşılaştırır')
  .action(async (symbol1, symbol2) => {
    const spinner = ora('Hisseler karşılaştırılıyor...').start();
    
    try {
      const comparison = await api.compareStocks(symbol1, symbol2);
      spinner.succeed(chalk.green('Veri alındı!'));
      
      console.log('\n' + chalk.blue.bold('⚖️  Hisse Karşılaştırma'));
      console.log(chalk.gray('─'.repeat(80)) + '\n');
      
      const table = new Table({
        head: ['', chalk.cyan(comparison.stock1.symbol), chalk.cyan(comparison.stock2.symbol)],
        style: {
          head: [],
          border: ['gray']
        }
      });
      
      table.push(
        ['Ad', comparison.stock1.name.substring(0, 25), comparison.stock2.name.substring(0, 25)],
        ['Fiyat', chalk.yellow(comparison.stock1.price.toFixed(2) + ' ₺'), chalk.yellow(comparison.stock2.price.toFixed(2) + ' ₺')],
        ['Değişim %', 
          (comparison.stock1.changePercent >= 0 ? chalk.green : chalk.red)(comparison.stock1.changePercent.toFixed(2) + '%'),
          (comparison.stock2.changePercent >= 0 ? chalk.green : chalk.red)(comparison.stock2.changePercent.toFixed(2) + '%')
        ],
        ['Hacim', comparison.stock1.volume.toLocaleString('tr-TR'), comparison.stock2.volume.toLocaleString('tr-TR')]
      );
      
      console.log(table.toString());
      console.log('');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// En çok yükselenler
program
  .command('yukselenler [limit]')
  .alias('gainers')
  .description('En çok yükselen hisseleri gösterir')
  .action(async (limit = 10) => {
    const spinner = ora('En çok yükselenler getiriliyor...').start();
    
    try {
      const stocks = await api.getTopGainers(parseInt(limit));
      spinner.succeed(chalk.green('Veri alındı!'));
      
      console.log('\n' + chalk.green.bold('📈 En Çok Yükselenler'));
      console.log(chalk.gray('─'.repeat(80)) + '\n');
      
      const table = new Table({
        head: [
          chalk.white.bold('Sembol'),
          chalk.white.bold('Ad'),
          chalk.white.bold('Fiyat'),
          chalk.white.bold('Değişim'),
          chalk.white.bold('%')
        ],
        style: {
          head: [],
          border: ['gray']
        }
      });
      
      stocks.forEach(stock => {
        table.push([
          chalk.cyan(stock.symbol),
          stock.name.substring(0, 25),
          chalk.yellow(stock.price.toFixed(2) + ' ₺'),
          chalk.green('▲ ' + stock.change.toFixed(2)),
          chalk.green(stock.changePercent.toFixed(2) + '%')
        ]);
      });
      
      console.log(table.toString());
      console.log('');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// En çok düşenler
program
  .command('dusenler [limit]')
  .alias('losers')
  .description('En çok düşen hisseleri gösterir')
  .action(async (limit = 10) => {
    const spinner = ora('En çok düşenler getiriliyor...').start();
    
    try {
      const stocks = await api.getTopLosers(parseInt(limit));
      spinner.succeed(chalk.green('Veri alındı!'));
      
      console.log('\n' + chalk.red.bold('📉 En Çok Düşenler'));
      console.log(chalk.gray('─'.repeat(80)) + '\n');
      
      const table = new Table({
        head: [
          chalk.white.bold('Sembol'),
          chalk.white.bold('Ad'),
          chalk.white.bold('Fiyat'),
          chalk.white.bold('Değişim'),
          chalk.white.bold('%')
        ],
        style: {
          head: [],
          border: ['gray']
        }
      });
      
      stocks.forEach(stock => {
        table.push([
          chalk.cyan(stock.symbol),
          stock.name.substring(0, 25),
          chalk.yellow(stock.price.toFixed(2) + ' ₺'),
          chalk.red('▼ ' + stock.change.toFixed(2)),
          chalk.red(stock.changePercent.toFixed(2) + '%')
        ]);
      });
      
      console.log(table.toString());
      console.log('');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// En yüksek hacim
program
  .command('hacim [limit]')
  .alias('volume')
  .description('En yüksek hacimli hisseleri gösterir')
  .action(async (limit = 10) => {
    const spinner = ora('En yüksek hacimli hisseler getiriliyor...').start();
    
    try {
      const stocks = await api.getTopVolume(parseInt(limit));
      spinner.succeed(chalk.green('Veri alındı!'));
      
      console.log('\n' + chalk.magenta.bold('💹 En Yüksek Hacimli Hisseler'));
      console.log(chalk.gray('─'.repeat(80)) + '\n');
      
      const table = new Table({
        head: [
          chalk.white.bold('Sembol'),
          chalk.white.bold('Ad'),
          chalk.white.bold('Fiyat'),
          chalk.white.bold('Hacim'),
          chalk.white.bold('%')
        ],
        style: {
          head: [],
          border: ['gray']
        }
      });
      
      stocks.forEach(stock => {
        const changeColor = stock.change >= 0 ? chalk.green : chalk.red;
        
        table.push([
          chalk.cyan(stock.symbol),
          stock.name.substring(0, 25),
          chalk.yellow(stock.price.toFixed(2) + ' ₺'),
          chalk.magenta(stock.volume.toLocaleString('tr-TR')),
          changeColor(stock.changePercent.toFixed(2) + '%')
        ]);
      });
      
      console.log(table.toString());
      console.log('');
      
    } catch (error) {
      spinner.fail(chalk.red('Hata!'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse();
