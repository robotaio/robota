/**
 * 링크 관련 테스트를 Vitest로 통합
 */

import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// 현재 파일의 디렉토리 경로 찾기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 테스트용 파일 패스 작업
const testLinkRegexPath = join(__dirname, '../scripts/tests/test-link-regex.js');
const testPrerenderLinksPath = join(__dirname, '../scripts/tests/test-prerender-links.js');

// 테스트 파일이 존재하는지 확인하는 함수
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// 테스트 내용 가져오기
function importTestFile(filePath) {
    // 다이나믹 임포트 사용
    return import(filePath);
}

// Vitest로 테스트 통합
describe('링크 처리 테스트', () => {
    it('test-link-regex.js가 존재해야 함', () => {
        expect(fileExists(testLinkRegexPath)).toBe(true);
    });

    it('test-prerender-links.js가 존재해야 함', () => {
        expect(fileExists(testPrerenderLinksPath)).toBe(true);
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

    // test-prerender-links.js 테스트 통합
    describe('HTML 프리렌더링 링크 테스트', async () => {
        // 테스트 모듈에서 필요한 함수와 변수 가져오기
        const testPrerenderModule = await import('../scripts/tests/test-prerender-links.js');
        const TEST_CASES = testPrerenderModule.TEST_CASES || [];
        const prerenderMarkdown = testPrerenderModule.prerenderMarkdown;
        const containsExpectedHtml = testPrerenderModule.containsExpectedHtml;

        // 각 테스트 케이스에 대해 개별 테스트 생성
        if (TEST_CASES && prerenderMarkdown && containsExpectedHtml) {
            TEST_CASES.forEach((test, index) => {
                it(`${test.description} (테스트 #${index + 1})`, () => {
                    const processedHtml = prerenderMarkdown(test.input, test.filePath);
                    expect(containsExpectedHtml(processedHtml, test.expectedContent)).toBe(true);
                });
            });
        } else {
            it('테스트 케이스와 필요한 함수들이 test-prerender-links.js에서 export 되어야 함', () => {
                expect(TEST_CASES).toBeDefined();
                expect(prerenderMarkdown).toBeDefined();
                expect(containsExpectedHtml).toBeDefined();
            });
        }
    });
}); 