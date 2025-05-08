import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        // docs/README.md로 리다이렉트
        router.replace('/docs')
    }, [])

    return null
} 