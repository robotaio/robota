import fs from 'fs'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'

// docs 디렉토리에서 README.md 파일을 가져옴
export async function getStaticProps() {
    const filePath = path.join(process.cwd(), '../docs/README.md')
    const source = fs.readFileSync(filePath, 'utf8')
    const mdxSource = await serialize(source)

    return {
        props: {
            source: mdxSource
        }
    }
}

export default function DocsPage({ source }) {
    return (
        <div>
            <MDXRemote {...source} />
        </div>
    )
} 