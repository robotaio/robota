/**
 * 시스템 메시지와 함수 호출 모드 예제
 */

import OpenAI from 'openai';
import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';
import type { MessageRole } from '@robota/core';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// OpenAI 클라이언트 생성
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// 함수 정의
const getWeather = async (params: { location: string, unit?: 'celsius' | 'fahrenheit' }) => {
    console.log(`날씨 검색: ${params.location}`);

    // 실제 API 호출 대신 가상 데이터 반환
    return {
        location: params.location,
        temperature: 23,
        condition: '맑음',
        humidity: 60,
        unit: params.unit || 'celsius'
    };
};

const searchDatabase = async (params: { query: string, limit?: number }) => {
    console.log(`데이터베이스 검색: ${params.query}`);

    // 가상 데이터 반환
    return {
        results: [
            { id: 1, title: `${params.query}에 관한 문서 1` },
            { id: 2, title: `${params.query}에 관한 문서 2` },
            { id: 3, title: `${params.query}에 관한 문서 3` }
        ],
        count: 3
    };
};

// 서로 다른 예제를 실행합니다
async function runExamples() {
    // 1. 기본 시스템 메시지 사용 예제
    console.log('예제 1: 기본 시스템 메시지');
    console.log('---------------------------');
    const robotaWithBasicSystemPrompt = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client
        }),
        systemPrompt: '당신은 날씨와 검색에 능숙한 AI 어시스턴트입니다.'
    });

    // 함수 등록
    robotaWithBasicSystemPrompt.registerFunctions({
        getWeather,
        searchDatabase
    });

    const result1 = await robotaWithBasicSystemPrompt.run('서울의 날씨가 어때?');
    console.log('응답:', result1);
    console.log();

    // 2. 여러 시스템 메시지 사용 예제
    console.log('예제 2: 여러 시스템 메시지');
    console.log('---------------------------');
    const robotaWithMultipleSystemMessages = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client
        })
    });

    // 함수 등록
    robotaWithMultipleSystemMessages.registerFunctions({
        getWeather,
        searchDatabase
    });

    // 여러 시스템 메시지 설정
    robotaWithMultipleSystemMessages.setSystemMessages([
        { role: 'system' as MessageRole, content: '당신은 날씨에 대한 전문가입니다.' },
        { role: 'system' as MessageRole, content: '항상 정확한 정보를 제공하려고 노력하세요.' },
        { role: 'system' as MessageRole, content: '사용자가 어디에 있는지 물어보는 것이 좋습니다.' }
    ]);

    const result2 = await robotaWithMultipleSystemMessages.run('오늘 날씨에 대해 알려줘');
    console.log('응답:', result2);
    console.log();

    // 3. 시스템 메시지 추가 예제
    console.log('예제 3: 시스템 메시지 추가');
    console.log('---------------------------');
    const robotaWithAddedSystemMessage = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client
        }),
        systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.'
    });

    // 시스템 메시지 추가
    robotaWithAddedSystemMessage.addSystemMessage('사용자에게 항상 공손하게 대응하세요.');
    robotaWithAddedSystemMessage.addSystemMessage('가능하면 간결하게 답변하세요.');

    const result3 = await robotaWithAddedSystemMessage.run('인공지능에 대해 설명해줘');
    console.log('응답:', result3);
    console.log();

    // 4. Auto 함수 호출 모드 (기본값)
    console.log('예제 4: Auto 함수 호출 모드');
    console.log('---------------------------');
    const robotaWithAutoMode = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client
        }),
        systemPrompt: '당신은 날씨 정보를 제공하는 AI 비서입니다.'
    });

    // 함수 등록
    robotaWithAutoMode.registerFunctions({
        getWeather
    });

    // 기본값은 'auto' 모드
    const result4 = await robotaWithAutoMode.run('서울의 날씨가 어때?');
    console.log('응답:', result4);
    console.log();

    // 5. Disabled 함수 호출 모드
    console.log('예제 5: Disabled 함수 호출 모드');
    console.log('---------------------------');
    const robotaWithDisabledMode = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client
        }),
        systemPrompt: '당신은 날씨 정보를 제공하는 AI 비서입니다.'
    });

    // 함수 등록
    robotaWithDisabledMode.registerFunctions({
        getWeather
    });

    // 함수 호출 비활성화 모드
    const result5 = await robotaWithDisabledMode.run('서울의 날씨가 어때?', {
        functionCallMode: 'disabled'
    });
    console.log('응답:', result5);
    console.log();

    // 6. Force 함수 호출 모드
    console.log('예제 6: Force 함수 호출 모드');
    console.log('---------------------------');
    const robotaWithForceMode = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client
        }),
        systemPrompt: '당신은 날씨와 검색에 능숙한 AI 비서입니다.'
    });

    // 함수 등록
    robotaWithForceMode.registerFunctions({
        getWeather,
        searchDatabase
    });

    // 강제 함수 호출 모드
    const result6 = await robotaWithForceMode.run('뭐든지 질문해보세요', {
        functionCallMode: 'force',
        forcedFunction: 'getWeather',
        forcedArguments: { location: '부산' }
    });
    console.log('응답:', result6);
    console.log();

    // 7. 전역 함수 호출 설정
    console.log('예제 7: 전역 함수 호출 설정');
    console.log('---------------------------');
    const robotaWithGlobalConfig = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client
        }),
        systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.',
        functionCallConfig: {
            defaultMode: 'disabled',
            allowedFunctions: ['getWeather']
        }
    });

    // 함수 등록
    robotaWithGlobalConfig.registerFunctions({
        getWeather,
        searchDatabase
    });

    // 함수 호출 설정 변경
    robotaWithGlobalConfig.configureFunctionCall({
        mode: 'auto',
        allowedFunctions: ['getWeather', 'searchDatabase']
    });

    const result7 = await robotaWithGlobalConfig.run('서울에 대한 정보를 검색해줘');
    console.log('응답:', result7);
}

// 예제 실행
runExamples().catch(console.error); 