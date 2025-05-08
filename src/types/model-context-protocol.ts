/**
 * 모델 컨텍스트 프로토콜 타입 정의
 */

/**
 * 메시지 역할 타입
 */
export type MessageRole = 'user' | 'assistant' | 'system' | 'function';

/**
 * 메시지 인터페이스
 */
export interface Message {
  /**
   * 메시지 역할
   */
  role: MessageRole;
  
  /**
   * 메시지 내용
   */
  content: string;
  
  /**
   * 함수 이름 (role이 'function'인 경우)
   */
  name?: string;
  
  /**
   * 함수 호출 정보
   */
  functionCall?: {
    name: string;
    arguments: Record<string, any>;
  };
  
  /**
   * 함수 실행 결과
   */
  functionResult?: any;
}

/**
 * 함수 스키마 인터페이스 (OpenAI 호환)
 */
export interface FunctionSchema {
  /**
   * 함수 이름
   */
  name: string;
  
  /**
   * 함수 설명
   */
  description?: string;
  
  /**
   * 매개변수 스키마 (JSON Schema)
   */
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: any[];
      default?: any;
      items?: any;
      [key: string]: any;
    }>;
    required?: string[];
  };
}

/**
 * 모델 컨텍스트 인터페이스
 */
export interface ModelContext {
  /**
   * 대화 메시지 목록
   */
  messages: Message[];
  
  /**
   * 사용 가능한 함수 목록
   */
  functions?: FunctionSchema[];
  
  /**
   * 시스템 프롬프트
   */
  systemPrompt?: string;
  
  /**
   * 추가 메타데이터
   */
  metadata?: Record<string, any>;
}

/**
 * 모델 응답 인터페이스
 */
export interface ModelResponse {
  /**
   * 응답 내용
   */
  content?: string;
  
  /**
   * 함수 호출 정보
   */
  functionCall?: {
    name: string;
    arguments: Record<string, any>;
  };
  
  /**
   * 토큰 사용량 정보
   */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  
  /**
   * 추가 메타데이터
   */
  metadata?: Record<string, any>;
}

/**
 * 함수 호출 모드
 */
export type FunctionCallMode = 'auto' | 'force' | 'disabled';

/**
 * 모델 컨텍스트 프로토콜 인터페이스
 */
export interface ModelContextProtocol {
  /**
   * MCP 컨텍스트를 모델 고유 형식으로 변환
   */
  convertContextToModelFormat(context: ModelContext): any;
  
  /**
   * 모델 응답을 MCP 형식으로 변환
   */
  convertModelResponseToMCP(modelResponse: any): ModelResponse;
} 