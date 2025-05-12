/**
 * 도구 사용 예제
 * 
 * 이 예제는 Robota에서 zod를 사용한 도구 생성 및 사용법을 보여줍니다.
 */

import { Robota, Tool } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';
import { z } from 'zod';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

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

    // 날씨 검색 도구 생성
    const weatherTool = new Tool({
        name: 'getWeather',
        description: '특정 위치의 현재 날씨 정보를 가져옵니다',
        parameters: z.object({
            location: z.string().describe('날씨를 확인할 도시 이름'),
            unit: z.enum(['celsius', 'fahrenheit']).optional().describe('온도 단위')
        }),
        execute: async ({ location, unit = 'celsius' }) => {
            console.log(`${location}의 날씨를 ${unit} 단위로 조회 중...`);

            // 테스트용 가상 데이터
            return {
                temperature: unit === 'celsius' ? 22 : 71.6,
                condition: '맑음',
                humidity: 65,
                unit
            };
        }
    });

    // 수학 계산 도구 생성
    const calculatorTool = new Tool({
        name: 'calculate',
        description: '수학 계산을 수행합니다',
        parameters: z.object({
            expression: z.string().describe('계산할 수식')
        }),
        execute: async ({ expression }) => {
            console.log(`계산 중: ${expression}`);

            try {
                // 간단한 검증 (숫자와 기본 연산자만 허용)
                if (/^[0-9+\-*/().\s]*$/.test(expression)) {
                    return { result: eval(expression) };
                } else {
                    return { error: '지원되지 않는 표현식입니다. 숫자와 기본 연산자(+, -, *, /)만 사용하세요.' };
                }
            } catch (error) {
                return { error: '계산 중 오류가 발생했습니다.' };
            }
        }
    });

    // 이메일 전송 도구 생성
    const emailTool = new Tool({
        name: 'sendEmail',
        description: '이메일을 전송합니다',
        parameters: z.object({
            to: z.string().email('유효한 이메일 주소가 필요합니다').describe('수신자 이메일 주소'),
            subject: z.string().min(1, '제목은 비어있을 수 없습니다').describe('이메일 제목'),
            body: z.string().describe('이메일 내용'),
            cc: z.array(z.string().email()).optional().describe('참조(CC) 이메일 주소 목록'),
            bcc: z.array(z.string().email()).optional().describe('숨은참조(BCC) 이메일 주소 목록')
        }),
        execute: async ({ to, subject, body, cc, bcc }) => {
            console.log(`이메일 전송 중: ${to}, 제목: ${subject}`);

            // 실제 구현에서는 이메일 API 또는 SMTP 서버 호출
            // 테스트 목적으로는 전송되었다고 가정
            return {
                status: 'sent',
                messageId: 'msg-' + Math.random().toString(36).substring(2, 10),
                sentAt: new Date().toISOString()
            };
        }
    });

    // 검색 도구 생성
    const searchTool = new Tool({
        name: 'searchWeb',
        description: '웹에서 정보를 검색합니다',
        parameters: z.object({
            query: z.string().describe('검색어'),
            limit: z.number().int().min(1).max(10).optional().describe('결과 제한 수')
        }),
        execute: async ({ query, limit = 3 }) => {
            console.log(`검색 중: ${query}, 결과 수: ${limit}`);

            // 가상의 검색 결과
            return {
                results: Array.from({ length: limit }, (_, i) => ({
                    title: `${query}에 대한 검색 결과 ${i + 1}`,
                    url: `https://example.com/search/${encodeURIComponent(query)}/result${i + 1}`,
                    snippet: `이것은 ${query}에 대한 검색 결과 ${i + 1}의 요약입니다. 더 많은, 유용한 정보는 링크를 참조하세요.`
                }))
            };
        }
    });

    // Robota 인스턴스 생성
    const robota = new Robota({
        provider: new OpenAIProvider({
            model: 'gpt-4',
            client: openaiClient
        }),
        systemPrompt: `당신은 도움이 되는 AI 어시스턴트입니다. 
다양한 도구를 사용하여 사용자의 요청을 처리할 수 있습니다.
정확하고 유용한 정보를 제공하기 위해 적절한 도구를 선택하세요.`
    });

    // 도구 등록
    robota.registerTools([weatherTool, calculatorTool, emailTool, searchTool]);

    // 도구 사용 예제 실행
    console.log('===== 도구 사용 예제 =====');

    const response1 = await robota.run('도쿄의 현재 날씨가 어떤지 알려주세요.');
    console.log('응답:\n', response1);

    const response2 = await robota.run('(512 - 128) / 8의 계산 결과는 얼마인가요?');
    console.log('응답:\n', response2);

    const response3 = await robota.run('user@example.com으로 "회의 일정 알림"이라는 제목의 이메일을 보내고 싶어요. 내용은 "내일 오후 2시에 회의가 있습니다. 회의실: 3층 A회의실"로 작성해주세요.');
    console.log('응답:\n', response3);

    const response4 = await robota.run('인공지능에 대한 최신 정보를 검색해주세요. 결과는 2개만 보여주세요.');
    console.log('응답:\n', response4);
}

// 실행
main().catch(error => {
    console.error('오류 발생:', error);
}); 