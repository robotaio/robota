/**
 * 함수 호출 예제
 * 
 * 이 예제는 OpenAI API의 함수 호출 기능을 직접 사용하여 간단한 애플리케이션을 구현합니다.
 * 날씨 조회와 계산 기능을 구현합니다.
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

    // 함수 정의
    const tools = [
        {
            type: "function",
            function: {
                name: "getWeather",
                description: "특정 위치의 현재 날씨 정보를 가져옵니다",
                parameters: {
                    type: "object",
                    properties: {
                        location: {
                            type: "string",
                            description: "날씨를 조회할 위치 (예: '서울', '뉴욕')"
                        },
                        unit: {
                            type: "string",
                            enum: ["celsius", "fahrenheit"],
                            description: "온도 단위 (기본값: celsius)"
                        }
                    },
                    required: ["location"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "calculate",
                description: "수학 계산식을 계산합니다",
                parameters: {
                    type: "object",
                    properties: {
                        expression: {
                            type: "string",
                            description: "계산할 수학 표현식 (예: '2 + 2', '15 * 3')"
                        }
                    },
                    required: ["expression"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "convertTemperature",
                description: "온도를 다른 단위로 변환합니다",
                parameters: {
                    type: "object",
                    properties: {
                        temperature: {
                            type: "number",
                            description: "변환할 온도"
                        },
                        fromUnit: {
                            type: "string",
                            enum: ["celsius", "fahrenheit"],
                            description: "원본 온도 단위"
                        },
                        toUnit: {
                            type: "string",
                            enum: ["celsius", "fahrenheit"],
                            description: "변환할 온도 단위"
                        }
                    },
                    required: ["temperature", "fromUnit", "toUnit"]
                }
            }
        }
    ];

    // 함수 구현
    const getWeather = async (location, unit = 'celsius') => {
        console.log(`${location}의 날씨를 ${unit} 단위로 검색 중...`);

        // 모의 날씨 데이터 (실제 앱에서는 Weather API 연동)
        const temperature = unit === 'celsius' ? 22 : 71.6;
        return {
            temperature,
            condition: '맑음',
            humidity: 65,
            unit
        };
    };

    const calculate = (expression) => {
        console.log(`계산: ${expression}`);

        try {
            // 주의: eval 사용은 보안상 권장되지 않으며, 이 예제에서만 사용합니다.
            // 실제 앱에서는 안전한 계산 라이브러리 사용 권장
            return {
                expression,
                result: eval(expression)
            };
        } catch (error) {
            return {
                expression,
                error: '계산할 수 없는 수식입니다'
            };
        }
    };

    const convertTemperature = (temp, fromUnit, toUnit) => {
        console.log(`${temp}${fromUnit}를 ${toUnit}로 변환 중...`);

        if (fromUnit === toUnit) return { temperature: temp, unit: toUnit };

        let convertedTemp;
        if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
            convertedTemp = (temp * 9 / 5) + 32;
        } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
            convertedTemp = (temp - 32) * 5 / 9;
        } else {
            return { error: '지원하지 않는 단위입니다' };
        }

        return {
            originalTemperature: temp,
            originalUnit: fromUnit,
            convertedTemperature: convertedTemp,
            convertedUnit: toUnit
        };
    };

    // 시스템 메시지
    const systemMessage = {
        role: "system",
        content: "당신은 도움이 되는 AI 어시스턴트입니다. 날씨 정보와 계산 기능을 제공할 수 있습니다. 사용자의 요청에 따라 적절한 함수를 호출하여 정확한 정보를 제공하세요."
    };

    // 1. 자동 함수 호출 모드
    console.log('===== 함수 호출 예제 =====');

    const userQuery1 = "서울의 현재 날씨가 어떤지 알려주고, 온도를 화씨로 변환해줘.";
    console.log(`사용자: ${userQuery1}`);

    // 첫 번째 요청: 날씨 조회 및 변환
    const response1 = await openai.chat.completions.create({
        model: "gpt-4-0613",
        messages: [systemMessage, { role: "user", content: userQuery1 }],
        tools: tools,
        tool_choice: "auto"
    });

    // 도구 호출 처리
    let responseContent1 = "";
    const message1 = response1.choices[0].message;

    if (message1.tool_calls) {
        // 각 도구 호출 처리
        for (const toolCall of message1.tool_calls) {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            let functionResponse;
            if (functionName === 'getWeather') {
                functionResponse = await getWeather(functionArgs.location, functionArgs.unit);
            } else if (functionName === 'calculate') {
                functionResponse = calculate(functionArgs.expression);
            } else if (functionName === 'convertTemperature') {
                functionResponse = convertTemperature(
                    functionArgs.temperature,
                    functionArgs.fromUnit,
                    functionArgs.toUnit
                );
            }

            // 도구 호출 결과 전달
            const secondResponse = await openai.chat.completions.create({
                model: "gpt-4-0613",
                messages: [
                    systemMessage,
                    { role: "user", content: userQuery1 },
                    message1,
                    {
                        role: "tool",
                        tool_call_id: toolCall.id,
                        name: functionName,
                        content: JSON.stringify(functionResponse)
                    }
                ]
            });

            responseContent1 = secondResponse.choices[0].message.content;
        }
    } else {
        responseContent1 = message1.content;
    }

    console.log(`AI 응답: ${responseContent1}`);

    // 두 번째 요청: 계산
    const userQuery2 = "15 + 27 - 3 * 4의 계산 결과가 얼마인지 알려줘.";
    console.log(`\n사용자: ${userQuery2}`);

    const response2 = await openai.chat.completions.create({
        model: "gpt-4-0613",
        messages: [
            systemMessage,
            { role: "user", content: userQuery1 },
            { role: "assistant", content: responseContent1 },
            { role: "user", content: userQuery2 }
        ],
        tools: tools,
        tool_choice: "auto"
    });

    // 도구 호출 처리
    let responseContent2 = "";
    const message2 = response2.choices[0].message;

    if (message2.tool_calls) {
        // 각 도구 호출 처리
        for (const toolCall of message2.tool_calls) {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            let functionResponse;
            if (functionName === 'calculate') {
                functionResponse = calculate(functionArgs.expression);
            } else if (functionName === 'getWeather') {
                functionResponse = await getWeather(functionArgs.location, functionArgs.unit);
            } else if (functionName === 'convertTemperature') {
                functionResponse = convertTemperature(
                    functionArgs.temperature,
                    functionArgs.fromUnit,
                    functionArgs.toUnit
                );
            }

            // 도구 호출 결과 전달
            const secondResponse = await openai.chat.completions.create({
                model: "gpt-4-0613",
                messages: [
                    systemMessage,
                    { role: "user", content: userQuery1 },
                    { role: "assistant", content: responseContent1 },
                    { role: "user", content: userQuery2 },
                    message2,
                    {
                        role: "tool",
                        tool_call_id: toolCall.id,
                        name: functionName,
                        content: JSON.stringify(functionResponse)
                    }
                ]
            });

            responseContent2 = secondResponse.choices[0].message.content;
        }
    } else {
        responseContent2 = message2.content;
    }

    console.log(`AI 응답: ${responseContent2}`);

    // 3. 강제 함수 호출
    console.log('\n===== 강제 함수 호출 예제 =====');

    const userQuery3 = "뉴욕의 날씨는 어때?";
    console.log(`사용자: ${userQuery3}`);

    // 특정 함수 강제 호출
    const response3 = await openai.chat.completions.create({
        model: "gpt-4-0613",
        messages: [
            systemMessage,
            { role: "user", content: userQuery3 }
        ],
        tools: tools,
        tool_choice: {
            type: "function",
            function: {
                name: "getWeather"
            }
        }
    });

    const message3 = response3.choices[0].message;
    let responseContent3 = "";

    if (message3.tool_calls) {
        const toolCall = message3.tool_calls[0];
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        const functionResponse = await getWeather(functionArgs.location, functionArgs.unit);

        const finalResponse = await openai.chat.completions.create({
            model: "gpt-4-0613",
            messages: [
                systemMessage,
                { role: "user", content: userQuery3 },
                message3,
                {
                    role: "tool",
                    tool_call_id: toolCall.id,
                    name: functionName,
                    content: JSON.stringify(functionResponse)
                }
            ]
        });

        responseContent3 = finalResponse.choices[0].message.content;
    } else {
        responseContent3 = message3.content;
    }

    console.log(`AI 응답: ${responseContent3}`);
}

// 실행
main().catch(error => {
    console.error('오류 발생:', error);
}); 