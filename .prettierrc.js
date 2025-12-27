module.exports = {
  // Max line length before Prettier wraps
  printWidth: 100,
  // Number of spaces per indentation-level
  tabWidth: 2,
  useTabs: false,
  // Print semicolons at the ends of statements
  semi: true,
  // Use single quotes instead of double quotes
  singleQuote: true,
  // Control when to add quotes to object properties
  quoteProps: 'as-needed',
  // JSX quotes
  jsxSingleQuote: false,
  // Include trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',
  // Spacing between brackets in object literals
  bracketSpacing: true,
  // Place > of a multi-line JSX element at the end of the last line instead of on a new line
  bracketSameLine: false,
  // Include parentheses around a sole arrow function parameter always for clarity
  arrowParens: 'always',
  // How to wrap prose
  proseWrap: 'preserve',
  // Enforce consistent line endings
  endOfLine: 'lf',
  // Format embedded languages (e.g. HTML in markdown)
  embeddedLanguageFormatting: 'auto',

  // File-specific overrides
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        tabWidth: 2,
        useTabs: false,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'always',
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
