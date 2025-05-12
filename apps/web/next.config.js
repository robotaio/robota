const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [
            require('remark-gfm'),
        ],
        rehypePlugins: [
            require('rehype-slug'),
            require('rehype-autolink-headings'),
        ],
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    // GitHub Pages 배포를 위한 설정
    output: 'export', // 정적 내보내기 활성화
    basePath: '/robota', // GitHub Pages 기본 경로 설정 (robotaio 조직 계정 사용)
    trailingSlash: true, // 경로 일관성을 위해 유지
    // 불필요한 설정 제거
    experimental: {
        externalDir: true, // 외부 디렉토리에 있는 docs 폴더에 접근하기 위한 설정
    },
    // 개발 모드 최적화
    onDemandEntries: {
        // 페이지를 메모리에 유지하는 시간(ms) 증가
        maxInactiveAge: 60 * 1000,
        // 한 번에 유지할 페이지 수 증가
        pagesBufferLength: 8,
    },
    // 개발 중 빌드 오류 무시 설정
    typescript: {
        // 타입 체크 오류가 있어도 빌드 진행
        ignoreBuildErrors: true,
    },
    eslint: {
        // ESLint 오류가 있어도 빌드 진행
        ignoreDuringBuilds: true,
    },
    // 이미지 최적화 설정
    images: {
        unoptimized: true, // 정적 빌드 시 필요
    },
};

module.exports = withMDX(nextConfig); 