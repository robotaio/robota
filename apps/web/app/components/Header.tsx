'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    Robota
                </Link>

                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link
                                href="/docs"
                                className={`${pathname.startsWith('/docs')
                                        ? 'font-semibold text-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                    }`}
                            >
                                문서
                            </Link>
                        </li>
                        <li>
                            <a
                                href="https://github.com/jungyoun/robota"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                GitHub
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
} 