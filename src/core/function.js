/**
 * 함수 생성 유틸리티
 *
 * @module Function
 * @description
 * AI가 호출할 수 있는 함수를 생성하고 관리하는 유틸리티입니다.
 * zod 라이브러리를 사용하여 함수 매개변수의 유효성 검사를 수행합니다.
 */
import { z } from 'zod';
/**
 * zod 스키마를 JSON 스키마 형식으로 변환
 * @param schema zod 스키마
 * @returns JSON 스키마
 */
function zodToJsonSchema(schema) {
    const jsonSchema = {
        type: 'object',
        properties: {},
        required: []
    };
    // zod 스키마의 shape 객체를 JSON 스키마 속성으로 변환
    const shape = schema._def.shape();
    const entries = Object.entries(shape);
    for (const [key, value] of entries) {
        const fieldSchema = convertZodTypeToJsonSchema(value, key);
        jsonSchema.properties[key] = fieldSchema;
        // 필수 필드 확인 (optional이 아니고 nullable이 아닌 경우)
        if (!isOptionalType(value) && !isNullableType(value)) {
            if (!jsonSchema.required) {
                jsonSchema.required = [];
            }
            jsonSchema.required.push(key);
        }
    }
    return jsonSchema;
}
/**
 * zod 타입을 JSON 스키마 타입으로 변환
 * @param zodType zod 타입
 * @param fieldName 필드 이름 (오류 메시지용)
 * @returns JSON 스키마 타입
 */
function convertZodTypeToJsonSchema(zodType, fieldName) {
    // 기본 JSON 스키마 객체
    const jsonSchema = {};
    // 설명 추출
    const description = getZodDescription(zodType);
    if (description) {
        jsonSchema.description = description;
    }
    // 타입에 따라 변환
    if (zodType instanceof z.ZodString) {
        jsonSchema.type = 'string';
        // 문자열 제약 조건
        if (zodType._def.checks) {
            for (const check of zodType._def.checks) {
                if (check.kind === 'min') {
                    jsonSchema.minLength = check.value;
                }
                else if (check.kind === 'max') {
                    jsonSchema.maxLength = check.value;
                }
                else if (check.kind === 'regex') {
                    jsonSchema.pattern = check.regex.source;
                }
                else if (check.kind === 'email') {
                    jsonSchema.format = 'email';
                }
                else if (check.kind === 'url') {
                    jsonSchema.format = 'uri';
                }
            }
        }
    }
    else if (zodType instanceof z.ZodNumber) {
        jsonSchema.type = 'number';
        // 숫자 제약 조건
        if (zodType._def.checks) {
            for (const check of zodType._def.checks) {
                if (check.kind === 'min') {
                    jsonSchema.minimum = check.value;
                }
                else if (check.kind === 'max') {
                    jsonSchema.maximum = check.value;
                }
                else if (check.kind === 'int') {
                    jsonSchema.type = 'integer';
                }
            }
        }
    }
    else if (zodType instanceof z.ZodBoolean) {
        jsonSchema.type = 'boolean';
    }
    else if (zodType instanceof z.ZodArray) {
        jsonSchema.type = 'array';
        jsonSchema.items = convertZodTypeToJsonSchema(zodType._def.type, `${fieldName}[]`);
        // 배열 제약 조건
        if (zodType._def.minLength !== null) {
            jsonSchema.minItems = zodType._def.minLength.value;
        }
        if (zodType._def.maxLength !== null) {
            jsonSchema.maxItems = zodType._def.maxLength.value;
        }
    }
    else if (zodType instanceof z.ZodEnum) {
        jsonSchema.type = 'string';
        jsonSchema.enum = zodType._def.values;
    }
    else if (zodType instanceof z.ZodObject) {
        jsonSchema.type = 'object';
        const nestedSchema = zodToJsonSchema(zodType);
        jsonSchema.properties = nestedSchema.properties;
        jsonSchema.required = nestedSchema.required;
    }
    else if (zodType instanceof z.ZodUnion) {
        jsonSchema.oneOf = zodType._def.options.map((option) => convertZodTypeToJsonSchema(option, fieldName));
    }
    else if (zodType instanceof z.ZodOptional) {
        return convertZodTypeToJsonSchema(zodType._def.innerType, fieldName);
    }
    else if (zodType instanceof z.ZodNullable) {
        const innerSchema = convertZodTypeToJsonSchema(zodType._def.innerType, fieldName);
        jsonSchema.type = [innerSchema.type, 'null'];
        Object.assign(jsonSchema, innerSchema);
    }
    else if (zodType instanceof z.ZodDefault) {
        const innerSchema = convertZodTypeToJsonSchema(zodType._def.innerType, fieldName);
        Object.assign(jsonSchema, innerSchema);
        jsonSchema.default = zodType._def.defaultValue();
    }
    else {
        // 기타 타입은 문자열로 처리
        jsonSchema.type = 'string';
        console.warn(`Unsupported zod type for field ${fieldName}, using string as fallback`);
    }
    return jsonSchema;
}
/**
 * zod 타입에서 설명 추출
 * @param zodType zod 타입
 * @returns 설명 문자열
 */
function getZodDescription(zodType) {
    // zod 타입의 메타데이터에서 설명을 추출
    const description = zodType._def.description;
    if (description)
        return description;
    // 내부 타입이 있는 경우 재귀적으로 설명 추출
    if (zodType instanceof z.ZodOptional || zodType instanceof z.ZodNullable) {
        return getZodDescription(zodType._def.innerType);
    }
    return undefined;
}
/**
 * zod 타입이 옵셔널인지 확인
 * @param zodType zod 타입
 * @returns 옵셔널 여부
 */
function isOptionalType(zodType) {
    return zodType instanceof z.ZodOptional ||
        (zodType instanceof z.ZodDefault);
}
/**
 * zod 타입이 null을 허용하는지 확인
 * @param zodType zod 타입
 * @returns nullable 여부
 */
function isNullableType(zodType) {
    return zodType instanceof z.ZodNullable;
}
/**
 * 함수 생성
 *
 * @function createFunction
 * @description
 * AI가 호출할 수 있는 함수를 생성합니다.
 * 함수 이름, 설명, 매개변수 스키마, 실행 로직을 정의할 수 있습니다.
 *
 * @template TParams 함수 매개변수 타입
 * @template TResult 함수 반환 결과 타입
 * @param {FunctionOptions<TParams, TResult>} options - 함수 옵션
 * @param {string} options.name - 함수 이름
 * @param {string} [options.description] - 함수 설명
 * @param {z.ZodObject<any> | FunctionSchema['parameters']} options.parameters - 매개변수 스키마
 * @param {(params: TParams) => Promise<TResult> | TResult} options.execute - 실행 로직
 * @returns {Function<TParams, TResult>} 생성된 함수 객체
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { createFunction } from 'robota';
 *
 * const getWeather = createFunction({
 *   name: 'getWeather',
 *   description: '특정 위치의 날씨 정보를 조회합니다.',
 *   parameters: z.object({
 *     location: z.string().describe('날씨를 조회할 위치 (도시명)'),
 *     unit: z.enum(['celsius', 'fahrenheit']).optional().describe('온도 단위')
 *   }),
 *   execute: async (params) => {
 *     // 날씨 API 호출 로직
 *     return { temperature: 25, condition: '맑음' };
 *   }
 * });
 * ```
 */
export function createFunction(options) {
    const { name, description, parameters, execute } = options;
    // zod 스키마를 JSON 스키마로 변환
    const schema = {
        name,
        description,
        parameters: parameters instanceof z.ZodObject
            ? zodToJsonSchema(parameters)
            : parameters
    };
    // 함수 실행 래퍼
    const wrappedExecute = async (params) => {
        try {
            // zod 스키마가 있는 경우 매개변수 유효성 검사
            if (parameters instanceof z.ZodObject) {
                parameters.parse(params);
            }
            // 함수 실행
            return await execute(params);
        }
        catch (error) {
            // zod 검증 오류 처리
            if (error instanceof z.ZodError) {
                const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                throw new Error(`Parameter validation failed: ${errorMessage}`);
            }
            // 기타 오류는 그대로 전파
            throw error;
        }
    };
    // 함수 객체 반환
    return {
        name,
        description,
        schema,
        execute: wrappedExecute
    };
}
/**
 * 일반 함수를 호출 가능한 함수로 변환
 *
 * @function functionFromCallback
 * @description
 * 일반 JavaScript 함수를 AI가 호출할 수 있는 Function 객체로 변환합니다.
 * 매개변수 타입은 자동으로 유추됩니다.
 *
 * @param {string} name - 함수 이름
 * @param {(...args: any[]) => any} fn - 변환할 JavaScript 함수
 * @param {string} [description] - 함수 설명
 * @returns {Function} AI가 호출할 수 있는 함수 객체
 *
 * @example
 * ```typescript
 * import { functionFromCallback } from 'robota';
 *
 * function add(a: number, b: number): number {
 *   return a + b;
 * }
 *
 * const addFunction = functionFromCallback(
 *   'add',
 *   add,
 *   '두 숫자를 더합니다.'
 * );
 * ```
 */
export function functionFromCallback(name, fn, description) {
    // 함수 매개변수 추출 (TypeScript 타입 정보 사용)
    // 런타임에는 타입 정보가 없으므로 기본적인 스키마 사용
    const parameters = {
        type: 'object',
        properties: {},
        required: []
    };
    // 실행 래퍼
    const execute = async (params) => {
        // 객체 매개변수를 배열로 변환
        const args = Object.values(params);
        try {
            return await fn(...args);
        }
        catch (error) {
            throw error;
        }
    };
    return {
        name,
        description,
        schema: {
            name,
            description,
            parameters
        },
        execute
    };
}
//# sourceMappingURL=function.js.map