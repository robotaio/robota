const withNextra = require('nextra')({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.jsx',
    // docs 디렉토리를 직접 사용하도록 설정
    defaultShowCopyCode: true,
    readingTime: true,
    nextraDir: '../docs'
})

module.exports = withNextra({
    // 상대 경로 설정으로 /robota/ 또는 / 모두 지원
    basePath: '',
    assetPrefix: '.',
    trailingSlash: true,

    // i18n 설정 제거

    // 정적 내보내기 설정 추가
    output: 'export',

    // 이미지 최적화 비활성화
    images: {
        unoptimized: true
    },

    // docs 디렉토리를 페이지 소스로 사용
    pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],

    // 콘텐츠 소스 디렉토리 설정
    experimental: {
        externalDir: true
    }
}) 