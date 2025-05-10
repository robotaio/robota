/**
 * 링크 정규표현식 테스트 스크립트
 */

// 테스트 케이스 정의
export const TEST_CASES = [
    // 기본 링크 테스트
    {
        description: '같은 파일 내 자기 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[`FunctionRegistry`](FunctionRegistry.md)',
        expectedOutput: '[`FunctionRegistry`](/api-reference/core/classes/FunctionRegistry)'
    },
    {
        description: '같은 파일 내 앵커 자기 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[`register`](FunctionRegistry.md#method_register)',
        expectedOutput: '[`register`](/api-reference/core/classes/FunctionRegistry#method_register)'
    },
    {
        description: '같은 디렉토리의 다른 파일 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[`AnotherClass`](AnotherClass.md)',
        expectedOutput: '[`AnotherClass`](/api-reference/core/classes/AnotherClass)'
    },
    {
        description: '같은 디렉토리의 다른 파일 앵커 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[`method`](AnotherClass.md#method_hello)',
        expectedOutput: '[`method`](/api-reference/core/classes/AnotherClass#method_hello)'
    },
    {
        description: '상위 디렉토리 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[back to core](.../)',
        expectedOutput: '[back to core](/api-reference/core/)'
    },
    {
        description: '상위 디렉토리 앵커 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[back to section](../#section)',
        expectedOutput: '[back to section](/api-reference/core/#section)'
    },
    {
        description: '서브디렉토리 classes 참조 링크',
        fileName: 'index.md',
        fileDir: 'api-reference/core',
        categoryName: 'core',
        input: '[`Classes`](classes/)',
        expectedOutput: '[`Classes`](/api-reference/core/classes/)'
    },
    {
        description: '서브디렉토리 interfaces 참조 링크',
        fileName: 'index.md',
        fileDir: 'api-reference/core',
        categoryName: 'core',
        input: '[`Interfaces`](interfaces/)',
        expectedOutput: '[`Interfaces`](/api-reference/core/interfaces/)'
    },
    {
        description: 'README.md 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[Back to README](README.md)',
        expectedOutput: '[Back to README](/api-reference/core/)'
    },
    {
        description: 'README.md 앵커 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[Back to section](README.md#section)',
        expectedOutput: '[Back to section](/api-reference/core/#section)'
    },
    {
        description: '상위 디렉토리 README.md 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[Back to core](../README.md)',
        expectedOutput: '[Back to core](/api-reference/core/)'
    },
    {
        description: '상위 디렉토리 README.md 앵커 참조 링크',
        fileName: 'FunctionRegistry.md',
        fileDir: 'api-reference/core/classes',
        categoryName: 'core',
        input: '[Back to section](../README.md#section)',
        expectedOutput: '[Back to section](/api-reference/core/#section)'
    }
];

// 링크 처리 로직 (generate-api-docs.js 파일에서 가져옴)
export function processLinks(content, fileName, fileDir, categoryName) {
    // 확장자 없는 파일명
    const fileNameWithoutExt = fileName.replace('.md', '');
    // 현재 파일의 절대 경로 (URL 기준)
    const absolutePath = `/${fileDir}/${fileNameWithoutExt}`;

    // 정확한 순서로 처리해야 함
    // 1. 같은 파일 내에서 자기 자신을 참조하는 링크 수정
    const selfRegex = new RegExp(`\\]\\(${fileNameWithoutExt}\\.md(#[^)]*)?\\)`, 'g');
    content = content.replace(selfRegex, (match, anchor) => {
        return `](${absolutePath}${anchor || ''})`;
    });

    // 2. README.md 파일 참조 처리
    content = content.replace(/\]\(README\.md(#[^)]+)?\)/g, (match, section) => {
        if (section) {
            // 섹션 ID가 있는 경우: /api-reference/카테고리명/#섹션명
            return `](/api-reference/${categoryName}/${section})`;
        } else {
            // 섹션 ID가 없는 경우: /api-reference/카테고리명/
            return `](/api-reference/${categoryName}/)`;
        }
    });

    // 3. 서브 디렉토리에서 상위 디렉토리의 README.md 링크 수정
    content = content.replace(/\]\(\.\.\/README\.md(#[^)]+)?\)/g, (match, section) => {
        if (section) {
            // 섹션 ID가 있는 경우: /api-reference/카테고리명/#섹션명
            return `](/api-reference/${categoryName}/${section})`;
        } else {
            // 섹션 ID가 없는 경우: /api-reference/카테고리명/
            return `](/api-reference/${categoryName}/)`;
        }
    });

    // 4. ../interfaces/XXX.md -> /api-reference/카테고리명/interfaces/XXX (상대 경로를 절대 경로로)
    content = content.replace(/\]\(\.\.\/interfaces\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/interfaces/$1$2)`);

    // 5. ../classes/XXX.md -> /api-reference/카테고리명/classes/XXX (상대 경로를 절대 경로로)
    content = content.replace(/\]\(\.\.\/classes\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/classes/$1$2)`);

    // 6. interfaces/XXX.md -> /api-reference/카테고리명/interfaces/XXX (디렉토리 내 상대 경로도 절대 경로로)
    content = content.replace(/\]\(interfaces\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/interfaces/$1$2)`);

    // 7. classes/XXX.md -> /api-reference/카테고리명/classes/XXX (디렉토리 내 상대 경로도 절대 경로로)
    content = content.replace(/\]\(classes\/([^)]+)\.md(#[^)]*)?\)/g, `](/api-reference/${categoryName}/classes/$1$2)`);

    // 8. ../ -> /api-reference/카테고리명/ (상위 디렉토리 참조도 절대 경로로)
    content = content.replace(/\]\(\.\.\/?(#[^)]+)?\)/g, (match, anchor) => {
        if (anchor) {
            return `](/api-reference/${categoryName}/${anchor})`;
        } else {
            return `](/api-reference/${categoryName}/)`;
        }
    });

    // 8.5. 특수 케이스: .../ 처리
    content = content.replace(/\]\(\.\.\.\/\)/g, `](/api-reference/${categoryName}/)`);

    // 9. 디렉토리 참조 처리 (classes/, interfaces/)
    content = content.replace(/\]\((classes|interfaces)\/\)/g, (match, dirName) => {
        return `](/api-reference/${categoryName}/${dirName}/)`;
    });

    // 10. 파일명만 있는 링크(경로가 없는 링크) 처리 - 이 부분이 문제
    // 테스트 케이스 #3, #4에 맞게 수정
    content = content.replace(
        /\]\(([^\/\.\)]+)\.md(#[^)]*)?\)/g,
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
            return `](/api-reference/${categoryName}/${fileDir.split('/').pop()}/${linkFileName}${anchor || ''})`;
        }
    );

    return content;
}

// 직접 실행될 때만 테스트 실행
if (import.meta.url === import.meta.main) {
    // 테스트 실행
    function runTests() {
        console.log('🧪 링크 정규표현식 테스트 시작...\n');

        let passed = 0;
        let failed = 0;

        TEST_CASES.forEach((test, index) => {
            try {
                const actual = processLinks(test.input, test.fileName, test.fileDir, test.categoryName);

                if (actual === test.expectedOutput) {
                    console.log(`✅ 테스트 #${index + 1} 통과: ${test.description}`);
                    passed++;
                } else {
                    console.log(`❌ 테스트 #${index + 1} 실패: ${test.description}`);
                    console.log(`   입력: ${test.input}`);
                    console.log(`   기대 출력: ${test.expectedOutput}`);
                    console.log(`   실제 출력: ${actual}`);
                    failed++;
                }
            } catch (error) {
                console.log(`⚠️ 테스트 #${index + 1} 오류: ${test.description}`);
                console.log(`   오류 메시지: ${error.message}`);
                failed++;
            }
        });

        console.log(`\n🔍 테스트 결과: ${passed}개 통과, ${failed}개 실패 (총 ${TEST_CASES.length}개)`);

        // 테스트 성공 여부 반환
        return failed === 0;
    }

    // 테스트 실행
    const success = runTests();

    // 종료 코드 설정 (CI/CD 파이프라인에서 활용 가능)
    process.exit(success ? 0 : 1);
} 