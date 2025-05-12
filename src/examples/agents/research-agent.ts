/**
 * 리서치 에이전트 예제
 * 
 * 이 예제는 검색, 요약, 번역 기능을 갖춘 리서치 에이전트를 구현합니다.
 */

import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// 검색 데이터베이스 타입 정의
interface SearchDatabase {
    [key: string]: string[];
}

// 간단한 검색 결과 시뮬레이션
const searchDatabase: SearchDatabase = {
    'AI': [
        '인공지능(AI)은 인간의 학습, 추론, 지각, 문제 해결 능력 등을 컴퓨터 프로그램으로 구현한 기술입니다.',
        '딥러닝은 인공지능의 한 분야로, 신경망을 여러 계층으로 쌓아올린 심층 신경망을 사용합니다.',
        '생성형 AI는 새로운 콘텐츠를 생성할 수 있는 인공지능 모델을 말합니다.'
    ],
    'JavaScript': [
        'JavaScript는 웹 페이지에 인터랙티브한 기능을 추가하기 위한 프로그래밍 언어입니다.',
        'Node.js는 서버 사이드에서 JavaScript를 실행할 수 있게 해주는 런타임 환경입니다.',
        'TypeScript는 JavaScript의 슈퍼셋 언어로, 정적 타입을 지원합니다.'
    ],
    'Korea': [
        '대한민국은 동아시아에 위치한 국가로, 수도는 서울입니다.',
        '한국은 세계적인 IT 강국으로, 삼성, LG, 현대 등의 글로벌 기업들이 있습니다.',
        '한국의 대중문화인 K-Pop, K-Drama 등은 전 세계적으로 인기를 끌고 있습니다.'
    ]
};

// 간단한 번역 시뮬레이션
function simulateTranslation(text: string, targetLanguage: string): string {
    if (targetLanguage === 'en') {
        // 한국어 -> 영어 번역 시뮬레이션
        return `[Translation to English] ${text}`;
    } else if (targetLanguage === 'ko') {
        // 영어 -> 한국어 번역 시뮬레이션
        return `[영어에서 한국어로 번역] ${text}`;
    } else {
        return `[${targetLanguage}로 번역] ${text}`;
    }
}

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

    // 리서치 에이전트 시스템 프롬프트
    const researchSystemPrompt = `당신은 유능한 리서치 어시스턴트입니다.
사용자가 제공하는 주제에 대해 정보를 수집하고, 요약하고, 필요하면 번역합니다.
중요한 정보를 먼저 제시하고, 관련 있는 세부 정보를 명확하게 설명하세요.
정보 출처를 항상 밝히고, 정보의 신뢰성을 평가하세요.`;

    // Robota 인스턴스 생성
    const researchAgent = new Robota({
        name: '리서치 에이전트',
        description: '정보를 검색하고 요약하는 에이전트',
        provider: new OpenAIProvider({
            model: 'gpt-4-0613',
            client: openaiClient
        }),
        systemPrompt: researchSystemPrompt
    });

    // 리서치 에이전트 함수
    async function researchTopic(topic: string, language: string = 'ko') {
        console.log(`"${topic}" 주제에 대한 리서치 시작...`);

        // 1. 검색 단계
        console.log(`"${topic}" 검색 중...`);
        const searchResults = searchDatabase[topic] || [
            `${topic}에 대한 검색 결과가 없습니다.`,
            '다른 키워드로 시도해보세요.'
        ];

        // 2. 내용 요약 단계
        console.log(`검색 결과 요약 중...`);
        const summarizePrompt = `다음 정보를 요약해주세요:\n\n${searchResults.join('\n')}`;
        const summary = await researchAgent.run(summarizePrompt);

        // 3. 필요한 경우 번역 단계
        if (language !== 'ko') {
            console.log(`${language}로 번역 중...`);
            const translatedSummary = simulateTranslation(summary, language);
            return {
                originalSummary: summary,
                translatedSummary
            };
        }

        return { summary };
    }

    console.log('===== 리서치 에이전트 예제 =====');

    // 한국어로 AI 주제 리서치
    console.log('\n[예제 1] AI 주제 리서치 (한국어)');
    const aiResearch = await researchTopic('AI');
    console.log('\n결과:', aiResearch.summary);

    // 영어로 한국 주제 리서치
    console.log('\n[예제 2] Korea 주제 리서치 (영어로 번역)');
    const koreaResearchEn = await researchTopic('Korea', 'en');
    console.log('\n원본 요약:', koreaResearchEn.originalSummary);
    console.log('번역된 요약:', koreaResearchEn.translatedSummary);

    // 사용자 입력 주제 리서치
    const userTopic = 'JavaScript';
    console.log(`\n[예제 3] ${userTopic} 주제 리서치 (한국어)`);
    const userResearch = await researchTopic(userTopic);
    console.log('\n결과:', userResearch.summary);
}

// 실행
main().catch(error => {
    console.error('오류 발생:', error);
}); 