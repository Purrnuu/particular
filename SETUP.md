# Development Setup Guide

This guide will help you set up your development environment for the Particular library.

## Prerequisites

### Node.js Version Manager (NVM)

This project uses Node.js 22.12.0 (LTS). We recommend using NVM to manage Node versions.

#### Installing NVM

**macOS/Linux:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Or with wget:
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

After installation, restart your terminal or run:
```bash
source ~/.zshrc  # or ~/.bashrc for bash users
```

#### Using NVM with This Project

Once NVM is installed, navigate to the project directory and run:

```bash
# Install the correct Node version
nvm install

# Use the project's Node version
nvm use

# Verify the version
node --version  # Should output v22.12.0
```

**Tip:** NVM will automatically use the version specified in `.nvmrc` when you `cd` into the project directory if you add this to your shell config:

**For Zsh (~/.zshrc):**
```bash
# Auto-switch Node version when entering a directory with .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local nvmrc_path="$(nvm_find_nvmrc)"
  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

**For Bash (~/.bashrc):**
```bash
# Auto-switch Node version when entering a directory with .nvmrc
cdnvm() {
    command cd "$@" || return $?
    nvm_path=$(nvm_find_nvmrc)
    if [[ -n $nvm_path ]]; then
        nvm use
    fi
}
alias cd='cdnvm'
cd "$PWD"
```

## Installation

Once Node.js is set up:

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

## Development

### Start Storybook (Development Mode)

```bash
npm run storybook
```

This will start Storybook at http://localhost:6006 with hot module replacement.

### Build the Library

```bash
npm run build:lib
```

This creates optimized builds in the `dist/` directory:
- `dist/index.js` - ESM format
- `dist/index.cjs` - CommonJS format
- `dist/index.d.ts` - TypeScript definitions

### Watch Mode (Development)

```bash
npm run dev
```

This will rebuild the library automatically when you make changes.

## Testing

### Run Tests Once

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm test -- --coverage
```

## Type Checking

### Type Check Once

```bash
npm run type-check
```

### Type Check in Watch Mode

```bash
npm run type-check -- --watch
```

## Linting

### Check for Issues

```bash
npm run lint
```

### Auto-fix Issues

```bash
npm run lint:fix
```

## Formatting

Format code with Prettier:

```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

## Building Storybook (Static)

To build a static version of Storybook:

```bash
npm run build:storybook
```

This creates a static site in the `docs/` directory.

## Project Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build` | Build library + Storybook |
| `npm run build:lib` | Build library only |
| `npm run build:storybook` | Build Storybook static site |
| `npm run dev` | Watch mode for library |
| `npm run storybook` | Start Storybook dev server |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run type-check` | TypeScript type checking |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run clean` | Remove build artifacts |

## IDE Setup

### VS Code (Recommended)

Install these extensions:
- **ESLint** - Microsoft
- **Prettier** - Prettier
- **TypeScript Vue Plugin (Volar)** - Vue (for better TS support)

Recommended VS Code settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### WebStorm / IntelliJ IDEA

1. Enable ESLint: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable Prettier: Settings → Languages & Frameworks → JavaScript → Prettier
3. Set Node.js interpreter to use NVM version

## Troubleshooting

### "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### NVM not found

Make sure you've sourced your shell config after installing NVM:
```bash
source ~/.zshrc  # or ~/.bashrc
```

### Port 6006 already in use

Kill the existing process:
```bash
lsof -ti:6006 | xargs kill -9
```

Or use a different port:
```bash
npm run storybook -- -p 6007
```

### TypeScript errors

Ensure you're using the workspace TypeScript version:
```bash
npm run type-check
```

## Next Steps

1. ✅ Set up NVM and install Node 22.12.0
2. ✅ Install dependencies with `npm install`
3. ✅ Start Storybook with `npm run storybook`
4. 🎨 Start building particle effects!

## Resources

- [NVM Documentation](https://github.com/nvm-sh/nvm)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Vitest Documentation](https://vitest.dev/)
- [tsup Documentation](https://tsup.egoist.dev/)

## Getting Help

If you encounter any issues, please check:
1. This SETUP.md file
2. MIGRATION.md for upgrade-specific issues
3. GitHub Issues for known problems

Happy coding! 🚀
