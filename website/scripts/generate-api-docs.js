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
const API_DOCS_DIR = path.resolve(DOCS_DIR, 'api-reference');

// API 카테고리
const API_CATEGORIES = [
    { name: 'Core', pattern: 'core/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'core/src/index.ts') },
    { name: 'OpenAI', pattern: 'openai/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'openai/src/index.ts') },
    { name: 'Anthropic', pattern: 'anthropic/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'anthropic/src/index.ts') },
    { name: 'LangChain', pattern: 'langchain/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'langchain/src/index.ts') },
    { name: 'Replicate', pattern: 'replicate/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'replicate/src/index.ts') },
    { name: 'Tools', pattern: 'tools/src/**/*.ts', entryPoint: path.join(PACKAGES_DIR, 'tools/src/index.ts') },
];

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

async function main() {
    console.log('🔍 TypeDoc을 사용하여 API 문서 생성 중...');

    // 문서 디렉토리 초기화
    if (fs.existsSync(API_DOCS_DIR)) {
        fs.rmSync(API_DOCS_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(API_DOCS_DIR, { recursive: true });

    // API 인덱스 페이지 생성
    generateApiIndexPage();

    // 각 카테고리별 문서 생성
    let totalDocs = 0;
    for (const category of API_CATEGORIES) {
        const count = await generateDocsForCategory(category);
        totalDocs += count;
    }

    console.log(`🎉 API 문서 생성 완료! 총 ${totalDocs}개 파일에 대한 문서가 생성되었습니다.`);
}

main().catch(error => {
    console.error('❌ API 문서 생성 중 오류 발생:', error);
    process.exit(1);
}); 