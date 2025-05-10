/**
 * HTML 프리렌더링 링크 처리 테스트 스크립트
 */

import { marked } from 'marked';

// 기본 HTML 템플릿
const HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API 문서</title>
</head>
<body>
  <div id="content">
    {{CONTENT}}
  </div>
</body>
</html>`;

// 테스트 케이스 정의
export const TEST_CASES = [
    {
        description: '페이지 내 앵커 링크 처리',
        filePath: 'api-reference/core/classes/FunctionRegistry.md',
        input: '# FunctionRegistry\n\n[메서드](#method_register)',
        expectedContent: [
            '<h1 id="functionregistry">FunctionRegistry</h1>',
            '<a href="/api-reference/core/classes/FunctionRegistry#method_register">메서드</a>'
        ]
    },
    {
        description: 'HTML 앵커 태그 자동 변환',
        filePath: 'api-reference/core/classes/FunctionRegistry.md',
        input: '# FunctionRegistry\n\n<a href="#method_register">메서드</a>',
        expectedContent: [
            '<h1 id="functionregistry">FunctionRegistry</h1>',
            '<a href="/api-reference/core/classes/FunctionRegistry#method_register">메서드</a>'
        ]
    },
    {
        description: '여러 앵커 링크가 있는 경우',
        filePath: 'api-reference/core/README.md',
        input: '# Core API\n\n- [함수](#functions)\n- [클래스](#classes)\n- [인터페이스](#interfaces)',
        expectedContent: [
            '<h1 id="core-api">Core API</h1>',
            '<a href="/api-reference/core/README#functions">함수</a>',
            '<a href="/api-reference/core/README#classes">클래스</a>',
            '<a href="/api-reference/core/README#interfaces">인터페이스</a>'
        ]
    }
];

// 문자열에서 공백과 줄바꿈 제거
function normalizeHtml(html) {
    return html.replace(/\s+/g, ' ').trim();
}

// 문자열에서 예상 내용 포함 여부 확인
export function containsExpectedHtml(actual, expectedParts) {
    const normalizedActual = normalizeHtml(actual);
    return expectedParts.every(part => normalizedActual.includes(normalizeHtml(part)));
}

// HTML 프리렌더링 함수
export function prerenderMarkdown(content, filePath) {
    // 마크다운을 HTML로 변환
    const html = marked.parse(content);

    // HTML 템플릿 적용
    const renderedHtml = HTML_TEMPLATE.replace('{{CONTENT}}', html);

    // 페이지 내 앵커 링크 처리
    // 예: href="#method_hello" -> href="/api-reference/core/classes/FunctionRegistry#method_hello"
    return renderedHtml.replace(/href="#([^"]+)"/g, (match, anchor) => {
        return `href="/${filePath.replace('.md', '')}#${anchor}"`;
    });
}

// 직접 실행될 때만 테스트 실행
if (import.meta.url === import.meta.main) {
    // 테스트 실행
    function runTests() {
        console.log('🧪 HTML 프리렌더링 링크 테스트 시작...\n');

        let passed = 0;
        let failed = 0;

        TEST_CASES.forEach((test, index) => {
            try {
                // HTML 변환 (마크다운 렌더링 + 템플릿 적용)
                const html = marked.parse(test.input);

                // 앵커 링크 처리
                const processedHtml = html.replace(/href="#([^"]+)"/g, (match, anchor) => {
                    return `href="/${test.filePath.replace('.md', '')}#${anchor}"`;
                });

                // 정확한 문자열 일치가 아닌 예상 내용 포함 여부 확인
                if (containsExpectedHtml(processedHtml, test.expectedContent)) {
                    console.log(`✅ 테스트 #${index + 1} 통과: ${test.description}`);
                    passed++;
                } else {
                    console.log(`❌ 테스트 #${index + 1} 실패: ${test.description}`);
                    console.log(`   입력: ${test.input}`);
                    console.log(`   기대 내용: ${test.expectedContent.join(' ')}`);
                    console.log(`   실제 출력: ${processedHtml}`);
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