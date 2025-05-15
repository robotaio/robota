/**
 * MCP 클라이언트를 Robota 에이전트와 통합하는 예제
 * 이 예제는 Model Context Protocol(MCP)를 사용하여 Robota 에이전트를 구축하는 방법을 보여줍니다.
 * 또한 OpenAI 클라이언트를 함께 사용하는 방법도 보여줍니다.
 * 
 * =====================================================================
 * 실행 규칙:
 * 1. 이 예제를 실행하기 전에 환경 변수로 OpenAI API 키를 설정해야 합니다:
 *    export OPENAI_API_KEY="your-api-key"
 * 
 * 2. mcp-demo.ts를 먼저 실행하는 것을 권장합니다:
 *    bun mcp-demo.ts &
 *    bun mcp-agent-example.ts
 * 
 * 3. MCP 서버와 클라이언트 사이의 통신에 문제가 있을 경우 타임아웃이 발생할 수 있습니다.
 *    이 경우 작업을 중단하고 프로세스를 다시 시작하세요.
 * =====================================================================
 * 
 * 참고: 이 예제 코드에는 타입 오류가 발생할 수 있습니다.
 * 실제 배포 환경에서는 프로젝트의 타입 설정을 올바르게 구성해야 합니다.
 * 현재는 개발 편의를 위해 타입 단언(as any)을 사용하여 타입 오류를 무시합니다.
 */

import { Robota } from "@robota/core"; // @robota/core에서 Robota 임포트
import { Client } from "@modelcontextprotocol/sdk/dist/esm/client/index.js"; // Client 클래스 임포트
import { StdioClientTransport } from "@modelcontextprotocol/sdk/dist/esm/client/stdio.js"; // StdioClientTransport 클래스 임포트
import OpenAI from "openai"; // OpenAI 패키지 임포트
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// ESM 환경에서 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    try {
        console.log('MCP 에이전트 예제 시작...');

        // 1. MCP 서버 실행 명령어 설정
        console.log('1. MCP 트랜스포트 생성 중...');
        const transport = new StdioClientTransport({
            command: 'bun',
            args: [path.resolve(__dirname, 'mcp-demo.ts')],
        });

        // 2. MCP 클라이언트 인스턴스 생성
        console.log('2. MCP 클라이언트 생성 중...');
        const mcpClient = new Client({
            name: 'simple-client',
            version: '1.0',
        }) as any; // 타입 단언

        await mcpClient.connect(transport);

        // 3. OpenAI 클라이언트 생성
        console.log('3. OpenAI 클라이언트 생성 중...');

        // API 키 확인
        if (!process.env.OPENAI_API_KEY) {
            console.warn('경고: OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
            console.warn('API 키를 설정하려면: export OPENAI_API_KEY="your-api-key"');
            process.exit(1);
        }

        const openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || ''
        });

        // 4. Robota 에이전트 인스턴스 생성 (일반 Provider 사용)
        console.log('4. Robota 에이전트 인스턴스 생성 중...');
        const agent = new Robota({
            aiClient: {
                type: 'openai',
                instance: openaiClient
            },
            mcpClient: mcpClient,
            model: 'gpt-3.5-turbo', // 사용할 OpenAI 모델 지정
            systemPrompt: '당신은 MCP와 OpenAI를 통해 연결된 AI 모델을 사용하는 도우미입니다. 정확하고 유용한 정보를 제공하세요.',
            temperature: 0.7
        } as any); // 타입 단언


        // 6. 기본 대화 실행
        console.log('6. 기본 대화 실행 중...');
        const result = await agent.run('안녕하세요! 오늘 서울의 날씨는 어떤가요?');

        console.log('\n--- 에이전트 응답 ---');
        console.log(result);
        console.log('-------------------\n');

        // 8. 자연어로 도구 호출을 포함한 대화 실행
        console.log('8. 자연어로 도구 호출 예제 실행 중...');
        try {
            const toolCallResult = await agent.run('5와 7을 더해주세요.');
            console.log('\n--- 자연어 요청 결과 ---');
            console.log(toolCallResult);
            console.log('-------------------\n');
        } catch (error) {
            console.error('자연어 요청 오류:', error);
        }

        // 9. 날씨 정보 요청 대화 실행
        console.log('9. 날씨 정보 요청 예제 실행 중...');
        try {
            const weatherResult = await agent.run('서울의 현재 날씨를 알려주세요.');
            console.log('\n--- 날씨 정보 결과 ---');
            console.log(weatherResult);
            console.log('-------------------\n');
        } catch (error) {
            console.error('날씨 정보 요청 오류:', error);
        }

        // 10. 연결 종료 (8번 스킵)
        console.log('9. 예제 완료, 종료 중...');
        try {
            // Robota 에이전트 종료
            await (agent as any)?.close();
        } catch (error) {
            console.error('연결 종료 오류:', error);
        }

        console.log('예제 완료');
        process.exit(0);

    } catch (error) {
        console.error('오류 발생:', error);
        process.exit(1);
    }
}

// 프로그램 실행
main().catch(console.error); 