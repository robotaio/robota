/**
 * 간단한 대화 예제
 * 
 * 이 예제는 OpenAI API를 직접 사용하여 간단한 대화를 구현합니다.
 * 모의 응답이 아닌 실제 API 호출을 합니다.
 */

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
    const openai = new OpenAI({
        apiKey
    });

    // 공통으로 사용할 시스템 메시지
    const systemMessage = {
        role: 'system',
        content: '당신은 도움이 되는 AI 어시스턴트입니다. 간결하고 유용한 응답을 제공하세요.'
    };

    // 간단한 대화 실행
    console.log('===== 간단한 대화 예제 =====');

    // 첫 번째 대화
    const userMessage1 = '안녕하세요! 타입스크립트에 대해 알려주세요.';
    console.log('사용자: ', userMessage1);

    const completion1 = await openai.chat.completions.create({
        model: 'gpt-4-0613',
        messages: [
            systemMessage,
            { role: 'user', content: userMessage1 }
        ],
        temperature: 0.7,
    });

    const response1 = completion1.choices[0].message.content;
    console.log('AI 응답: ', response1);

    // 두 번째 대화
    const userMessage2 = '타입스크립트와 자바스크립트의 주요 차이점을 3가지만 알려주세요.';
    console.log('\n사용자: ', userMessage2);

    const completion2 = await openai.chat.completions.create({
        model: 'gpt-4-0613',
        messages: [
            systemMessage,
            { role: 'user', content: userMessage1 },
            { role: 'assistant', content: response1 },
            { role: 'user', content: userMessage2 }
        ],
        temperature: 0.7,
    });

    const response2 = completion2.choices[0].message.content;
    console.log('AI 응답: ', response2);

    // 스트리밍 응답 예제
    console.log('\n===== 스트리밍 응답 예제 =====');
    const userMessage3 = '타입스크립트의 장점에 대해 자세히 설명해주세요.';
    console.log('사용자: ', userMessage3);
    console.log('AI 응답: ');

    const stream = await openai.chat.completions.create({
        model: 'gpt-4-0613',
        messages: [
            systemMessage,
            { role: 'user', content: userMessage1 },
            { role: 'assistant', content: response1 },
            { role: 'user', content: userMessage2 },
            { role: 'assistant', content: response2 },
            { role: 'user', content: userMessage3 }
        ],
        temperature: 0.7,
        stream: true,
    });

    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
    console.log('\n');
}

// 실행
main().catch(error => {
    console.error('오류 발생:', error);
}); 