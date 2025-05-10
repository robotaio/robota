/**
 * API 문서 링크 정규표현식 통합 테스트 스크립트
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// 현재 작업 디렉토리 경로
const CURRENT_DIR = process.cwd();

// 테스트 스크립트 파일들
const TEST_SCRIPTS = [
    'test-link-regex.js',
    'test-prerender-links.js'
];

// 테스트 실행 기록을 위한 로그 파일
const LOG_FILE = path.join(CURRENT_DIR, 'link-tests-results.log');

// 로그 파일 초기화
fs.writeFileSync(LOG_FILE, `API 문서 링크 테스트 결과 (${new Date().toISOString()})\n========================================================\n\n`);

// 통합 테스트 실행 함수
function runAllTests() {
    console.log('🧪 API 문서 링크 통합 테스트 시작');
    console.log('========================================================');

    let allTestsPassed = true;

    TEST_SCRIPTS.forEach((script, index) => {
        const scriptPath = path.join(CURRENT_DIR, 'scripts', script);

        // 스크립트 파일 존재 확인
        if (!fs.existsSync(scriptPath)) {
            console.error(`❌ 테스트 스크립트 파일을 찾을 수 없습니다: ${scriptPath}`);
            allTestsPassed = false;
            return;
        }

        console.log(`\n📋 테스트 스크립트 실행 중: ${script} (${index + 1}/${TEST_SCRIPTS.length})`);
        console.log('--------------------------------------------------------');

        try {
            // 테스트 스크립트 실행
            const output = execSync(`node ${scriptPath}`, { encoding: 'utf-8' });

            // 결과 출력 및 로그 파일에 저장
            console.log(output);
            fs.appendFileSync(LOG_FILE, `\n### ${script} 테스트 결과\n\n${output}\n`);

            // 테스트 실패 확인
            if (output.includes('⚠️') || output.includes('❌')) {
                allTestsPassed = false;
            }
        } catch (error) {
            console.error(`❌ 테스트 스크립트 실행 중 오류 발생: ${error.message}`);
            fs.appendFileSync(LOG_FILE, `\n### ${script} 테스트 오류\n\n${error.message}\n${error.stack}\n`);
            allTestsPassed = false;
        }
    });

    console.log('========================================================');

    if (allTestsPassed) {
        console.log('🎉 모든 테스트가 성공적으로 통과했습니다!');
        fs.appendFileSync(LOG_FILE, '\n🎉 모든 테스트가 성공적으로 통과했습니다!\n');
    } else {
        console.error('⚠️ 일부 테스트가 실패했습니다. 로그 파일을 확인해주세요: ' + LOG_FILE);
        fs.appendFileSync(LOG_FILE, '\n⚠️ 일부 테스트가 실패했습니다.\n');
    }

    console.log(`📝 테스트 결과가 로그 파일에 저장되었습니다: ${LOG_FILE}`);
}

// 테스트 실행
runAllTests(); 