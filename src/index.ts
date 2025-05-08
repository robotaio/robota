/**
 * Robota - 에이전틱 AI를 쉽게 만들 수 있는 JavaScript 라이브러리
 */

// 코어 클래스 및 인터페이스
export { Robota } from './core/robota';
export { Agent } from './core/agent';
export { Tool } from './core/tool';
export type { RobotaOptions, RunOptions } from './core/robota';

// 제공업체
export { BaseProvider } from './providers/base-provider';
export { OpenAIProvider } from './providers/openai-provider';
export { AnthropicProvider } from './providers/anthropic-provider';
export { LangchainProvider } from './providers/langchain-provider';
export { ReplicateProvider } from './providers/replicate-provider';
export { ProviderRouter } from './providers/provider-router';

// 함수 호출 및 도구
export { createFunction } from './core/function';
export { OpenAPIToolkit } from './utils/openapi-toolkit';
export { APIAuthentication } from './utils/api-authentication';

// 유틸리티
export { MemoryManager } from './utils/memory-manager';
export { ConversationMemory } from './utils/conversation-memory';

// 타입
export type {
  Provider,
  ProviderOptions,
  ProviderResponse,
  ProviderResponseStream
} from './types/provider';

export type {
  Message,
  FunctionSchema,
  ModelContext,
  ModelResponse
} from './types/model-context-protocol';

export type {
  Tool as ToolType,
  ToolOptions,
  ToolParameter,
  ToolResult
} from './types/tool';

export type {
  Function,
  FunctionOptions,
  FunctionResult
} from './types/function';

// 버전 정보
export const VERSION = '0.1.0'; 