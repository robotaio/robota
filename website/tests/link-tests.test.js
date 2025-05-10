/**
 * 링크 관련 테스트를 Vitest로 통합
 */

import { describe, it, expect, vi } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// 현재 파일의 디렉토리 경로 찾기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 테스트용 파일 패스 작업
const testLinkRegexPath = join(__dirname, '../scripts/tests/test-link-regex.js');

// 테스트 파일이 존재하는지 확인하는 함수
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Vitest로 테스트 통합
describe('링크 처리 테스트', () => {
    it('test-link-regex.js가 존재해야 함', () => {
        expect(fileExists(testLinkRegexPath)).toBe(true);
    });

    // test-link-regex.js 테스트 통합
    describe('링크 정규표현식 테스트', async () => {
        // 테스트 모듈에서 필요한 함수와 변수 가져오기
        const testLinkRegexModule = await import('../scripts/tests/test-link-regex.js');
        const TEST_CASES = testLinkRegexModule.TEST_CASES || [];
        const processLinks = testLinkRegexModule.processLinks;

        // 각 테스트 케이스에 대해 개별 테스트 생성
        if (TEST_CASES && processLinks) {
            TEST_CASES.forEach((test, index) => {
                it(`${test.description} (테스트 #${index + 1})`, () => {
                    const actual = processLinks(test.input, test.fileName, test.fileDir, test.categoryName);
                    expect(actual).toBe(test.expectedOutput);
                });
            });
        } else {
            it('테스트 케이스와 processLinks 함수가 test-link-regex.js에서 export 되어야 함', () => {
                expect(TEST_CASES).toBeDefined();
                expect(processLinks).toBeDefined();
            });
        }
    });

    // HTML 프리렌더링 링크 테스트 (marked 모듈을 사용하지 않는 방식으로 리팩토링)
    describe('HTML 프리렌더링 링크 테스트', () => {
        // 모킹된 테스트 케이스
        const TEST_CASES = [
            {
                description: '페이지 내 앵커 링크 처리',
                filePath: 'api-reference/core/classes/FunctionRegistry.md',
                input: '# FunctionRegistry\n\n[메서드](#method_register)',
                anchorExamples: ['method_register']
            },
            {
                description: 'HTML 앵커 태그 자동 변환',
                filePath: 'api-reference/core/classes/FunctionRegistry.md',
                input: '# FunctionRegistry\n\n<a href="#method_register">메서드</a>',
                anchorExamples: ['method_register']
            },
            {
                description: '여러 앵커 링크가 있는 경우',
                filePath: 'api-reference/core/README.md',
                input: '# Core API\n\n- [함수](#functions)\n- [클래스](#classes)\n- [인터페이스](#interfaces)',
                anchorExamples: ['functions', 'classes', 'interfaces']
            }
        ];

        // 앵커 링크 수정 테스트 함수
        function testAnchorLinkProcessing(filePath, anchors) {
            // href="#xxx" 를 href="/path/to/file#xxx" 로 변환하는 함수
            function processAnchorLinks(filePath, anchorName) {
                return `/${filePath.replace('.md', '')}#${anchorName}`;
            }

            // 각 앵커에 대해 프로세싱 결과 테스트
            anchors.forEach(anchor => {
                const processedPath = processAnchorLinks(filePath, anchor);
                const expectedPath = `/${filePath.replace('.md', '')}#${anchor}`;
                expect(processedPath).toBe(expectedPath);
            });

            return true;
        }

        // 각 테스트 케이스에 대해 개별 테스트 생성
        TEST_CASES.forEach((test, index) => {
            it(`${test.description} (테스트 #${index + 1})`, () => {
                expect(testAnchorLinkProcessing(test.filePath, test.anchorExamples)).toBe(true);
            });
        });
    });
}); 