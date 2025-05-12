/**
 * 리서치 에이전트 예제
 * 
 * 이 예제는 Robota를 사용하여 웹 검색, 요약, 번역 기능을 갖춘
 * 리서치 에이전트를 구현하는 방법을 보여줍니다.
 */

import { Robota, Tool } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';
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

    // 검색 도구 생성 (가상 구현)
    const searchTool = new Tool({
        name: 'searchWeb',
        description: '웹에서 정보를 검색합니다',
        parameters: z.object({
            query: z.string().describe('검색어')
        }),
        execute: async ({ query }) => {
            console.log(`검색 중: ${query}`);

            // 가상의 검색 결과
            return {
                results: [
                    `${query}에 대한 첫 번째 검색 결과: ${query}는 중요한 주제로, 다양한 측면에서 연구되고 있습니다. 최근 연구에 따르면...`,
                    `${query}에 대한 두 번째 검색 결과: ${query}의 역사는 수십 년 전으로 거슬러 올라갑니다. 초기에는...`,
                    `${query}에 대한 세 번째 검색 결과: ${query}의 미래 전망은 밝습니다. 전문가들은 앞으로 5년 내에...`
                ]
            };
        }
    });

    // 텍스트 요약 도구
    const summarizeTool = new Tool({
        name: 'summarizeText',
        description: '긴 텍스트를 간결하게 요약합니다',
        parameters: z.object({
            text: z.string().describe('요약할 텍스트')
        }),
        execute: async ({ text }) => {
            console.log('텍스트 요약 중...');

            // 실제 구현에서는 OpenAI API 등을 사용하여 요약 생성
            // 여기서는 간단히 텍스트 길이를 줄이는 방식으로 시뮬레이션
            const summary = text.length > 100
                ? text.substring(0, 100) + '... (이하 생략된 내용을 포함한 요약본)'
                : text;

            return { summary };
        }
    });

    // 번역 도구
    const translateTool = new Tool({
        name: 'translateText',
        description: '텍스트를 다른 언어로 번역합니다',
        parameters: z.object({
            text: z.string().describe('번역할 텍스트'),
            targetLanguage: z.string().describe('목표 언어 (예: "ko", "en", "ja")')
        }),
        execute: async ({ text, targetLanguage }) => {
            console.log(`번역 중: ${targetLanguage}로 변환`);

            // 실제 구현에서는 번역 API 사용
            // 여기서는 간단한 시뮬레이션
            const translatedText = `${text} (${targetLanguage}로 번역됨)`;

            return { translatedText };
        }
    });

    // 에이전트 생성
    const researchAgent = new Robota({
        name: '리서치 에이전트',
        description: '정보를 검색하고, 요약하고, 번역하는 에이전트',
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client: openaiClient
        }),
        tools: [searchTool, summarizeTool, translateTool],
        systemPrompt: `당신은 리서치 에이전트입니다.
사용자의 질문에 대해 다음과 같은 단계로 정보를 수집하고 제공하세요:

1. 사용자의 질문을 분석하고 적절한 검색어를 결정합니다.
2. 검색 도구를 사용하여 웹에서 정보를 검색합니다.
3. 검색 결과를 요약 도구를 사용하여 간결하게 요약합니다.
4. 필요한 경우 번역 도구를 사용하여 다른 언어로 번역합니다.
5. 수집한 정보를 바탕으로 종합적인 응답을 제공합니다.

각 단계에서 어떤 도구를 사용하는지와 왜 사용하는지 명확하게 설명하세요.
최종 응답은 사용자가 이해하기 쉽도록 구조화된 형태로 제공하세요.`
    });

    // 에이전트 실행
    console.log('===== 리서치 에이전트 예제 =====\n');

    const topics = [
        '인공지능의 역사와 발전 과정',
        '기후 변화의 원인과 영향',
        '블록체인 기술의 핵심 원리'
    ];

    for (const topic of topics) {
        console.log(`\n주제: ${topic}`);
        console.log('-----------------------------------');

        const result = await researchAgent.run(`${topic}에 대해 자세히 알아보고 싶습니다. 조사한 내용을 요약해서 알려주세요.`);

        console.log('응답:');
        console.log(result);
        console.log('===================================\n');
    }

    // 번역 요청 예제
    console.log('\n번역 요청 예제:');
    console.log('-----------------------------------');

    const translationResult = await researchAgent.run('양자 컴퓨팅의 기본 원리에 대해 조사하고, 결과를 영어로 번역해주세요.');

    console.log('응답:');
    console.log(translationResult);
}

// 실행
main().catch(error => {
    console.error('오류 발생:', error);
}); 