import type { Context, FunctionDefinition, Message, ModelResponse, ProviderOptions, StreamingResponseChunk } from './types';

/**
 * 모델 컨텍스트 프로토콜 인터페이스
 * 
 * 이 인터페이스는 다양한 LLM 제공업체와 통신하기 위한 표준 방법을 정의합니다.
 * 각 제공업체는 이 인터페이스를 구현하여 해당 API와 통신합니다.
 */
export interface ModelContextProtocol {
  /**
   * 기본 모델 및 설정
   */
  options: ProviderOptions;
  
  /**
   * 주어진 컨텍스트로 모델에 요청을 보내고 응답을 받습니다.
   * 
   * @param context 요청 컨텍스트 (메시지, 함수 정의 등)
   * @returns 모델 응답
   */
  chat(context: Context): Promise<ModelResponse>;
  
  /**
   * 주어진 컨텍스트로 모델에 스트리밍 요청을 보내고 응답 청크를 받습니다.
   * 
   * @param context 요청 컨텍스트 (메시지, 함수 정의 등)
   * @returns 스트리밍 응답 AsyncGenerator
   */
  chatStream(context: Context): AsyncGenerator<StreamingResponseChunk, void, unknown>;
  
  /**
   * 메시지를 모델이 이해할 수 있는 형식으로 포맷합니다.
   * 
   * @param messages 메시지 배열
   * @returns 포맷된 메시지
   */
  formatMessages(messages: Message[]): any;
  
  /**
   * 함수 정의를 모델이 이해할 수 있는 형식으로 포맷합니다.
   * 
   * @param functions 함수 정의 배열
   * @returns 포맷된 함수 정의
   */
  formatFunctions(functions: FunctionDefinition[]): any;
  
  /**
   * 모델 응답을 표준 형식으로 파싱합니다.
   * 
   * @param response 모델의 원시 응답
   * @returns 표준화된 ModelResponse
   */
  parseResponse(response: any): ModelResponse;
  
  /**
   * 스트리밍 응답 청크를 표준 형식으로 파싱합니다.
   * 
   * @param chunk 모델의 원시 응답 청크
   * @returns 표준화된 StreamingResponseChunk
   */
  parseStreamingChunk(chunk: any): StreamingResponseChunk;
} 