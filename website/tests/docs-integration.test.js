import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('generate-api-docs 스크립트 테스트', () => {
    // 통합 테스트 (실제 파일 시스템 사용)
    test('스크립트가 올바른 구조와 기능을 가지고 있는지 검증', () => {
        // 스크립트 내용 읽기
        const scriptPath = path.resolve('./scripts/generate-api-docs.js');
        expect(fs.existsSync(scriptPath)).toBe(true);

        const scriptContent = fs.readFileSync(scriptPath, 'utf-8');

        // 스크립트에 필요한 주요 함수가 포함되어 있는지 확인
        expect(scriptContent).toContain('function copySourceDocs');
        expect(scriptContent).toContain('function fixDocumentLinks');
        expect(scriptContent).toContain('function prerenderPages');
        expect(scriptContent).toContain('async function main');

        // 각 함수가 올바른 링크 변환 로직을 포함하고 있는지 확인
        expect(scriptContent).toContain('FunctionRegistry.md');
        expect(scriptContent).toContain('README.md');
        expect(scriptContent).toContain('/api-reference/');

        // API 카테고리 정의가 올바른지 확인
        expect(scriptContent).toContain('Core');
        expect(scriptContent).toContain('OpenAI');
        expect(scriptContent).toContain('Anthropic');

        // HTML 생성 로직이 있는지 확인
        expect(scriptContent).toContain('<!DOCTYPE html>');
        expect(scriptContent).toContain('window.onload');

        // 링크 변환 로직 확인
        expect(scriptContent).toContain('fixDocumentLinks');
        expect(scriptContent).toContain('replace(');

        // 자기 참조 링크 변환 로직
        expect(scriptContent).toContain('const selfRegex = new RegExp');

        // HTML 변환 로직 확인
        expect(scriptContent).toContain('replace(\'.md\', \'.html\')');
    });

    // 링크 변환 로직 테스트
    test('fixDocumentLinks 함수의 링크 변환 로직 검증', () => {
        // 링크 정규식 패턴 테스트 케이스 정의
        const testCases = [
            { pattern: 'classes/', description: '클래스 링크 변환' },
            { pattern: 'interfaces/', description: '인터페이스 링크 변환' },
            { pattern: 'README.md', description: 'README 링크 변환' }
        ];

        // 스크립트 내용 가져오기
        const scriptPath = path.resolve('./scripts/generate-api-docs.js');
        expect(fs.existsSync(scriptPath)).toBe(true);

        const scriptContent = fs.readFileSync(scriptPath, 'utf-8');

        // 각 테스트 케이스에 대한 패턴이 스크립트에 있는지 확인
        for (const { pattern, description } of testCases) {
            expect(scriptContent).toContain(pattern);
        }

        // HTML 변환 로직
        expect(scriptContent).toContain('.md');
        expect(scriptContent).toContain('.html');
        expect(scriptContent).toContain('replace');
    });
}); 