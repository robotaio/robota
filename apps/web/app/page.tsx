import React from 'react';
import Link from 'next/link';
import Header from './components/Header';

export default function HomePage() {
    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6">Robota</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        쉽게 Agentic AI를 만들 수 있는 JavaScript 라이브러리
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/docs/getting-started"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            시작하기
                        </Link>
                        <a
                            href="https://github.com/jungyoun/robota"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            GitHub
                        </a>
                    </div>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3">간단한 API</h2>
                        <p className="text-gray-600">
                            단순하고 강력한 API로 Agentic AI 애플리케이션을 쉽게 구축하세요.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3">유연한 통합</h2>
                        <p className="text-gray-600">
                            다양한 LLM 제공 업체와 쉽게 통합하여 사용할 수 있습니다.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3">타입스크립트 지원</h2>
                        <p className="text-gray-600">
                            타입스크립트로 작성되어 안정적이고 유지보수 가능한 코드를 작성할 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
} 