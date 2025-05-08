import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// frontmatter 타입 정의
interface Frontmatter {
    title?: string;
    description?: string;
    [key: string]: any;
}

// 루트 디렉토리에서 docs 폴더 경로
const docsDirectory = path.join(process.cwd(), '../../docs');

// 문서 디렉토리가 존재하는지 확인
if (!fs.existsSync(docsDirectory)) {
    console.error(`문서 디렉토리가 존재하지 않습니다: ${docsDirectory}`);
}

// 파일이 존재하는지 확인
function fileExists(filePath: string): boolean {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

// 디렉토리인지 확인
function isDirectory(dirPath: string): boolean {
    try {
        return fs.statSync(dirPath).isDirectory();
    } catch (err) {
        return false;
    }
}

// 경로 정규화: 중복 경로 제거 및 README 처리
function normalizePath(slug: string): string {
    // 모든 백슬래시를 슬래시로 변환
    let normalizedSlug = slug.replace(/\\/g, '/');

    // 중복 api-reference 패턴 제거
    if (normalizedSlug.includes('api-reference/api-reference')) {
        normalizedSlug = normalizedSlug.replace('api-reference/api-reference', 'api-reference');
    }

    return normalizedSlug;
}

// 주어진 슬러그에 대한 실제 파일 경로 찾기
function resolveFilePath(slug: string): string | null {
    // 슬러그 정규화
    const normalizedSlug = normalizePath(slug);

    // 1. 직접 .md 파일 시도
    const directPath = path.join(docsDirectory, `${normalizedSlug}.md`);
    if (fileExists(directPath)) {
        return directPath;
    }

    // 2. 디렉토리 내 README.md 파일 시도
    const readmePath = path.join(docsDirectory, normalizedSlug, 'README.md');
    if (fileExists(readmePath)) {
        return readmePath;
    }

    // 3. 슬러그가 'index'인 경우 루트의 README.md 시도
    if (normalizedSlug === 'index') {
        const rootReadmePath = path.join(docsDirectory, 'README.md');
        if (fileExists(rootReadmePath)) {
            return rootReadmePath;
        }
    }

    // 파일을 찾지 못한 경우
    return null;
}

// 모든 문서 슬러그 가져오기
export function getAllDocumentSlugs(): { slug: string }[] {
    const allSlugs: { slug: string }[] = [];

    // 디렉토리 재귀적으로 처리
    function processDirectory(dirPath: string, basePath: string = '') {
        if (!fs.existsSync(dirPath)) {
            return;
        }

        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        // README.md 파일을 확인하고 디렉토리 슬러그로 추가
        const hasReadme = entries.some(entry => !entry.isDirectory() && entry.name === 'README.md');
        if (hasReadme && basePath) {
            allSlugs.push({ slug: normalizePath(basePath) });
        }

        // 모든 항목 처리
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;

            if (entry.isDirectory()) {
                // 디렉토리 재귀적 처리
                processDirectory(fullPath, relativePath);
            } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
                // README.md가 아닌 마크다운 파일 추가
                const slug = relativePath.replace(/\.md$/, '');
                allSlugs.push({ slug: normalizePath(slug) });
            }
        }
    }

    processDirectory(docsDirectory);

    // 중복 api-reference 경로 추가 (명시적 처리)
    const apiRefSlugs = allSlugs
        .filter(({ slug }) => slug.startsWith('api-reference/'))
        .map(({ slug }) => ({
            slug: `api-reference/api-reference/${slug.substring('api-reference/'.length)}`
        }));

    return [...allSlugs, ...apiRefSlugs];
}

// HTML 특수 문자 이스케이프
function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 오류 발생 시 기본 문서 내용 생성
function createErrorContent(slug: string, error: unknown): { content: string } {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
        content: `
            <div class="markdown-content error-content">
                <h1>문서를 불러올 수 없습니다</h1>
                <p>요청한 페이지 <code>${escapeHtml(slug)}</code>에서 오류가 발생했습니다:</p>
                <pre>${escapeHtml(errorMessage)}</pre>
                <p><a href="/docs">문서 홈으로 돌아가기</a></p>
            </div>
        `
    };
}

// 특정 슬러그에 해당하는 문서 콘텐츠 가져오기
export async function getDocumentBySlug(slug: string) {
    try {
        // 파일 경로 해결
        const filePath = resolveFilePath(slug);

        if (!filePath) {
            throw new Error(`파일을 찾을 수 없습니다: ${slug}`);
        }

        // 파일 콘텐츠 읽기
        const fileContents = fs.readFileSync(filePath, 'utf8');

        // frontmatter와 콘텐츠 분리
        const { data, content } = matter(fileContents);
        const frontmatter = data as Frontmatter;

        // .md 확장자를 가진 링크 처리 (확장자 제거)
        const processedContent = content.replace(/\[([^\]]*)\]\(([^)]*?)\.md([^)]*)\)/g, '[$1]($2$3)');

        // MDX로 컴파일 - remark-gfm 3.0.1 버전 사용
        // 참고: package.json에 "remark-gfm": "3.0.1"로 명시되어 있어야 함
        const mdxSource = await compileMDX({
            source: processedContent,
            options: {
                mdxOptions: {
                    remarkPlugins: [
                        remarkGfm, // 3.0.1 버전이므로 inTable 오류 발생하지 않음
                    ],
                    rehypePlugins: [
                        rehypeSlug,
                        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                    ],
                    format: 'mdx',
                },
                parseFrontmatter: true,
            },
        });

        return {
            frontmatter,
            content: mdxSource.content,
            slug,
        };
    } catch (error) {
        console.error(`파일 처리 오류 (${slug}):`, error);
        throw error; // 오류를 상위로 전달하여 notFound() 처리
    }
}

// 마크다운에 테이블이 있는지 확인 (개선된 버전)
function hasMarkdownTable(markdown: string): boolean {
    const lines = markdown.split('\n');

    // 테이블 시작 및 구분자 행 패턴
    const tableLineRegex = /^\s*\|.*\|\s*$/;
    const tableDividerRegex = /^\s*\|[\s\-:|]+\|\s*$/;

    for (let i = 0; i < lines.length - 1; i++) {
        // 헤더 행 감지
        if (tableLineRegex.test(lines[i])) {
            // 구분자 행 감지
            if (i + 1 < lines.length && tableDividerRegex.test(lines[i + 1])) {
                return true;
            }
        }
    }

    return false;
}

// 마크다운 문서에서 테이블만 HTML로 변환하는 새로운 함수
function convertToHTMLTables(markdown: string): string {
    const lines = markdown.split('\n');
    const result: string[] = [];

    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();
        const isTableLine = line.startsWith('|') && line.endsWith('|');

        // 테이블 시작 감지
        if (isTableLine && i + 1 < lines.length &&
            lines[i + 1].trim().startsWith('|') &&
            lines[i + 1].trim().endsWith('|') &&
            lines[i + 1].includes('-')) {

            // 테이블 행 수집
            const tableLines: string[] = [lines[i]];
            i++;
            tableLines.push(lines[i]); // 구분자 행 추가

            // 테이블 내용 행 수집
            i++;
            while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
                tableLines.push(lines[i]);
                i++;
            }

            // 테이블을 HTML로 변환
            result.push(renderHTMLTable(tableLines));
            continue; // 이미 i가 증가되었으므로 계속 진행
        }

        // 테이블이 아닌 일반 텍스트
        result.push(lines[i]);
        i++;
    }

    return result.join('\n');
}

// 마크다운 테이블을 HTML로 렌더링
function renderHTMLTable(tableLines: string[]): string {
    if (tableLines.length < 2) return tableLines.join('\n');

    let html = '<table class="markdown-table">\n';

    // 헤더 처리
    const headerCells = tableLines[0].split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '');

    html += '  <thead>\n    <tr>\n';
    for (const cell of headerCells) {
        html += `      <th>${cell}</th>\n`;
    }
    html += '    </tr>\n  </thead>\n';

    // 본문 처리 (구분자 행은 건너뛰기)
    if (tableLines.length > 2) {
        html += '  <tbody>\n';
        for (let i = 2; i < tableLines.length; i++) {
            const rowCells = tableLines[i].split('|')
                .map(cell => cell.trim())
                .filter(cell => cell !== '');

            html += '    <tr>\n';
            for (const cell of rowCells) {
                html += `      <td>${cell}</td>\n`;
            }
            html += '    </tr>\n';
        }
        html += '  </tbody>\n';
    }

    html += '</table>';
    return html;
}

// 기본 HTML 생성
function createBasicHtml(markdown: string): string {
    return `
        <div class="markdown-content">
            ${processBasicMarkdown(markdown)}
        </div>
    `;
}

// 기본 마크다운을 HTML로 변환
function processBasicMarkdown(markdown: string): string {
    const processedMarkdown = markdown.replace(/\[([^\]]*)\]\(([^)]*?)\.md([^)]*)\)/g, '[$1]($2$3)');

    let html = processedMarkdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>')
        .replace(/`([^`]*)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/^\s*?\n/gm, '<br />');

    // 줄바꿈 처리 개선
    // 빈 줄은 단락 구분으로 처리
    html = html.replace(/\n\s*\n/g, '</p><p>');

    // 일반 줄바꿈은 <br> 태그로 변환
    html = html.replace(/\n/g, '<br />');

    // 단락으로 감싸기
    html = '<p>' + html + '</p>';

    // 중복 단락 태그 처리
    html = html.replace(/<p><\/p>/g, '');

    // 테이블이 있는 경우 HTML 테이블로 변환
    if (hasMarkdownTable(markdown)) {
        html = convertToHTMLTables(html);
    }

    return html;
}

// 모든 문서 메타데이터 가져오기
export async function getAllDocuments() {
    const slugs = getAllDocumentSlugs();
    const documents = await Promise.all(
        slugs.map(async ({ slug }) => {
            try {
                const doc = await getDocumentBySlug(slug);
                return {
                    ...doc,
                    slug,
                };
            } catch (error) {
                console.error(`getAllDocuments - ${slug} 처리 오류:`, error);
                return {
                    frontmatter: {},
                    content: createErrorContent(slug, error),
                    slug,
                };
            }
        })
    );

    return documents;
} 