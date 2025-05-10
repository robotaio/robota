/**
 * TypeDoc을 사용하여 TypeScript 코드에서 마크다운 API 문서를 생성하는 스크립트
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { globSync } from 'glob';

// 디렉토리 경로
const PACKAGES_DIR = path.resolve(process.cwd(), '../packages');
const DOCS_DIR = path.resolve(process.cwd(), '../docs');
const DIST_DIR = path.resolve(process.cwd(), './dist');
const API_DOCS_DIR = path.resolve(DIST_DIR, 'api-reference');

// API 카테고리
const API_CATEGORIES = [
    { name: 'Core', pattern: 'core/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'core/src/index.ts') },
    { name: 'OpenAI', pattern: 'openai/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'openai/src/index.ts') },
    { name: 'Anthropic', pattern: 'anthropic/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'anthropic/src/index.ts') },
    { name: 'LangChain', pattern: 'langchain/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'langchain/src/index.ts') },
    { name: 'Replicate', pattern: 'replicate/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'replicate/src/index.ts') },
    { name: 'Tools', pattern: 'tools/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'tools/src/index.ts') },
];

// 소스 문서를 dist로 복사
function copySourceDocs() {
    console.log('🔍 소스 문서 파일 복사 중...');

    // docs의 모든 마크다운 파일 찾기 (API 참조 디렉토리 제외)
    const mdFiles = globSync(path.join(DOCS_DIR, '**/*.md'), {
        ignore: [path.join(DOCS_DIR, 'api-reference/**')]
    });

    // 각 파일을 dist로 복사
    for (const srcFile of mdFiles) {
        try {
            const relativePath = path.relative(DOCS_DIR, srcFile);
            const destFile = path.join(DIST_DIR, relativePath);
            const destDir = path.dirname(destFile);

            // 디렉토리가 없으면 생성
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }

            // 파일 복사
            fs.copyFileSync(srcFile, destFile);
            console.log(`✅ 파일 복사 완료: ${destFile}`);
        } catch (error) {
            console.error(`⚠️ 파일 복사 중 오류 발생:`, error);
        }
    }

    console.log('🎉 소스 문서 파일 복사 완료!');
}

// API 문서 메인 파일 생성
function generateApiIndexPage() {
    const content = `# Robota API 참조

Robota 라이브러리의 API 문서입니다. 각 클래스, 함수, 타입에 대한 자세한 설명을 확인할 수 있습니다.

## 패키지

${API_CATEGORIES.map(category => `- [${category.name}](${category.name.toLowerCase()}/index.md)`).join('\n')}
`;

    const indexPath = path.resolve(API_DOCS_DIR, 'index.md');
    fs.writeFileSync(indexPath, content);
    console.log(`✅ API 인덱스 페이지 생성 완료: ${indexPath}`);
}

// TypeDoc을 사용하여 API 문서 생성
async function generateDocsForCategory(category) {
    const { name, pattern, entryPoint } = category;

    // 파일 찾기
    const files = globSync(path.join(PACKAGES_DIR, pattern), {
        ignore: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**']
    });

    if (files.length === 0) {
        console.log(`⚠️ ${name} 카테고리에 해당하는 파일을 찾을 수 없습니다.`);
        return 0;
    }

    console.log(`🔍 ${name} 카테고리에서 ${files.length}개 파일 발견`);

    // 카테고리 디렉토리 생성
    const categoryDir = path.join(API_DOCS_DIR, name.toLowerCase());
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }

    // TypeDoc 명령어 실행
    try {
        const tsconfigPath = path.join(PACKAGES_DIR, category.name.toLowerCase(), 'tsconfig.json');
        const command = `npx typedoc --plugin typedoc-plugin-markdown --out ${categoryDir} --entryPoints ${entryPoint} --tsconfig ${tsconfigPath} --name "${name} API" --excludePrivate --excludeProtected --skipErrorChecking`;

        console.log(`실행 명령어: ${command}`);
        execSync(command, { stdio: 'inherit' });

        console.log(`✅ ${name} 카테고리 API 문서 생성 완료: ${categoryDir}`);
        return files.length;
    } catch (error) {
        console.error(`⚠️ ${name} 카테고리 API 문서 생성 중 오류 발생:`, error);
        return 0;
    }
}

// SEO를 위한 정적 HTML 페이지 생성
async function prerenderPages() {
    console.log('🔍 정적 HTML 페이지 생성 중...');

    // 모든 마크다운 파일 찾기
    const mdFiles = globSync(path.join(DIST_DIR, '**/*.md'));

    // 각 마크다운 파일에 대해 정적 HTML 생성
    for (const mdFile of mdFiles) {
        try {
            const relativePath = path.relative(DIST_DIR, mdFile);
            const htmlPath = path.join(DIST_DIR, relativePath.replace('.md', '.html'));
            const htmlDir = path.dirname(htmlPath);

            // 필요한 디렉토리 생성
            if (!fs.existsSync(htmlDir)) {
                fs.mkdirSync(htmlDir, { recursive: true });
            }

            // 마크다운 내용 읽기
            const mdContent = fs.readFileSync(mdFile, 'utf-8');

            // 기본 HTML 템플릿
            const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Robota 문서</title>
  <meta name="description" content="Robota API 문서">
  <link rel="stylesheet" href="/style.css">
  <script>
    // 페이지 로드 시 Docsify 라우팅으로 리다이렉트
    window.onload = function() {
      const currentPath = window.location.pathname;
      if (!currentPath.endsWith('/')) {
        const redirectPath = currentPath.includes('.html') 
          ? currentPath.replace('.html', '') 
          : currentPath;
        window.location.href = '/#' + redirectPath;
      } else {
        window.location.href = '/#' + currentPath;
      }
    };
  </script>
</head>
<body>
  <div id="content">
    ${mdContent}
  </div>
</body>
</html>`;

            // HTML 파일로 저장
            fs.writeFileSync(htmlPath, htmlTemplate);
            console.log(`✅ HTML 파일 생성 완료: ${htmlPath}`);
        } catch (error) {
            console.error(`⚠️ HTML 파일 생성 중 오류 발생:`, error);
        }
    }

    console.log('🎉 정적 HTML 페이지 생성 완료!');
}

async function main() {
    console.log('🔍 문서 생성 작업 시작...');

    // 먼저 소스 문서를 dist로 복사
    copySourceDocs();

    console.log('🔍 TypeDoc을 사용하여 API 문서 생성 중...');

    // 문서 디렉토리 초기화
    if (!fs.existsSync(API_DOCS_DIR)) {
        fs.mkdirSync(API_DOCS_DIR, { recursive: true });
    }

    // API 인덱스 페이지 생성
    generateApiIndexPage();

    // 각 카테고리별 문서 생성
    let totalDocs = 0;
    for (const category of API_CATEGORIES) {
        const count = await generateDocsForCategory(category);
        totalDocs += count;
    }

    console.log(`🎉 API 문서 생성 완료! 총 ${totalDocs}개 파일에 대한 문서가 생성되었습니다.`);

    // SEO를 위한 정적 HTML 페이지 생성
    await prerenderPages();
}

main().catch(error => {
    console.error('❌ API 문서 생성 중 오류 발생:', error);
    process.exit(1);
}); 