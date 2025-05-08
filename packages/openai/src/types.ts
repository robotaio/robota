import { ProviderOptions } from '@robota/core';

/**
 * OpenAI 제공업체 옵션
 */
export interface OpenAIProviderOptions extends ProviderOptions {
  /**
   * OpenAI API 키
   */
  apiKey: string;
  
  /**
   * OpenAI 조직 ID (선택사항)
   */
  organization?: string;
  
  /**
   * API 요청 타임아웃 (밀리초)
   */
  timeout?: number;
  
  /**
   * API 기본 URL (기본값: 'https://api.openai.com/v1')
   */
  baseURL?: string;
  
  /**
   * 응답 형식 (기본값: 'json')
   */
  responseFormat?: 'json' | 'text';
} 