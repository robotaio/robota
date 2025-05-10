#!/usr/bin/env node
/**
 * 모든 링크 관련 테스트를 한 번에 실행하는 스크립트
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// 현재 디렉토리
const currentDir = process.cwd();
// 스크립트 디렉토리
const scriptsDir = path.join(currentDir, 'scripts');
const testsDir = path.join(scriptsDir, 'tests');

// 테스트 파일 목록
const testFiles = [
    'test-link-regex.js',
    'test-prerender-links.js'
];

console.log('🧪 링크 처리 테스트 시작...\n');

let allPassed = true;
let results = [];

// 각 테스트 파일 실행
testFiles.forEach(testFile => {
    const testFilePath = path.join(testsDir, testFile);

    // 파일 존재 여부 확인
    if (!fs.existsSync(testFilePath)) {
        console.error(`❌ 테스트 파일을 찾을 수 없습니다: ${testFilePath}`);
        allPassed = false;
        results.push({
            file: testFile,
            success: false,
            error: '파일을 찾을 수 없음'
        });
        return;
    }

    try {
        console.log(`🔍 테스트 실행 중: ${testFile}`);

        // 테스트 스크립트 실행
        execSync(`node ${testFilePath}`, { stdio: 'inherit' });

        console.log(`✅ ${testFile} 테스트 완료\n`);
        results.push({
            file: testFile,
            success: true
        });
    } catch (error) {
        console.error(`❌ ${testFile} 테스트 실패: ${error.message}`);
        allPassed = false;
        results.push({
            file: testFile,
            success: false,
            error: error.message
        });
    }
});

// 테스트 결과 요약
console.log('\n📋 테스트 결과 요약:');
console.log('==========================================');

results.forEach(result => {
    if (result.success) {
        console.log(`✅ ${result.file}: 성공`);
    } else {
        console.log(`❌ ${result.file}: 실패 (${result.error})`);
    }
});

console.log('==========================================');

if (allPassed) {
    console.log('🎉 모든 테스트가 성공적으로 완료되었습니다!');
    process.exit(0);
} else {
    console.error('⚠️ 일부 테스트가 실패했습니다.');
    process.exit(1);
} 