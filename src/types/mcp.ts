/**
 * MCP 관련 타입 정의
 * 
 * @module Types
 * @description
 * Model Context Protocol(MCP)에 관련된 타입 정의를 포함합니다.
 */

/**
 * MCP 클라이언트 인터페이스
 * @modelcontextprotocol/sdk의 Client와 호환됩니다
 */
export interface MCPClient {
    /**
     * 채팅 완성 요청
     * 
     * @param options - 요청 옵션
     * @returns 응답 객체
     */
    chat: (options: any) => Promise<any>;

    /**
     * 스트리밍 완성 요청
     * 
     * @param options - 요청 옵션
     * @returns 스트림 응답
     */
    stream: (options: any) => AsyncIterable<any>;

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