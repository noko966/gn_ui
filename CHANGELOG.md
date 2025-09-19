# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Vite-based build scripts and Bun wrappers for development and builds
- Storybook Vite framework integration

### Changed

- Migrated build system from Webpack to Vite and updated scripts in `package.json`
- Updated devDependencies to Vite/Storybook for Vite and other supporting packages
- Added `exports` and `module` entry points in `package.json`

### Removed

- Removed legacy Webpack-specific dependencies and scripts
- Removed many pre-built `demo`, `public`, and `storybook-static` artifacts from the repo (clean up)

### BREAKING CHANGES

- `react` and `react-dom` are now regular dependencies pinned to version `19` (previously were peerDependencies). This is a breaking change for consumers that relied on providing their own React version.
- Package `main`/module paths changed to `dist/library/*`; consumers importing the old paths may need to update imports.

Version bump: `2.0.0` -> `3.0.0` (major) to reflect breaking API/dependency changes.
