# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2024-11-19

### Fixed
- Turkish character normalization in search functionality
- Search now works with both Turkish and ASCII characters (e.g., "koç" and "koc" both work)
- Improved search accuracy for Turkish company names

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
