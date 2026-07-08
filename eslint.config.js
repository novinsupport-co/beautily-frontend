import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import tsParser from '@typescript-eslint/parser'
// 👇 مهم: به جای لود کردن کل پلاگین، فقط قواعد مورد نیاز را ایمپورت می‌کنیم
import * as tsPlugin from '@typescript-eslint/eslint-plugin'


export default defineConfig([
  {
    name: 'app/files-to-lint',
    // 👇 اطمینان از شمول فایل‌های TS
    files: ['**/*.{js,mjs,jsx,vue,ts,mts,cts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  js.configs.recommended,

  // --- پیکربندی TypeScript ---
  {
    name: 'typescript/setup',
    files: ['**/*.{ts,cts,mts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // این خطوط برای رفع خطای module resolution ضروری هستند
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
    },
    // 🛑 مهم: قوانین Recommended را مستقیماً اعمال می‌کنیم
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // ...tsPlugin.configs['eslint-recommended'].rules, // اگر نیاز باشد
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
    },
    // 👇 ما دیگر کل پلاگین را به عنوان یک شیء در این بلوک Plugins قرار نمی‌دهیم!
  },

  // --- پیکربندی Vue ---
  // 👇 از آنجایی که @typescript-eslint/eslint-plugin دیگر مستقیما به عنوان یک Plugin لود نمی‌شود،
  // باید قوانین را دستی‌تر اعمال کنیم.
  ...pluginVue.configs['flat/essential'],

  // 👇 بلوک زبان برای فایل‌های Vue
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser, // استفاده از TS Parser برای Script setup در Vue
      },
    },
  },

  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,
])
