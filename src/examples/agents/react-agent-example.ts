/**
 * ReAct 에이전트 예제
 * 
 * 이 예제는 ReAct 패턴을 사용한 에이전트 구현을 보여줍니다.
 * ReAct는 Reasoning(추론)과 Acting(행동)을 번갈아 수행하는 패턴입니다.
 */

import { ReActRobota } from '../../agents/react-agent';
import { OpenAIProvider } from '../../providers/openai-provider';
import { Tool } from '../../core/tool';
import { z } from 'zod';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

async function main() {
    // API 키 검증
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY 환경 변수가 필요합니다');
    }

    // OpenAI 클라이언트 생성
    const openaiClient = new OpenAI({
        apiKey
    });

    // 계산기 도구 생성
    const calculatorTool = new Tool({
        name: 'calculator',
        description: '수학 계산을 수행합니다',
        category: 'utility',
        parameters: z.object({
            expression: z.string().describe('계산할 수식 (예: 2 + 2, 5 * 10, Math.sqrt(16) 등)')
        }),
        execute: async ({ expression }) => {
            console.log(`계산 중: ${expression}`);

            try {
                // 안전한 eval 함수 (제한된 컨텍스트에서 실행)
                const safeEval = (expr: string) => {
                    // 수학 함수만 허용
                    const mathContext = {
                        Math,
                        abs: Math.abs,
                        ceil: Math.ceil,
                        floor: Math.floor,
                        log: Math.log,
                        max: Math.max,
                        min: Math.min,
                        pow: Math.pow,
                        random: Math.random,
                        round: Math.round,
                        sqrt: Math.sqrt
                    };

                    // 간단한 사칙연산 및 수학 함수만 허용
                    const result = Function(...Object.keys(mathContext), `"use strict"; return (${expr});`)(...Object.values(mathContext));
                    return result;
                };

                const result = safeEval(expression);

                return {
                    status: 'success',
                    data: { result }
                };
            } catch (error) {
                return {
                    status: 'error',
                    error: `계산 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`,
                    data: null
                };
            }
        }
    });

    // 날씨 조회 도구 (가상)
    const weatherTool = new Tool({
        name: 'getWeather',
        description: '특정 도시의 현재 날씨 정보를 조회합니다',
        category: 'data',
        parameters: z.object({
            city: z.string().describe('날씨를 조회할 도시 이름'),
            country: z.string().optional().describe('국가 코드 (선택사항, 예: KR, US, JP)')
        }),
        execute: async ({ city, country }) => {
            console.log(`날씨 조회 중: ${city}, ${country || '국가 미지정'}`);

            // 가상의 날씨 데이터 (실제 구현에서는 날씨 API 호출)
            const weatherData = {
                '서울': { temperature: 15, condition: '맑음', humidity: 45 },
                '뉴욕': { temperature: 20, condition: '흐림', humidity: 60 },
                '도쿄': { temperature: 18, condition: '비', humidity: 75 },
                '런던': { temperature: 12, condition: '안개', humidity: 80 }
            };

            const normalizedCity = city.toLowerCase();

            // 도시별 날씨 정보 반환
            if (normalizedCity.includes('서울')) {
                return { status: 'success', data: weatherData['서울'] };
            } else if (normalizedCity.includes('뉴욕')) {
                return { status: 'success', data: weatherData['뉴욕'] };
            } else if (normalizedCity.includes('도쿄')) {
                return { status: 'success', data: weatherData['도쿄'] };
            } else if (normalizedCity.includes('런던')) {
                return { status: 'success', data: weatherData['런던'] };
            } else {
                return {
                    status: 'success',
                    data: {
                        temperature: Math.floor(Math.random() * 30),
                        condition: ['맑음', '흐림', '비', '안개', '눈'][Math.floor(Math.random() * 5)],
                        humidity: Math.floor(Math.random() * 100)
                    }
                };
            }
        }
    });

    // 검색 도구 (가상)
    const searchTool = new Tool({
        name: 'searchWeb',
        description: '웹에서 정보를 검색합니다',
        category: 'data',
        parameters: z.object({
            query: z.string().describe('검색어')
        }),
        execute: async ({ query }) => {
            console.log(`검색 중: ${query}`);

            // 가상의 검색 결과
            const searchResults = {
                '날씨': [
                    '오늘의 날씨 정보를 확인하려면 지역을 입력하세요.',
                    '날씨는 지역마다 다를 수 있으며, 기상청에서 정확한 정보를 제공합니다.',
                    '날씨 앱이나 웹사이트를 통해 실시간 날씨를 확인할 수 있습니다.'
                ],
                '계산': [
                    '수학적 계산을 위해 계산기 도구를 사용할 수 있습니다.',
                    '복잡한 계산은 Calculator 도구에 수식을 입력하세요.',
                    '수학 함수를 사용하여 다양한 계산이 가능합니다.'
                ]
            };

            // 검색어에 따른 결과 반환
            const normalizedQuery = query.toLowerCase();
            let results = [];

            if (normalizedQuery.includes('날씨')) {
                results = searchResults['날씨'];
            } else if (normalizedQuery.includes('계산')) {
                results = searchResults['계산'];
            } else {
                results = [
                    `${query}에 대한 첫 번째 검색 결과입니다.`,
                    `${query}와 관련된 정보는 다양한 웹사이트에서 찾을 수 있습니다.`,
                    `${query}에 대한 자세한 내용은 위키백과를 참조하세요.`
                ];
            }

            return {
                status: 'success',
                data: { results }
            };
        }
    });

    // ReAct 에이전트 생성
    const reactAgent = new ReActRobota({
        name: '멀티툴 도우미',
        description: '계산, 날씨 조회, 웹 검색을 수행할 수 있는 AI 도우미',
        provider: new OpenAIProvider({
            model: 'gpt-4-turbo',
            client: openaiClient
        }),
        tools: [calculatorTool, weatherTool, searchTool],
        maxIterations: 5,
        chainOfThought: true
    });

    // 에이전트 실행
    console.log('===== ReAct 에이전트 예제 =====\n');

    // 사용자 쿼리 예시
    const queries = [
        '25 × 3의 제곱근은 얼마인가요?',
        '오늘 서울의 날씨는 어때요? 우산을 가져가야 할까요?',
        '특정 도구를 직접 호출하지 않고 복합적인 문제 해결: 2^10은 얼마이고, 이 값을 섭씨로 변환하면 몇 도인가요?'
    ];

    for (const query of queries) {
        console.log(`\n[사용자] ${query}`);
        console.log('-----------------------------------');

        try {
            // 에이전트 실행
            const result = await reactAgent.run(query);

            console.log('[에이전트 응답]');
            console.log(result);
        } catch (error) {
            console.error('오류 발생:', error);
        }

        console.log('===================================');
    }
}

// 실행
main().catch(error => {
    console.error('오류 발생:', error);
}); 