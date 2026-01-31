# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-01-25

### Added
- **Search Functionality**: New Trie-based search engine for finding locations across all administrative levels
  - Multi-word search with AND logic (e.g., "Kigali Gasabo")
  - Case-insensitive matching
  - Diacritic-insensitive search (handles accents)
  - Prefix matching support (e.g., "Kig" matches "Kigali")
  - Searches across all 5 levels: province → district → sector → cell → village
  - Performance optimization with result clamping (max 50 results)
  - Zero external dependencies
- Comprehensive test suite for search functionality (64 new tests)
- TypeScript declarations for search engine

### Changed
- Total test count increased from 101 to 165 tests
- Code coverage: 98.4% overall (rwanda.ts: 100%, search.ts: 96.87%)

### Fixed
- ESM compatibility improvements for Node 18+

## [1.3.11] - Previous releases
- See git history for earlier versions
