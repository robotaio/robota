import { z } from 'zod';
import type { FunctionDefinition, FunctionCall, FunctionCallResult } from './types';

/**
 * 함수 스키마를 Zod 스키마로 변환하는 유틸리티 함수
 */
export function createFunctionSchema(definition: FunctionDefinition) {
  const propertySchemas: Record<string, z.ZodTypeAny> = {};
  
  if (definition.parameters && definition.parameters.properties) {
    for (const [key, prop] of Object.entries(definition.parameters.properties)) {
      switch (prop.type) {
        case 'string':
          propertySchemas[key] = z.string();
          break;
        case 'number':
          propertySchemas[key] = z.number();
          break;
        case 'boolean':
          propertySchemas[key] = z.boolean();
          break;
        case 'array':
          propertySchemas[key] = z.array(z.any());
          break;
        case 'object':
          propertySchemas[key] = z.record(z.any());
          break;
        default:
          propertySchemas[key] = z.any();
      }
    }
  }

  return z.object(propertySchemas);
}

/**
 * 함수 호출 핸들러 타입
 */
export type FunctionHandler = (
  args: Record<string, any>,
  context?: any
) => Promise<any>;

/**
 * 함수 호출 레지스트리
 */
export class FunctionRegistry {
  private functions: Map<string, FunctionHandler> = new Map();
  private definitions: Map<string, FunctionDefinition> = new Map();

  /**
   * 함수를 등록합니다
   */
  register(definition: FunctionDefinition, handler: FunctionHandler): void {
    this.functions.set(definition.name, handler);
    this.definitions.set(definition.name, definition);
  }

  /**
   * 등록된 모든 함수 정의를 반환합니다
   */
  getAllDefinitions(): FunctionDefinition[] {
    return Array.from(this.definitions.values());
  }

  /**
   * 함수 이름으로 함수 정의를 가져옵니다
   */
  getDefinition(name: string): FunctionDefinition | undefined {
    return this.definitions.get(name);
  }

  /**
   * 함수 호출을 실행합니다
   */
  async execute(
    functionCall: FunctionCall,
    context?: any
  ): Promise<FunctionCallResult> {
    const { name, arguments: args } = functionCall;
    const handler = this.functions.get(name);
    
    if (!handler) {
      throw new Error(`함수 '${name}'가 등록되지 않았습니다`);
    }

    try {
      const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
      const result = await handler(parsedArgs, context);
      
      return {
        name,
        result
      };
    } catch (error) {
      return {
        name,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
} 