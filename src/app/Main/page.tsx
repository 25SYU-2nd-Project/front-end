'use client'
import { useRouter } from 'next/navigation'

export default function MainPage() {
  const router = useRouter()

  return (
    <div>
      <h1>메인 페이지</h1>

      <button onClick={() => router.push('/team')}>
        팀 페이지로 이동
      </button>
    </div>
  )
}
