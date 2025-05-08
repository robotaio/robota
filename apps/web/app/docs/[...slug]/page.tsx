import { getDocumentBySlug, getAllDocumentSlugs } from '../../../lib/mdx';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface DocPageProps {
    params: {
        slug: string[];
    };
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
    try {
        const slug = params.slug.join('/');
        const doc = await getDocumentBySlug(slug);

        // 문서에 frontmatter title이 있으면 사용, 없으면 slug에서 파생
        const title = doc.frontmatter && 'title' in doc.frontmatter && doc.frontmatter.title
            ? doc.frontmatter.title
            : slug.split('/').pop()?.replace(/-/g, ' ') || 'Robota 문서';

        return {
            title: `${title} - Robota`,
            description: doc.frontmatter && 'description' in doc.frontmatter && doc.frontmatter.description || 'Robota 문서 및 API 참조',
        };
    } catch (error) {
        // 오류 발생 시 기본 메타데이터 사용
        console.error(`메타데이터 생성 중 오류 (${params.slug.join('/')}):`, error);
        return {
            title: 'Robota 문서',
            description: 'Robota 문서 및 API 참조',
        };
    }
}

// 정적 경로 생성
export async function generateStaticParams() {
    try {
        // 라이브러리에서 모든 유효한 슬러그 가져오기
        const slugs = getAllDocumentSlugs();

        // 슬러그를 경로 파라미터로 변환
        return slugs.map(({ slug }) => ({
            slug: slug.split('/').filter(Boolean), // 빈 문자열 제거
        }));
    } catch (error) {
        console.error('정적 경로 생성 중 오류:', error);
        return []; // 오류 발생 시 빈 배열 반환
    }
}

export default async function DocPage({ params }: DocPageProps) {
    try {
        // 슬러그 조합 및 정규화
        const slug = params.slug.join('/');
        console.log(`문서 요청: ${slug}`);

        // 문서 데이터 가져오기
        const doc = await getDocumentBySlug(slug);

        if (!doc) {
            console.error(`문서를 찾을 수 없음: ${slug}`);
            return notFound();
        }

        return (
            <article className="markdown-content">
                {/* 만약 frontmatter title이 있으면 표시 */}
                {doc.frontmatter && 'title' in doc.frontmatter && doc.frontmatter.title && (
                    <h1 className="text-3xl font-bold mb-6">{doc.frontmatter.title}</h1>
                )}

                {/* 문서 내용 표시 */}
                {doc.content}
            </article>
        );
    } catch (error) {
        console.error('DocPage 렌더링 중 오류:', error);

        // 개발 모드에서 오류 내용 표시
        if (process.env.NODE_ENV === 'development') {
            return (
                <div className="error-container">
                    <h1>문서 로딩 오류</h1>
                    <p>요청한 문서를 로드하는 중 오류가 발생했습니다:</p>
                    <pre>{error instanceof Error ? error.message : String(error)}</pre>
                </div>
            );
        }

        return notFound();
    }
} 