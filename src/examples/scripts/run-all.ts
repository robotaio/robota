/**
 * 모든 예제를 실행하는 스크립트
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ExampleConfig {
    name: string;
    script: string;
}

// 실행할 예제 목록
const examples: ExampleConfig[] = [
    {
        name: '기본 대화 예제',
        script: 'basic/simple-conversation.ts'
    },
    {
        name: '함수 호출 예제',
        script: 'function-calling/weather-calculator.ts'
    },
    {
        name: '도구 사용 예제',
        script: 'tools/tool-examples.ts'
    },
    {
        name: '리서치 에이전트 예제',
        script: 'agents/research-agent.ts'
    }
];

async function runExample(example: ExampleConfig): Promise<boolean> {
    console.log(`\n===== ${example.name} 실행 =====\n`);
    try {
        const { stdout, stderr } = await execAsync(`bun run ${example.script}`);
        if (stderr) {
            console.error(stderr);
        }
        console.log(stdout);
        return true;
    } catch (error) {
        console.error(`${example.name} 실행 중 오류가 발생했습니다.`);
        if (error instanceof Error) {
            console.error(error.message);
        }
        return false;
    }
}

async function main() {
    console.log('===== 모든 예제 실행 =====\n');

    for (const example of examples) {
        const success = await runExample(example);
        if (!success) {
            // 에러가 발생해도 계속 다음 예제 실행
            continue;
        }
    }

    console.log('\n===== 모든 예제 실행 완료 =====');
}

main().catch(error => {
    console.error('스크립트 실행 중 오류 발생:', error);
    process.exit(1);
}); 