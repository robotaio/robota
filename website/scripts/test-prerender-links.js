/**
 * HTML 프리렌더링 링크 처리 테스트 스크립트
 */

import path from 'path';

// 실제 API 문서에서 추출한 테스트 케이스 가져오기 (이 부분은 파일이 생성된 후에 주석 해제)
// import REAL_DOC_TEST_CASES from './real-doc-test-cases.js';

// 테스트 데이터 설정
const PRERENDER_TEST_CASES = [
    // 1. 자기 참조 링크 (FunctionRegistry.md 파일 내에서 FunctionRegistry 참조)
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

    // 5. 절대 경로 참조 링크 (이미 처리된 링크)
    {
        description: '절대 경로 참조 링크 테스트',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        input: '[링크](/api-reference/core/interfaces/Interface.md)',
        expectedOutput: '[링크](/api-reference/core/interfaces/Interface)'
    },

    // 6. 여러 링크가 포함된 컨텐츠
    {
        description: '여러 링크가 포함된 컨텐츠 테스트',
        fileName: 'index.md',
        fileDir: 'api-reference/core',
        input: '# 제목\n\n[링크1](classes/Class1.md)\n[링크2](interfaces/Interface1.md)\n[자기 참조](index.md)',
        expectedOutput: '# 제목\n\n[링크1](/api-reference/core/classes/Class1)\n[링크2](/api-reference/core/interfaces/Interface1)\n[자기 참조](/api-reference/core/index)'
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

// prerenderPages 함수에서 사용하는 링크 처리 함수
function processPrerenderedLinks(content, fileName, fileDir) {
    // 확장자 없는 파일명
    const fileNameWithoutExt = path.basename(fileName, '.md');
    // 현재 파일의 절대 경로 (URL 기준)
    const absolutePath = `/${fileDir}/${fileNameWithoutExt}`;

    // 카테고리 이름 추출 (fileDir에서)
    const dirParts = fileDir.split('/');
    const categoryIndex = dirParts.indexOf('api-reference') + 1;
    const categoryName = categoryIndex < dirParts.length ? dirParts[categoryIndex] : '';

    // 처리된 콘텐츠
    let processedContent = content;

    // 1. .md 확장자 제거 (Docsify history 모드에 맞게)
    processedContent = processedContent.replace(/\]\(([^)]+)\.md(#[^)]*)?/g, (match, filePath, anchor) => {
        // README.md는 특별 처리
        if (filePath.toLowerCase() === 'readme') {
            return `](/api-reference/${categoryName}/${anchor || ''})`;
        }

        // ../README.md는 상위 디렉토리 README 특별 처리
        if (filePath.toLowerCase() === '../readme') {
            return `](/api-reference/${categoryName}/${anchor || ''})`;
        }

        // 절대 경로는 그대로 유지하되 .md 확장자만 제거
        if (filePath.startsWith('/')) {
            return `](${filePath}${anchor || ''})`;
        }

        // ../interfaces/ 또는 ../classes/ 경로 처리
        if (filePath.startsWith('../interfaces/')) {
            const interfaceName = filePath.replace('../interfaces/', '');
            return `](/api-reference/${categoryName}/interfaces/${interfaceName}${anchor || ''})`;
        }

        if (filePath.startsWith('../classes/')) {
            const className = filePath.replace('../classes/', '');
            return `](/api-reference/${categoryName}/classes/${className}${anchor || ''})`;
        }

        // interfaces/ 또는 classes/ 경로 처리
        if (filePath.startsWith('interfaces/')) {
            const interfaceName = filePath.replace('interfaces/', '');
            return `](/api-reference/${categoryName}/interfaces/${interfaceName}${anchor || ''})`;
        }

        if (filePath.startsWith('classes/')) {
            const className = filePath.replace('classes/', '');
            return `](/api-reference/${categoryName}/classes/${className}${anchor || ''})`;
        }

        // ../ 상위 디렉토리 참조
        if (filePath === '..') {
            return `](/api-reference/${categoryName}/${anchor || ''})`;
        }

        // 상대 경로는 현재 디렉토리 기준으로 처리
        return `](${filePath}${anchor || ''})`;
    });

    // 2. 자기 참조 링크 처리 (절대 경로로 변경)
    processedContent = processedContent.replace(
        new RegExp(`\\]\\(${fileNameWithoutExt}(#[^)]*)?\\)`, 'g'),
        (match, anchor) => `](${absolutePath}${anchor || ''})`
    );

    // 3. 파일명만 있는 링크(경로가 없는 링크) 처리
    processedContent = processedContent.replace(
        /\]\(([^\/\.]+)(#[^)]*)?/g,
        (match, linkFileName, anchor) => {
            // 자기 자신을 참조하는 경우는 이미 위에서 처리했으므로 건너뜀
            if (linkFileName === fileNameWithoutExt) {
                return match; // 이미 처리됨
            }

            // 같은 디렉토리의 다른 파일 참조 -> 절대 경로로 변경
            return `](/${fileDir}/${linkFileName}${anchor || ''})`;
        }
    );

    return processedContent;
}

// 테스트 실행 함수
function runPrerenderTests() {
    console.log('📋 HTML 프리렌더링 링크 처리 테스트 시작');
    console.log('==========================================');

    let passedCount = 0;
    let failedCount = 0;

    PRERENDER_TEST_CASES.forEach((testCase, index) => {
        // 링크 처리
        const output = processPrerenderedLinks(testCase.input, testCase.fileName, testCase.fileDir);

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
    console.log(`📊 테스트 결과: ${passedCount}개 통과, ${failedCount}개 실패 (총 ${PRERENDER_TEST_CASES.length}개)`);

    if (failedCount === 0) {
        console.log('🎉 모든 테스트가 통과했습니다!');
    } else {
        console.log('⚠️ 일부 테스트가 실패했습니다.');
    }
}

// 테스트 실행
runPrerenderTests(); 