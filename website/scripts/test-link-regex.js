/**
 * API 문서 링크 정규표현식 테스트 스크립트
 */

import path from 'path';

// 실제 API 문서에서 추출한 테스트 케이스 가져오기 (이 부분은 파일이 생성된 후에 주석 해제)
// import REAL_DOC_TEST_CASES from './real-doc-test-cases.js';

// 테스트 데이터 설정 
const TEST_CASES = [
    // 1. 자기 참조 링크 (FunctionRegistry.md 파일 내에서 FunctionRegistry.md 참조)
    {
        description: '자기 참조 링크 처리 테스트',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        input: '[`FunctionRegistry`](FunctionRegistry.md)',
        expectedOutput: '[`FunctionRegistry`](/api-reference/core/classes/FunctionRegistry)'
    },

    // 2. 자기 참조 링크 (앵커 포함)
    {
        description: '자기 참조 링크 처리 테스트 (앵커 포함)',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        input: '[`method`](FunctionRegistry.md#method)',
        expectedOutput: '[`method`](/api-reference/core/classes/FunctionRegistry#method)'
    },

    // 3. 같은 디렉토리의 다른 파일 참조
    {
        description: '같은 디렉토리의 다른 파일 참조 테스트',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        input: '[`AnotherClass`](AnotherClass.md)',
        expectedOutput: '[`AnotherClass`](/api-reference/core/classes/AnotherClass)'
    },

    // 4. 같은 디렉토리의 다른 파일 참조 (앵커 포함)
    {
        description: '같은 디렉토리의 다른 파일 참조 테스트 (앵커 포함)',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        input: '[참조](AnotherClass.md#method)',
        expectedOutput: '[참조](/api-reference/core/classes/AnotherClass#method)'
    },

    // 5. 상위 디렉토리의 다른 파일 참조 (../interfaces/Interface.md)
    {
        description: '상위 디렉토리의 interfaces 참조 테스트',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        input: '[`Interface`](../interfaces/Interface.md)',
        expectedOutput: '[`Interface`](/api-reference/core/interfaces/Interface)'
    },

    // 6. interfaces 디렉토리 참조 (interfaces/Interface.md)
    {
        description: 'interfaces 디렉토리 참조 테스트',
        fileName: 'index.md',
        fileDir: 'api-reference/core',
        input: '[`Interface`](interfaces/Interface.md)',
        expectedOutput: '[`Interface`](/api-reference/core/interfaces/Interface)'
    },

    // 7. classes 디렉토리 참조 (classes/Class.md)
    {
        description: 'classes 디렉토리 참조 테스트',
        fileName: 'index.md',
        fileDir: 'api-reference/core',
        input: '[`Class`](classes/Class.md)',
        expectedOutput: '[`Class`](/api-reference/core/classes/Class)'
    },

    // 8. README.md 참조
    {
        description: 'README.md 참조 테스트',
        fileName: 'Class.md',
        fileDir: 'api-reference/core/classes',
        input: '[홈](README.md)',
        expectedOutput: '[홈](/api-reference/core/)'
    },

    // 9. README.md 참조 (앵커 포함)
    {
        description: 'README.md 앵커 참조 테스트',
        fileName: 'Class.md',
        fileDir: 'api-reference/core/classes',
        input: '[섹션](README.md#section)',
        expectedOutput: '[섹션](/api-reference/core/#section)'
    },

    // 10. 상위 디렉토리의 README.md 참조
    {
        description: '상위 디렉토리 README.md 참조 테스트',
        fileName: 'Class.md',
        fileDir: 'api-reference/core/classes',
        input: '[상위](../README.md)',
        expectedOutput: '[상위](/api-reference/core/)'
    },

    // 11. 상위 디렉토리의 README.md 참조 (앵커 포함)
    {
        description: '상위 디렉토리 README.md 앵커 참조 테스트',
        fileName: 'Class.md',
        fileDir: 'api-reference/core/classes',
        input: '[상위 섹션](../README.md#section)',
        expectedOutput: '[상위 섹션](/api-reference/core/#section)'
    },

    // 12. 상위 디렉토리 참조 (../)
    {
        description: '상위 디렉토리 참조 테스트',
        fileName: 'Class.md',
        fileDir: 'api-reference/core/classes',
        input: '[상위](../)',
        expectedOutput: '[상위](/api-reference/core/)'
    },

    // 13. 상위 디렉토리 참조 (앵커 포함)
    {
        description: '상위 디렉토리 앵커 참조 테스트',
        fileName: 'Class.md',
        fileDir: 'api-reference/core/classes',
        input: '[상위 섹션](../#section)',
        expectedOutput: '[상위 섹션](/api-reference/core/#section)'
    },

    // 실제 문서에서 추출한 예제 테스트
    {
        description: '실제 문서 - LangChain 클래스 참조 링크',
        fileName: 'LangChainProvider.md',
        fileDir: 'api-reference/langchain/classes',
        input: '[LangChain API - v0.1.0](../README.md)',
        expectedOutput: '[LangChain API - v0.1.0](/api-reference/langchain/)'
    },
    {
        description: '실제 문서 - 자기 참조 링크',
        fileName: 'LangChainProvider.md',
        fileDir: 'api-reference/langchain/classes',
        input: '[`LangChainProvider`](LangChainProvider.md)',
        expectedOutput: '[`LangChainProvider`](/api-reference/langchain/classes/LangChainProvider)'
    },
    {
        description: '실제 문서 - interfaces 디렉토리 참조',
        fileName: 'LangChainProvider.md',
        fileDir: 'api-reference/langchain/classes',
        input: '[`LangChainProviderOptions`](../interfaces/LangChainProviderOptions.md)',
        expectedOutput: '[`LangChainProviderOptions`](/api-reference/langchain/interfaces/LangChainProviderOptions)'
    },
    {
        description: '실제 문서 - Tools API 인덱스 링크',
        fileName: 'ToolRegistry.md',
        fileDir: 'api-reference/tools/classes',
        input: '[Tools API](../README.md)',
        expectedOutput: '[Tools API](/api-reference/tools/)'
    },
    {
        description: '실제 문서 - Tool 인터페이스 링크',
        fileName: 'README.md',
        fileDir: 'api-reference/tools',
        input: '[`Tool`](interfaces/Tool.md)',
        expectedOutput: '[`Tool`](/api-reference/tools/interfaces/Tool)'
    }

    // 실제 API 문서에서 추출한 테스트 케이스 추가 (이 부분은 파일이 생성된 후에 주석 해제)
    // ...REAL_DOC_TEST_CASES
];

// 링크 처리 함수 (generate-api-docs.js에서 사용하는 함수들 복제)
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

// 테스트 실행 함수
function runTests() {
    console.log('📋 API 문서 링크 정규표현식 테스트 시작');
    console.log('==========================================');

    let passedCount = 0;
    let failedCount = 0;

    TEST_CASES.forEach((testCase, index) => {
        // 카테고리 이름 추출 (api-reference/core/... -> core)
        const dirParts = testCase.fileDir.split('/');
        const categoryIndex = dirParts.indexOf('api-reference') + 1;
        const categoryName = categoryIndex < dirParts.length ? dirParts[categoryIndex] : '';

        // 링크 처리
        const output = processLinks(testCase.input, testCase.fileName, testCase.fileDir, categoryName);

        // 결과 검증
        const passed = output === testCase.expectedOutput;

        if (passed) {
            passedCount++;
            console.log(`✅ 테스트 #${index + 1} 통과: ${testCase.description}`);
        } else {
            failedCount++;
            console.log(`❌ 테스트 #${index + 1} 실패: ${testCase.description}`);
            console.log(`   입력: ${testCase.input}`);
            console.log(`   기대 출력: ${testCase.expectedOutput}`);
            console.log(`   실제 출력: ${output}`);
        }
    });

    console.log('==========================================');
    console.log(`📊 테스트 결과: ${passedCount}개 통과, ${failedCount}개 실패 (총 ${TEST_CASES.length}개)`);

    if (failedCount === 0) {
        console.log('🎉 모든 테스트가 통과했습니다!');
    } else {
        console.log('⚠️ 일부 테스트가 실패했습니다.');
    }
}

// 테스트 실행
runTests(); 