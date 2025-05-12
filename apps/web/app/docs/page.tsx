import { getDocumentBySlug } from '../../lib/mdx';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Robota 문서',
    description: 'Robota 문서 및 API 참조',
};

export default async function DocsPage() {
    // README.md를 index로 사용
    const doc = await getDocumentBySlug('index');

    return (
        <article>
            {/* @ts-ignore */}
            {doc.content.content}
        </article>
    );
} 