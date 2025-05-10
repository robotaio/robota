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

        // 링크 경로 수정
        fixDocumentLinks(categoryDir, name.toLowerCase());

        console.log(`✅ ${name} 카테고리 API 문서 생성 완료: ${categoryDir}`);
        return files.length;
    } catch (error) {
        console.error(`⚠️ ${name} 카테고리 API 문서 생성 중 오류 발생:`, error);
        return 0;
    }
}

// API 문서 내 링크 경로 수정 (상대 경로 -> 절대 경로)
function fixDocumentLinks(categoryDir, categoryName) {
    console.log(`🔧 ${categoryName} 카테고리 문서 내 링크 경로 수정 중...`);

    // 해당 카테고리의 모든 마크다운 파일 찾기
    const mdFiles = globSync(path.join(categoryDir, '**/*.md'));

    for (const mdFile of mdFiles) {
        try {
            // 현재 파일의 상대 경로 (루트에서부터)
            const relativePath = path.relative(DIST_DIR, mdFile);
            // 현재 파일이 속한 디렉토리 (예: api-reference/core/classes)
            const fileDir = path.dirname(relativePath);
            // 현재 파일명 (예: FunctionRegistry.md)
            const fileName = path.basename(mdFile);

            // 파일 내용 읽기
            let content = fs.readFileSync(mdFile, 'utf-8');

            // 1. 같은 파일 내에서 자기 자신을 참조하는 링크 수정 (예: [`FunctionRegistry`](FunctionRegistry.md))
            // 이 링크는 '#' 또는 '#section'으로 변경 (앵커만 남김)
            const selfRegex = new RegExp(`\\]\\(${fileName}(#[^)]*)?\\)`, 'g');
            content = content.replace(selfRegex, (match, anchor) => {
                console.log(`파일 ${fileName}에서 자기 참조 링크 수정: ${match} -> ](${anchor || ''})`);
                return `](${anchor || ''})`;
            });

            // 특별히 FunctionRegistry 파일을 위한 추가 처리
            if (fileName === 'FunctionRegistry.md') {
                content = content.replace(/\[`FunctionRegistry`\]\(FunctionRegistry\.md\)/g, '[`FunctionRegistry`]()');
            }

            // 2. ../interfaces/XXX.md -> /api-reference/카테고리명/interfaces/XXX (상대 경로를 절대 경로로)
            content = content.replace(/\]\(\.\.\/interfaces\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/interfaces/$1$2)`);

            // 3. ../classes/XXX.md -> /api-reference/카테고리명/classes/XXX (상대 경로를 절대 경로로)
            content = content.replace(/\]\(\.\.\/classes\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/classes/$1$2)`);

            // 4. interfaces/XXX.md -> /api-reference/카테고리명/interfaces/XXX (디렉토리 내 상대 경로도 절대 경로로)
            content = content.replace(/\]\(interfaces\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/interfaces/$1$2)`);

            // 5. classes/XXX.md -> /api-reference/카테고리명/classes/XXX (디렉토리 내 상대 경로도 절대 경로로)
            content = content.replace(/\]\(classes\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/classes/$1$2)`);

            // 6. README.md#XXX -> /api-reference/카테고리명/#XXX (README.md 생략, 앵커 형식으로 변환)
            content = content.replace(/\]\(README\.md(#[^)]+)?\)/g, (match, section) => {
                if (section) {
                    // 섹션 ID가 있는 경우: /api-reference/카테고리명/#섹션명
                    return `](/api-reference/${categoryName}/${section})`;
                } else {
                    // 섹션 ID가 없는 경우: /api-reference/카테고리명/
                    return `](/api-reference/${categoryName}/)`;
                }
            });

            // 7. 서브 디렉토리에서 상위 디렉토리의 README.md 링크 수정 (../README.md#XXX -> /api-reference/카테고리명/#XXX)
            content = content.replace(/\]\(\.\.\/README\.md(#[^)]+)?\)/g, (match, section) => {
                if (section) {
                    // 섹션 ID가 있는 경우: /api-reference/카테고리명/#섹션명
                    return `](/api-reference/${categoryName}/${section})`;
                } else {
                    // 섹션 ID가 없는 경우: /api-reference/카테고리명/
                    return `](/api-reference/${categoryName}/)`;
                }
            });

            // 8. ../ -> /api-reference/카테고리명/ (상위 디렉토리 참조도 절대 경로로)
            content = content.replace(/\]\(\.\.\/(#[^)]+)?\)/g, (match, anchor) => {
                if (anchor) {
                    return `](/api-reference/${categoryName}${anchor})`;
                } else {
                    return `](/api-reference/${categoryName}/)`;
                }
            });

            // 9. ../ 단독 참조 처리
            content = content.replace(/\]\(\.\.\/()\)/g, `](/api-reference/${categoryName}/)`);

            // 10. 다른 마크다운 파일을 참조하는 모든 링크에서 .md 확장자 제거
            content = content.replace(/\]\(([^)]+)\.md(#[^)]*)?\)/g, (match, path, anchor) => {
                // 이미 처리된 절대 경로는 건너뛰기
                if (path.startsWith('/api-reference/')) {
                    return match;
                }
                return `](${path}${anchor || ''})`;
            });

            // 파일 저장
            fs.writeFileSync(mdFile, content);
        } catch (error) {
            console.error(`⚠️ ${mdFile} 파일 링크 수정 중 오류 발생:`, error);
        }
    }

    console.log(`✅ ${categoryName} 카테고리 문서 내 링크 경로 수정 완료`);
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

            // 현재 파일의 카테고리 확인 (예: api-reference/core)
            const categories = relativePath.split('/');
            let categoryName = '';
            if (categories.length >= 2 && categories[0] === 'api-reference') {
                categoryName = categories[1];
            }

            // 마크다운 링크를 HTML 링크로 변환
            let processedContent = mdContent;

            // .md 확장자 제거 (Docsify history 모드에 맞게)
            processedContent = processedContent.replace(/\]\(([^)]+)\.md(#[^)]*)?/g, (match, filePath, anchor) => {
                return `](${filePath}${anchor || ''}`;
            });

            // 자기 참조 링크 처리 (앵커만 남기기)
            const currentFileName = path.basename(mdFile, '.md');
            processedContent = processedContent.replace(
                new RegExp(`\\]\\(${currentFileName}(#[^)]*)?\\)`, 'g'),
                (match, anchor) => `](${anchor || ''})`
            );

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
      // history 모드를 위한 리다이렉트 처리
      const currentPath = window.location.pathname;
      
      // HTML 확장자 제거하여 원래 경로로 리다이렉트
      if (currentPath.endsWith('.html')) {
        window.location.href = currentPath.replace('.html', '');
        return;
      }
      
      // 이미 적절한 경로라면 Docsify로 전달
      window.location.href = '/';
    };
  </script>
</head>
<body>
  <div id="content">
    ${processedContent}
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