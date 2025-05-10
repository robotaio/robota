/**
 * 실제 API 문서의 링크 케이스를 테스트하는 스크립트
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

// 테스트할 링크 패턴 정의
const LINK_PATTERNS = [
    // 상대 경로 링크
    { regex: /\]\(([^)]*?\.md[^)]*?)\)/g, description: '마크다운 링크 (.md 파일)' },
    { regex: /\]\(classes\/([^)]*?)\)/g, description: 'classes 디렉토리 참조' },
    { regex: /\]\(interfaces\/([^)]*?)\)/g, description: 'interfaces 디렉토리 참조' },
    { regex: /\]\(\.\.\/([^)]*?)\)/g, description: '상위 디렉토리 참조' },
    { regex: /\]\(\.\.\/(README\.md[^)]*?)\)/g, description: '상위 디렉토리 README 참조' },
    { regex: /\]\(README\.md([^)]*?)\)/g, description: 'README 파일 참조' },
    // 자기 참조 링크 (파일명이 링크와 동일)
    { regex: /\]\(([^\/]*?)\.md#([^)]*?)\)/g, description: '같은 파일 내 섹션 참조' },
    { regex: /href="#([^"]*?)"/g, description: 'HTML 앵커 참조' }
];

// 링크 유형별 예제 저장을 위한 맵
const linkExamples = new Map();

// 실제 API 문서에서 사용되는 링크 예제 추출
function extractRealLinkExamples(docsDir) {
    if (!fs.existsSync(docsDir)) {
        console.error(`❌ API 문서 디렉토리(${docsDir})가 존재하지 않습니다.`);
        return [];
    }

    console.log(`🔍 API 문서 디렉토리에서 링크 예제 추출 중: ${docsDir}`);

    // 모든 마크다운 파일 찾기
    const mdFiles = globSync(path.join(docsDir, '**/*.md'));
    console.log(`🔍 ${mdFiles.length}개의 마크다운 파일을 찾았습니다.`);

    // 모든 파일을 검사하여 링크 패턴 찾기
    mdFiles.forEach(filePath => {
        const fileName = path.basename(filePath);
        const fileDir = path.relative(docsDir, path.dirname(filePath));
        const content = fs.readFileSync(filePath, 'utf-8');

        // 현재 파일의 상대 경로 (API 참조 디렉토리 기준)
        const relativePath = path.relative(docsDir, filePath);
        // 카테고리 이름 추출
        const dirParts = relativePath.split('/');
        let categoryName = '';
        if (dirParts.length > 0) {
            categoryName = dirParts[0];
        }

        // 각 링크 패턴에 대해 검사
        LINK_PATTERNS.forEach(pattern => {
            const matches = content.match(pattern.regex);
            if (matches && matches.length > 0) {
                if (!linkExamples.has(pattern.description)) {
                    linkExamples.set(pattern.description, []);
                }

                const examples = linkExamples.get(pattern.description);
                matches.forEach(match => {
                    // 예제가 3개 이상 있으면 더 이상 추가하지 않음
                    if (examples.length >= 3) return;

                    // 이미 동일한 예제가 있는지 확인
                    const isDuplicate = examples.some(ex => ex.match === match);
                    if (!isDuplicate) {
                        examples.push({
                            match,
                            fileName,
                            fileDir: fileDir || categoryName,
                            categoryName,
                            filePath: relativePath
                        });
                    }
                });
            }
        });
    });

    // 결과 반환
    const allExamples = [];
    linkExamples.forEach((examples, description) => {
        examples.forEach(example => {
            allExamples.push({
                ...example,
                description
            });
        });
    });

    return allExamples;
}

// 추출된 링크 예제로 테스트 케이스 생성
function createTestCases(examples, docDir) {
    return examples.map(example => {
        // 링크 매치에서 실제 링크 부분만 추출 ('](' 와 ')' 사이)
        const linkMatch = example.match.match(/\]\((.*?)\)/);
        const link = linkMatch ? linkMatch[1] : '';

        // 예상 결과 - 현재 문서의 링크 처리 로직에 따라 계산해야 함
        // 여기서는 간략화를 위해 더미 예상 결과를 사용
        let expectedOutput = `[링크](/${example.fileDir}/${link.replace('.md', '')})`;

        return {
            description: `${example.description} - ${example.filePath}`,
            fileName: example.fileName,
            fileDir: example.fileDir,
            categoryName: example.categoryName,
            input: example.match,
            originalLink: link,
            expectedOutput: expectedOutput,
            // 링크 처리 테스트 시 실제 출력과 비교할 수 있도록 필요한 정보 추가
            filePath: example.filePath
        };
    });
}

// 테스트 결과 출력
function displayExamples(examples) {
    console.log('\n📋 추출된 실제 링크 예제:');
    console.log('==========================================');

    const byCategory = {};
    examples.forEach(example => {
        const category = example.description;
        if (!byCategory[category]) {
            byCategory[category] = [];
        }
        byCategory[category].push(example);
    });

    Object.keys(byCategory).forEach(category => {
        console.log(`\n## ${category} (${byCategory[category].length}개):`);
        byCategory[category].forEach((example, i) => {
            console.log(`${i + 1}. 파일: ${example.filePath}`);
            console.log(`   링크: ${example.match}`);
            console.log(`   카테고리: ${example.categoryName}`);
        });
    });

    console.log('\n==========================================');
    console.log(`📊 총 ${examples.length}개의 실제 링크 예제가 추출되었습니다.`);
}

// 메인 실행 함수
function main() {
    // API 문서 디렉토리 경로 (현재 디렉토리 기준)
    // 실제 코드에서는 적절한 경로로 변경해야 함
    const docsDir = process.argv[2] || '/Users/jungyoun/Documents/dev/robota/docs/api-reference';

    // 링크 예제 추출
    const examples = extractRealLinkExamples(docsDir);

    // 예제 분석 결과 출력
    if (examples.length > 0) {
        displayExamples(examples);

        // 테스트 케이스 생성 (실제 테스트 실행을 위한 준비)
        const testCases = createTestCases(examples, docsDir);

        // 테스트 케이스 저장 (선택 사항)
        const testCasesPath = path.join(process.cwd(), 'real-link-test-cases.json');
        fs.writeFileSync(testCasesPath, JSON.stringify(testCases, null, 2));
        console.log(`📝 테스트 케이스가 저장되었습니다: ${testCasesPath}`);

        // 테스트 케이스를 테스트 파일에 적용하는 방법 안내
        console.log('\n💡 추출된 예제를 테스트 파일에 추가하는 방법:');
        console.log('1. real-link-test-cases.json 파일을 확인합니다.');
        console.log('2. 각 케이스를 test-link-regex.js 및 test-prerender-links.js 파일의 TEST_CASES 배열에 추가합니다.');
        console.log('3. 필요한 경우 expectedOutput 값을 실제 예상 결과에 맞게 조정합니다.');
    } else {
        console.log('⚠️ 링크 예제를 찾을 수 없습니다.');
    }
}

// 스크립트 실행
main(); 