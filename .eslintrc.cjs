module.exports = {
  // 기존 내용 유지
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended', // Prettier와 충돌 방지
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 💡 세미콜론 강제
    semi: ['error', 'always'],
    // 💡 쌍따옴표 강제
    quotes: ['error', 'double'],
    // 💡 필요하다면 기타 규칙도 여기에 추가 가능
  },
}
