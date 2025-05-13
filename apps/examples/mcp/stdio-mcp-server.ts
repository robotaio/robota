import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

/**
 * STDIO 트랜스포트를 사용하는 MCP 서버 예제
 * 
 * 이 예제는 Node.js 표준 입출력(STDIO)을 통해 MCP 서버를 노출합니다.
 * 이 방식은 Robota처럼 어댑터를 통해 통신하는 경우에 유용합니다.
 */

console.log('STDIO MCP 서버 초기화 중...');

// MCP 서버 인스턴스 생성
const server = new McpServer({
    name: "Robota STDIO Server",
    version: "1.0.0"
});

// 'add' 도구 추가: 두 숫자의 합을 반환
server.tool(
    "add",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
        content: [{ type: "text", text: `결과: ${a + b}` }]
    })
);

// 'getWeather' 도구 추가: 위치에 따른 날씨 정보 반환
server.tool(
    "getWeather",
    {
        location: z.string().describe("날씨를 확인할 도시 이름"),
        unit: z.enum(["celsius", "fahrenheit"]).optional().default("celsius")
    },
    async ({ location, unit }) => {
        // 간단한 날씨 데이터
        const weatherData = {
            '서울': { temperature: 22, condition: '맑음', humidity: 65 },
            '부산': { temperature: 24, condition: '구름 조금', humidity: 70 },
            '제주': { temperature: 26, condition: '흐림', humidity: 75 }
        };

        const data = weatherData[location] || { temperature: 20, condition: '정보 없음', humidity: 50 };
        const temp = unit === 'fahrenheit' ? Math.round(data.temperature * 9 / 5 + 32) : data.temperature;

        return {
            content: [{
                type: "text",
                text: `${location}의 날씨: ${temp}°${unit === 'celsius' ? 'C' : 'F'}, ${data.condition}, 습도 ${data.humidity}%`
            }]
        };
    }
);

// 'greeting' 리소스 추가: 이름을 받아 인사 메시지 반환
server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => ({
        contents: [{
            uri: uri.href,
            text: `안녕하세요, ${name}님!`
        }]
    })
);

// STDIO 트랜스포트를 통해 서버 시작
console.log('STDIO 트랜스포트로 MCP 서버 시작 중...');
const transport = new StdioServerTransport();

// 서버 연결
(async () => {
    try {
        await server.connect(transport);
        console.log('STDIO MCP 서버가 시작되었습니다.');
        console.log('이 프로세스를 다른 프로그램의 자식 프로세스로 실행하여 STDIO를 통해 통신할 수 있습니다.');
    } catch (error) {
        console.error('서버 시작 중 오류 발생:', error);
        process.exit(1);
    }
})(); 