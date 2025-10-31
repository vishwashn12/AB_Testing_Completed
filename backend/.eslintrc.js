module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['jest'],
  rules: {
    // Code Quality Rules for 0 errors, <10 warnings
    'no-console': 'warn', // Allow console in development, warn in production
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'consistent-return': 'error',
    'no-param-reassign': ['error', { props: false }],
    
    // Best Practices
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'warn',
    'prefer-template': 'warn',
    
    // Style (warn to keep under 10 warnings)
    'max-len': ['warn', { code: 120, ignoreComments: true }],
    'comma-dangle': ['warn', 'always-multiline'],
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    
    // Import rules
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['**/*.test.js', '**/*.spec.js', 'tests/**/*.js'],
    }],
    'import/prefer-default-export': 'off',
    
    // Jest specific
    'jest/expect-expect': 'warn',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/valid-expect': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    '*.config.js',
  ],
};
