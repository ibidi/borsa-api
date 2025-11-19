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
  .version('1.0.3');

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

program.parse();
