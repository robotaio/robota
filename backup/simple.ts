/**
 * Robota 라이브러리의 간단한 사용 예제
 */

import { z } from 'zod';
import { Robota, OpenAIProvider, Tool, createFunction } from '../src';

// 환경 변수 로드
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY 환경 변수가 필요합니다.');
}

async function main() {
  // OpenAI 제공업체 설정
  const provider = new OpenAIProvider({
    apiKey: apiKey as string,
    model: 'gpt-4',
    temperature: 0.7
  });

  // Robota 인스턴스 생성
  const robota = new Robota({
    provider,
    systemPrompt: '당신은 도움이 되는 AI 비서입니다. 주어진 도구를 사용하여 사용자의 요청을 처리하세요.'
  });

  // 날씨 함수 생성
  const getWeather = createFunction({
    name: 'getWeather',
    description: '특정 위치의 현재 날씨 정보를 가져옵니다',
    parameters: z.object({
      location: z.string().describe('날씨를 확인할 도시 이름 (예: 서울, 부산)'),
      unit: z.enum(['celsius', 'fahrenheit']).default('celsius').describe('온도 단위')
    }),
    execute: async ({ location, unit }) => {
      console.log(`${location}의 날씨를 ${unit} 단위로 가져오는 중...`);
      // 실제 구현에서는 날씨 API 호출
      
      // 임시 응답 데이터
      const data = {
        location,
        temperature: unit === 'celsius' ? 25 : 77,
        condition: '맑음',
        humidity: 60,
        windSpeed: 10,
        unit
      };

      // 2초 지연 (API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return data;
    }
  });

  // 계산기 도구 생성
  const calculator = new Tool({
    name: 'calculator',
    description: '수학 계산을 수행합니다',
    parameters: z.object({
      expression: z.string().describe('계산할 수식 (예: 2 + 2, 5 * 10)')
    }),
    execute: async ({ expression }) => {
      try {
        // 주의: eval 함수는 잠재적으로 위험합니다
        // 실제 구현에서는 안전한 계산 라이브러리 사용 권장
        const result = eval(expression);
        
        return {
          status: 'success',
          data: {
            expression,
            result
          }
        };
      } catch (error) {
        return {
          status: 'error',
          error: `계산 오류: ${error instanceof Error ? error.message : String(error)}`,
          data: null
        };
      }
    }
  });

  // 함수와 도구 등록
  robota.registerFunctions({ getWeather });
  robota.registerTools([calculator]);

  try {
    // 일반 텍스트 질문
    console.log('질문 1: 타입스크립트란 무엇인가요?');
    const result1 = await robota.run('타입스크립트란 무엇인가요?');
    console.log('응답 1:', result1);
    console.log('-------------------');

    // 함수 호출이 필요한 질문
    console.log('질문 2: 서울의 날씨가 어때요?');
    const result2 = await robota.run('서울의 날씨가 어때요?');
    console.log('응답 2:', result2);
    console.log('-------------------');

    // 계산이 필요한 질문
    console.log('질문 3: 15 * 7 + 3의 계산 결과를 알려주세요.');
    const result3 = await robota.run('15 * 7 + 3의 계산 결과를 알려주세요.');
    console.log('응답 3:', result3);
    console.log('-------------------');
    
    // 복합 질문
    console.log('질문 4: 도쿄의 날씨를 화씨로 알려주고, 섭씨로 변환해서도 알려줘.');
    const result4 = await robota.run('도쿄의 날씨를 화씨로 알려주고, 섭씨로 변환해서도 알려줘.');
    console.log('응답 4:', result4);
    
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 스크립트 실행
main().catch(console.error); 