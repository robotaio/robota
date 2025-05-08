'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 사이드바 항목 타입 정의
type SidebarItem = {
    title: string;
    slug: string;
    items?: SidebarItem[];
};

// 사이드바 항목 목록
const sidebarItems: SidebarItem[] = [
    { title: '홈', slug: '/' },
    { title: '시작하기', slug: '/docs/getting-started' },
    { title: '핵심 개념', slug: '/docs/core-concepts' },
    {
        title: 'API 참조',
        slug: '/docs/api-reference',
        items: [
            { title: 'Core', slug: '/docs/api-reference/core' },
            { title: 'OpenAI', slug: '/docs/api-reference/openai' },
            { title: 'Anthropic', slug: '/docs/api-reference/anthropic' },
            { title: 'LangChain', slug: '/docs/api-reference/langchain' },
            { title: 'Replicate', slug: '/docs/api-reference/replicate' },
            { title: 'Tools', slug: '/docs/api-reference/tools' }
        ]
    },
    {
        title: 'AI 제공자',
        slug: '/docs/providers',
        items: [
            { title: 'OpenAI', slug: '/docs/providers/openai' },
            { title: 'Anthropic', slug: '/docs/providers/anthropic' },
            { title: 'Replicate', slug: '/docs/providers/replicate' },
            { title: 'LangChain', slug: '/docs/providers/langchain' },
            { title: '커스텀 제공자', slug: '/docs/providers/custom' }
        ]
    },
    {
        title: '프로토콜',
        slug: '/docs/protocols',
        items: [
            { title: '모델 컨텍스트 프로토콜', slug: '/docs/protocols/model-context-protocol' },
            { title: 'MCP 제공자', slug: '/docs/protocols/mcp-provider' }
        ]
    },
    { title: '함수 호출', slug: '/docs/function-calling' },
    { title: '시스템 메시지', slug: '/docs/system-messages' },
    { title: '코드 개선사항', slug: '/docs/code-improvements' },
    { title: 'OpenAPI 통합', slug: '/docs/openapi-integration' }
];

// 사이드바 아이템 컴포넌트
const SidebarItem = ({ item, currentPath }: { item: SidebarItem; currentPath: string }) => {
    const isActive = currentPath === item.slug;
    const hasChildren = item.items && item.items.length > 0;
    const [isOpen, setIsOpen] = React.useState(
        hasChildren ? currentPath.startsWith(item.slug) : false
    );

    return (
        <li>
            <div className="flex items-center mb-2">
                {hasChildren && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mr-1 w-5 text-gray-500 hover:text-gray-700"
                        aria-label={isOpen ? '접기' : '펼치기'}
                    >
                        {isOpen ? '▼' : '▶'}
                    </button>
                )}
                <Link
                    href={item.slug}
                    className={`${isActive
                        ? 'font-semibold text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                        }`}
                >
                    {item.title}
                </Link>
            </div>

            {hasChildren && isOpen && (
                <ul className="pl-4 mb-2 border-l border-gray-200">
                    {item.items!.map((child) => (
                        <SidebarItem key={child.slug} item={child} currentPath={currentPath} />
                    ))}
                </ul>
            )}
        </li>
    );
};

// 사이드바 컴포넌트
export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 pr-8">
            <nav className="sticky top-8">
                <ul className="space-y-2">
                    {sidebarItems.map((item) => (
                        <SidebarItem key={item.slug} item={item} currentPath={pathname} />
                    ))}
                </ul>
            </nav>
        </div>
    );
} 