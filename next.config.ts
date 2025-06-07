const { i18n } = require('./next-i18next.config');

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // i18n,  ← 이 줄 완전히 제거!
};
