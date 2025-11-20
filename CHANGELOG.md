# Changelog

All notable changes to this project will be documented in this file.

## [1.1.1] - 2024-11-19

### Fixed
- Fixed npm package missing data-provider.js file
- Updated .npmignore to include all necessary source files

## [1.1.0] - 2024-11-19

### Added
- **Watchlist Feature** - Save and track favorite stocks locally
- **Stock Comparison** - Compare two stocks side by side
- **Top Gainers** - View stocks with highest percentage gains
- **Top Losers** - View stocks with highest percentage losses
- **Volume Leaders** - View stocks with highest trading volume
- **Export Utilities** - Export data to JSON and CSV formats
- **Utility Functions** - Helper functions for data manipulation
- New CLI commands: `watchlist`, `karsilastir`, `yukselenler`, `dusenler`, `hacim`
- Watchlist stored locally in `~/.borsa-api/watchlist.json`

### Improved
- Enhanced API with new methods for filtering and sorting
- Better code organization with separate utility modules
- More comprehensive documentation

## [1.0.4] - 2024-11-19

### Added
- Comprehensive disclaimer about data source and licensing
- FAQ section addressing licensing and data usage questions
- Clear notice about delayed data and educational use only
- Updated package description with licensing information

### Fixed
- Turkish character normalization in search functionality
- Search now works with both Turkish and ASCII characters (e.g., "koç" and "koc" both work)
- Improved search accuracy for Turkish company names

## [1.0.3] - 2024-11-19

### Fixed
- Turkish character normalization in search functionality

## [1.0.2] - 2024-11-18

### Added
- Initial stable release with CLI support

## [1.0.0] - 2024-11-16

### Added
- Initial release
- BIST index data fetching (XU100, XU030, XBANK, etc.)
- Stock data fetching
- Popular stocks listing
- Stock search functionality
- Beautiful CLI with colors and tables
- Loading spinners
- Programmatic API
- Turkish language support
- Comprehensive documentation

### Features
- `borsa endeks [symbol]` - View index data
- `borsa hisse <symbol>` - View stock data
- `borsa populer` - List popular stocks
- `borsa endeksler` - List all indexes
- `borsa ara <query>` - Search stocks
- API wrapper for programmatic use
