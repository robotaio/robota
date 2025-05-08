import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Robota } from '../src/robota';
import { SimpleMemory } from '../src/memory';
import type { Message, Context, ModelResponse } from '../src/types';

// 테스트를 위한 모델 컨텍스트 프로토콜 인터페이스
interface ModelContextProtocol {
  options: { model: string };
  chat(context: Context): Promise<ModelResponse>;
  chatStream(context: Context): AsyncGenerator<any, void, unknown>;
  formatMessages(messages: Message[]): any;
  formatFunctions(functions: any[]): any;
  parseResponse(response: any): ModelResponse;
  parseStreamingChunk(chunk: any): any;
}

// 테스트를 위한 가짜 제공업체 구현
class MockProvider implements ModelContextProtocol {
  public options = { model: 'mock-model' };
  public lastContext: Context | null = null;
  public mockResponse: ModelResponse = { content: '안녕하세요!' };

  async chat(context: Context): Promise<ModelResponse> {
    this.lastContext = context;
    return this.mockResponse;
  }

  async *chatStream(context: Context): AsyncGenerator<any, void, unknown> {
    this.lastContext = context;
    yield { content: '안녕', isComplete: false };
    yield { content: '하세요', isComplete: true };
  }

  formatMessages(messages: Message[]): any {
    return messages;
  }

  formatFunctions(functions: any[]): any {
    return functions;
  }

  parseResponse(response: any): ModelResponse {
    return response;
  }

  parseStreamingChunk(chunk: any): any {
    return chunk;
  }
}

describe('Robota', () => {
  let mockProvider: MockProvider;
  let robota: Robota;

  beforeEach(() => {
    mockProvider = new MockProvider();
    robota = new Robota({ provider: mockProvider });
  });

  describe('초기화', () => {
    it('기본 옵션으로 초기화되어야 함', () => {
      expect(robota['provider']).toBe(mockProvider);
      expect(robota['memory']).toBeInstanceOf(SimpleMemory);
      expect(robota['systemPrompt']).toBeUndefined();
    });

    it('사용자 정의 옵션으로 초기화되어야 함', () => {
      const customSystemPrompt = '당신은 도움이 되는 AI입니다.';
      const customMemory = new SimpleMemory();

      const customRobota = new Robota({
        provider: mockProvider,
        systemPrompt: customSystemPrompt,
        memory: customMemory
      });

      expect(customRobota['provider']).toBe(mockProvider);
      expect(customRobota['memory']).toBe(customMemory);
      expect(customRobota['systemPrompt']).toBe(customSystemPrompt);
    });
  });

  describe('run 메서드', () => {
    it('문자열 입력으로 실행할 수 있어야 함', async () => {
      const result = await robota.run('안녕하세요');

      // 제공업체에 올바른 컨텍스트가 전달되었는지 확인
      expect(mockProvider.lastContext).not.toBeNull();
      expect(mockProvider.lastContext?.messages).toHaveLength(1);
      expect(mockProvider.lastContext?.messages[0]).toEqual({
        role: 'user',
        content: '안녕하세요'
      });

      // 응답이 올바르게 반환되었는지 확인
      expect(result).toBe('안녕하세요!');
    });

    it('옵션을 전달할 수 있어야 함', async () => {
      mockProvider.mockResponse = { content: '맞춤형 응답' };

      const result = await robota.run('안녕하세요', {
        systemPrompt: '사용자 질문에 정확히 답변하세요.',
        temperature: 0.5
      });

      expect(mockProvider.lastContext?.systemPrompt).toBe('사용자 질문에 정확히 답변하세요.');
      expect(result).toBe('맞춤형 응답');
    });
  });

  describe('chat 메서드', () => {
    it('채팅 기록을 유지해야 함', async () => {
      mockProvider.mockResponse = { content: '첫 번째 응답' };
      await robota.chat('첫 번째 메시지');

      // 사용자 메시지와 응답이 메모리에 저장되었는지 확인
      expect(robota['memory'].getMessages()).toHaveLength(2);
      expect(robota['memory'].getMessages()[0]).toEqual({
        role: 'user',
        content: '첫 번째 메시지'
      });
      expect(robota['memory'].getMessages()[1]).toEqual({
        role: 'assistant',
        content: '첫 번째 응답'
      });

      // 두 번째 메시지 전송
      mockProvider.mockResponse = { content: '두 번째 응답' };
      await robota.chat('두 번째 메시지');

      // 전체 대화 기록 확인
      expect(robota['memory'].getMessages()).toHaveLength(4);
      expect(robota['memory'].getMessages()[2]).toEqual({
        role: 'user',
        content: '두 번째 메시지'
      });
      expect(robota['memory'].getMessages()[3]).toEqual({
        role: 'assistant',
        content: '두 번째 응답'
      });
    });
  });

  describe('함수 호출', () => {
    it('함수를 등록하고 호출할 수 있어야 함', async () => {
      const calculator = vi.fn().mockImplementation(({ a, b }) => a + b);

      robota.registerFunction({
        name: 'add',
        description: '두 숫자를 더합니다',
        parameters: {
          type: 'object',
          properties: {
            a: { type: 'number', description: '첫 번째 숫자' },
            b: { type: 'number', description: '두 번째 숫자' }
          },
          required: ['a', 'b']
        }
      }, calculator);

      // 함수 호출 응답 설정
      mockProvider.mockResponse = {
        functionCall: {
          name: 'add',
          arguments: { a: 5, b: 3 }
        }
      };

      await robota.run('5와 3을 더해주세요');

      // 함수가 호출되었는지 확인
      expect(calculator).toHaveBeenCalledWith({ a: 5, b: 3 });
    });
  });
}); 