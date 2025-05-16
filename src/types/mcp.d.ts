/**
 * MCP (Model Context Protocol) 타입 정의
 *
 * @module MCPTypes
 * @description
 * MCP(Model Context Protocol) 관련 타입 정의를 제공합니다.
 */
/**
 * MCP 클라이언트 인터페이스
 *
 * @interface MCPClient
 * @description
 * MCP 클라이언트의 기본 인터페이스입니다.
 * @modelcontextprotocol/sdk의 Client 클래스와 호환됩니다.
 */
export interface MCPClient {
    /**
     * 채팅 요청 처리
     *
     * @param {any} options - 요청 옵션
     * @returns {Promise<any>} MCP 응답
     */
    chat(options: any): Promise<any>;
    /**
     * 스트리밍 채팅 요청 처리
     *
     * @param {any} options - 요청 옵션
     * @returns {AsyncIterable<any>} 응답 스트림
     */
    stream(options: any): Promise<AsyncIterable<any>>;
    /**
     * 연결 설정
     *
     * @param transport - 사용할 트랜스포트
     * @returns 연결 결과
     */
    connect?: (transport: any) => Promise<void>;
    /**
     * 도구 목록 조회
     *
     * @returns 사용 가능한 도구 목록
     */
    listTools?: () => Promise<any[]>;
    /**
     * 도구 호출
     *
     * @param name - 도구 이름
     * @param args - 도구 인자
     * @returns 도구 실행 결과
     */
    callTool?: (name: string, args: any) => Promise<any>;
    /**
     * 리소스 조회
     *
     * @param uri - 리소스 URI
     * @returns 리소스 내용
     */
    getResource?: (uri: string) => Promise<any>;
    /**
     * 연결 종료
     *
     * @returns 종료 결과
     */
    close?: () => Promise<void>;
}
/**
 * MCP 트랜스포트 인터페이스
 */
export interface MCPTransport {
    /**
     * 연결 설정
     *
     * @returns 연결 결과
     */
    connect?: () => Promise<void>;
    /**
     * 연결 종료
     *
     * @returns 종료 결과
     */
    close?: () => Promise<void>;
}
//# sourceMappingURL=mcp.d.ts.map