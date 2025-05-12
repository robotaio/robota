/**
 * 도구(Tools) 사용 예제
 * 
 * 이 예제는 Robota에서 도구(Tools)를 정의하고 사용하는 방법을 보여줍니다.
 * zod를 사용하여 도구의 입력과 출력을 검증합니다.
 */

import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';

// 환경 변수 로드
dotenv.config();

// 도구 인터페이스 정의
interface Tool {
    name: string;
    description: string;
    execute: (params: any) => Promise<any>;
}

// 검색 도구 스키마 정의
const searchSchema = z.object({
    query: z.string().describe('검색할 쿼리'),
    limit: z.number().optional().describe('검색 결과 개수 (기본값: 5)')
});

// 검색 파라미터 타입
type SearchParams = z.infer<typeof searchSchema>;

// 번역 도구 스키마 정의
const translateSchema = z.object({
    text: z.string().describe('번역할 텍스트'),
    sourceLanguage: z.string().describe('원본 언어 (예: "en", "ko", "ja")'),
    targetLanguage: z.string().describe('대상 언어 (예: "en", "ko", "ja")')
});

// 번역 파라미터 타입
type TranslateParams = z.infer<typeof translateSchema>;

// 날씨 도구 스키마 정의
const weatherSchema = z.object({
    location: z.string().describe('날씨를 조회할 위치'),
    unit: z.enum(['celsius', 'fahrenheit']).optional().describe('온도 단위 (기본값: celsius)')
});

// 날씨 파라미터 타입
type WeatherParams = z.infer<typeof weatherSchema>;

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

    // 도구 생성
    const searchTool: Tool = {
        name: 'search',
        description: '인터넷에서 정보를 검색합니다',
        execute: async (params: SearchParams) => {
            const { query, limit = 5 } = params;
            console.log(`"${query}" 검색 중... (최대 ${limit}개 결과)`);
            // 실제 구현에서는 실제 검색 API를 사용할 수 있습니다
            return {
                results: [
                    { title: '검색 결과 1', snippet: '이것은 첫 번째 검색 결과입니다.' },
                    { title: '검색 결과 2', snippet: '이것은 두 번째 검색 결과입니다.' },
                ],
                totalResults: 2
            };
        }
    };

    const translateTool: Tool = {
        name: 'translate',
        description: '텍스트를 다른 언어로 번역합니다',
        execute: async (params: TranslateParams) => {
            const { text, sourceLanguage, targetLanguage } = params;
            console.log(`"${text}"를 ${sourceLanguage}에서 ${targetLanguage}로 번역 중...`);
            // 실제 구현에서는 번역 API를 사용할 수 있습니다
            if (sourceLanguage === 'ko' && targetLanguage === 'en') {
                return { translatedText: 'This is a sample translation.' };
            } else if (sourceLanguage === 'en' && targetLanguage === 'ko') {
                return { translatedText: '이것은 예시 번역입니다.' };
            } else {
                return { translatedText: '번역 예시' };
            }
        }
    };

    const weatherTool: Tool = {
        name: 'getWeather',
        description: '특정 위치의 현재 날씨 정보를 가져옵니다',
        execute: async (params: WeatherParams) => {
            const { location, unit = 'celsius' } = params;
            console.log(`${location}의 날씨를 ${unit} 단위로 검색 중...`);
            // 실제 구현에서는 날씨 API를 사용할 수 있습니다
            return {
                temperature: unit === 'celsius' ? 22 : 71.6,
                condition: '맑음',
                humidity: 65,
                unit: unit
            };
        }
    };

    // Robota 인스턴스 생성
    const robota = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client: openaiClient
        }),
        systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다. 사용자 요청에 따라 적절한 도구를 사용하여 정보를 제공하세요.'
    });

    // 도구 등록 방법 (참고: 실제 @robota/core에서는 아직 지원하지 않을 수 있음)
    // 도구 시뮬레이션을 위해 이 코드는 그대로 유지합니다.
    // 실제 구현에서는 robota.registerTools([searchTool, translateTool, weatherTool]); 형태일 수 있습니다.

    console.log('===== 도구 사용 예제 =====');

    // 검색 도구 사용 예제
    console.log('\n[검색 도구 시뮬레이션]');
    const searchQuery = '인공지능에 대한 최신 정보';
    console.log(`쿼리: "${searchQuery}"`);
    const searchResult = await searchTool.execute({ query: searchQuery });
    const searchResponse = await robota.run(`다음 검색 결과를 요약해주세요: ${JSON.stringify(searchResult)}`);
    console.log('응답:', searchResponse);

    // 번역 도구 사용 예제
    console.log('\n[번역 도구 시뮬레이션]');
    const translateText = '안녕하세요';
    console.log(`텍스트: "${translateText}"`);
    const translateResult = await translateTool.execute({
        text: translateText,
        sourceLanguage: 'ko',
        targetLanguage: 'en'
    });
    console.log('응답:', translateResult.translatedText);

    // 날씨 도구 사용 예제
    console.log('\n[날씨 도구 시뮬레이션]');
    const location = '뉴욕';
    console.log(`위치: "${location}"`);
    const weatherResult = await weatherTool.execute({ location });
    const weatherResponse = await robota.run(`다음 날씨 정보를 사용자 친화적으로 설명해주세요: ${JSON.stringify(weatherResult)}`);
    console.log('응답:', weatherResponse);

    // 여러 도구 조합 예제
    console.log('\n[여러 도구 조합 시뮬레이션]');
    const weatherInfo = await weatherTool.execute({ location: '서울' });
    const translatedWeather = await translateTool.execute({
        text: `서울의 현재 날씨: 온도 ${weatherInfo.temperature}°C, 상태: ${weatherInfo.condition}, 습도: ${weatherInfo.humidity}%`,
        sourceLanguage: 'ko',
        targetLanguage: 'en'
    });
    console.log('응답:', translatedWeather.translatedText);
}

// 실행
main().catch(error => {
    console.error('오류 발생:', error);
}); 