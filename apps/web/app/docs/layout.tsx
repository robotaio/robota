import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8 flex">
                <Sidebar />
                <div className="flex-1 min-w-0">
                    <div className="markdown-content">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
} 