/**
 * 실제 API 문서의 링크를 테스트 케이스로 변환하는 스크립트
 */

import path from 'path';
import fs from 'fs';
import { globSync } from 'glob';

// 카테고리 정보
const CATEGORIES = [
    'core',
    'openai',
    'anthropic',
    'langchain',
    'replicate',
    'tools'
];

// 링크 처리 로직 (generate-api-docs.js 파일에서 가져온 로직)
function processLinks(content, fileName, fileDir, categoryName) {
    // 확장자 없는 파일명
    const fileNameWithoutExt = fileName.replace('.md', '');
    // 현재 파일의 절대 경로 (URL 기준)
    const absolutePath = `/${fileDir}/${fileNameWithoutExt}`;

    // 1. 같은 파일 내에서 자기 자신을 참조하는 링크 수정
    const selfRegex = new RegExp(`\\]\\(${fileNameWithoutExt}\\.md(#[^)]*)?\\)`, 'g');
    content = content.replace(selfRegex, (match, anchor) => {
        return `](${absolutePath}${anchor || ''})`;
    });

    // 2. 파일명만 있는 링크(경로가 없는 링크) 처리
    content = content.replace(
        /\]\(([^\/\.]+)\.md(#[^)]*)?/g,
        (match, linkFileName, anchor) => {
            // 자기 자신을 참조하는 경우는 이미 위에서 처리했으므로 건너뜀
            if (linkFileName === fileNameWithoutExt) {
                return match; // 이미 처리됨
            }

            // README.md는 특별 처리
            if (linkFileName.toLowerCase() === 'readme') {
                return `](/api-reference/${categoryName}/${anchor || ''})`;
            }

            // 같은 디렉토리의 다른 파일 참조 -> 절대 경로로 변경
            return `](/${fileDir}/${linkFileName}${anchor || ''})`;
        }
    );

    // 3. ../interfaces/XXX.md -> /api-reference/카테고리명/interfaces/XXX
    content = content.replace(/\]\(\.\.\/interfaces\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/interfaces/$1$2)`);

    // 4. ../classes/XXX.md -> /api-reference/카테고리명/classes/XXX
    content = content.replace(/\]\(\.\.\/classes\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/classes/$1$2)`);

    // 5. interfaces/XXX.md -> /api-reference/카테고리명/interfaces/XXX
    content = content.replace(/\]\(interfaces\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/interfaces/$1$2)`);

    // 6. classes/XXX.md -> /api-reference/카테고리명/classes/XXX
    content = content.replace(/\]\(classes\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/classes/$1$2)`);

    // 7. README.md#XXX -> /api-reference/카테고리명/#XXX
    content = content.replace(/\]\(README\.md(#[^)]+)?\)/g, (match, section) => {
        if (section) {
            return `](/api-reference/${categoryName}/${section})`;
        } else {
            return `](/api-reference/${categoryName}/)`;
        }
    });

    // 8. ../README.md#XXX -> /api-reference/카테고리명/#XXX
    content = content.replace(/\]\(\.\.\/README\.md(#[^)]+)?\)/g, (match, section) => {
        if (section) {
            return `](/api-reference/${categoryName}/${section})`;
        } else {
            return `](/api-reference/${categoryName}/)`;
        }
    });

    // 9. ../ -> /api-reference/카테고리명/
    content = content.replace(/\]\(\.\.\/(#[^)]+)?\)/g, (match, anchor) => {
        if (anchor) {
            return `](/api-reference/${categoryName}/${anchor})`;
        } else {
            return `](/api-reference/${categoryName}/)`;
        }
    });

    // 10. 다른 링크의 .md 확장자 제거
    content = content.replace(/\]\(([^)]+)\.md(#[^)]*)?\)/g, (match, path, anchor) => {
        if (path.startsWith('/api-reference/')) {
            return match;
        }
        return `](${path}${anchor || ''})`;
    });

    return content;
}

// 실제 API 문서에서 링크 추출
function extractLinksFromDocs(docsDir) {
    console.log(`🔍 API 문서에서 링크 추출 중: ${docsDir}`);

    if (!fs.existsSync(docsDir)) {
        console.error(`❌ API 문서 디렉토리(${docsDir})가 존재하지 않습니다.`);
        return [];
    }

    // 모든 마크다운 파일 찾기
    const mdFiles = globSync(path.join(docsDir, '**/*.md'));
    console.log(`🔍 ${mdFiles.length}개의 마크다운 파일을 찾았습니다.`);

    const links = [];
    const processedLinks = new Set(); // 중복 제거를 위한 세트

    // 각 파일에서 링크 추출
    mdFiles.forEach(filePath => {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileName = path.basename(filePath);
            const fileDir = path.relative(docsDir, path.dirname(filePath));

            // 카테고리 이름 추출
            const dirParts = fileDir.split(path.sep);
            const categoryName = dirParts.length > 0 ? dirParts[0] : '';

            // 모든 마크다운 링크 추출 (정규식: [텍스트](링크))
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            let match;

            while ((match = linkRegex.exec(content)) !== null) {
                const linkText = match[1];
                const linkUrl = match[2];
                const fullMatch = match[0];

                // 이미 처리된 링크는 건너뛰기
                if (processedLinks.has(fullMatch)) continue;
                processedLinks.add(fullMatch);

                // 링크 처리 결과 계산
                const processedContent = processLinks(fullMatch, fileName, fileDir, categoryName);

                links.push({
                    description: `링크 테스트 - ${path.relative(docsDir, filePath)}`,
                    fileName,
                    fileDir,
                    categoryName,
                    input: fullMatch,
                    originalLink: linkUrl,
                    expectedOutput: processedContent,
                    filePath: path.relative(docsDir, filePath)
                });
            }
        } catch (error) {
            console.error(`⚠️ ${filePath} 파일 처리 중 오류 발생:`, error);
        }
    });

    return links;
}

// 테스트 케이스로 변환
function convertToTestCases(links) {
    // 중복 제거 및 최대 20개로 제한
    const uniqueLinks = Array.from(new Set(links.map(link => JSON.stringify(link))))
        .map(json => JSON.parse(json))
        .slice(0, 20);

    // 테스트 케이스 형식으로 변환
    return uniqueLinks.map((link, index) => {
        return {
            description: `실제 문서 링크 테스트 #${index + 1}: ${link.description}`,
            fileName: link.fileName,
            fileDir: link.fileDir,
            categoryName: link.categoryName,
            input: link.input,
            expectedOutput: link.expectedOutput
        };
    });
}

// 테스트 케이스를 출력
function outputTestCases(testCases) {
    console.log('\n// 실제 API 문서에서 추출한 링크 테스트 케이스');
    console.log('const REAL_DOC_TEST_CASES = [');

    testCases.forEach((testCase, index) => {
        console.log(`  // ${index + 1}. ${testCase.description}`);
        console.log('  {');
        console.log(`    description: '${testCase.description.replace(/'/g, "\\'")}',`);
        console.log(`    fileName: '${testCase.fileName.replace(/'/g, "\\'")}',`);
        console.log(`    fileDir: '${testCase.fileDir.replace(/'/g, "\\'")}',`);
        console.log(`    input: ${JSON.stringify(testCase.input)},`);
        console.log(`    expectedOutput: ${JSON.stringify(testCase.expectedOutput)}`);
        console.log('  },');
    });

    console.log('];');
}

// 테스트 케이스를 파일로 저장
function saveTestCasesToFile(testCases, outputPath) {
    const jsContent = `/**
 * 실제 API 문서에서 추출한 링크 테스트 케이스
 * 이 파일은 extract-test-cases.js 스크립트에 의해 자동 생성되었습니다.
 */

// 실제 API 문서에서 추출한 링크 테스트 케이스
const REAL_DOC_TEST_CASES = ${JSON.stringify(testCases, null, 2)};

export default REAL_DOC_TEST_CASES;
`;

    fs.writeFileSync(outputPath, jsContent);
    console.log(`✅ 테스트 케이스가 파일로 저장되었습니다: ${outputPath}`);
}

// 메인 함수
function main() {
    // API 문서 디렉토리 경로 (명령줄 인수로 받거나 기본값 사용)
    const docsDir = process.argv[2] || '/Users/jungyoun/Documents/dev/robota/docs/api-reference';

    // 출력 파일 경로
    const outputPath = process.argv[3] || path.join(process.cwd(), 'website/scripts/real-doc-test-cases.js');

    // 링크 추출
    const links = extractLinksFromDocs(docsDir);
    console.log(`🔍 ${links.length}개의 링크를 추출했습니다.`);

    if (links.length === 0) {
        console.log('⚠️ 추출된 링크가 없습니다.');
        return;
    }

    // 테스트 케이스 생성
    const testCases = convertToTestCases(links);
    console.log(`✅ ${testCases.length}개의 테스트 케이스를 생성했습니다.`);

    // 테스트 케이스 출력
    outputTestCases(testCases);

    // 테스트 케이스 파일로 저장
    saveTestCasesToFile(testCases, outputPath);

    console.log('\n💡 테스트 케이스 사용 방법:');
    console.log('1. test-link-regex.js 파일에 다음 코드를 추가하세요:');
    console.log('   import REAL_DOC_TEST_CASES from \'./real-doc-test-cases.js\';');
    console.log('   const TEST_CASES = [...기존_테스트_케이스, ...REAL_DOC_TEST_CASES];');
    console.log('2. 마찬가지로 test-prerender-links.js 파일에도 동일하게 추가하세요.');
}

// 스크립트 실행
main(); 