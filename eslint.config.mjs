import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 本地 AI 工作区与临时产物。
    // 注意：.gitignore 只管 git 不管 ESLint，这里必须单独加，
    // 否则放在这些目录下的 .cjs 脚本会被扫进去报 no-require-imports。
    ".workbuddy/**",
    "**/*.cjs",
  ]),
]);

export default eslintConfig;
