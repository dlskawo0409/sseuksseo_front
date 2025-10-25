interface GoogleIconProps {
  className?: string
}

export default function GoogleIcon({ className = '' }: GoogleIconProps) {
  // 단색 아이콘 (Tailwind currentColor 사용) — 버튼 텍스트와 잘 어울리게
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.35 11.1h-9.9v2.96h5.8c-.25 1.5-1.74 4.4-5.8 4.4-3.5 0-6.36-2.9-6.36-6.46s2.86-6.46 6.36-6.46c2 0 3.34.84 4.11 1.56L18 5.1C16.52 3.74 14.35 3 11.45 3 6.17 3 1.9 7.28 1.9 12.56S6.17 22.1 11.45 22.1c6.67 0 9.3-4.67 9.3-7.1 0-.48-.05-.79-.1-1.9z"/>
    </svg>
  )
}
