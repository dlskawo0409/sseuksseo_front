export default function HowItWorksSection() {
  const steps = [
    ['로그인', 'Google로 안전하게 로그인합니다.', '🔐'],
    ['정보 저장', '자주 작성하는 필드를 "쓱써"에 한 번만 저장합니다.', '💾'],
    ['자동 채움', '크롬 확장에서 버튼 한 번으로 자동 입력!', '⚡'],
  ]

  return (
    <section id="how" className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-4xl font-bold text-center mb-4 text-brand-gray">어떻게 작동하나요?</h2>
        <p className="text-center text-gray-600 mb-12">간단한 3단계로 시작하세요</p>
        <ol className="grid md:grid-cols-3 gap-8">
          {steps.map(([title, desc, icon], i) => (
            <li key={i} className="card-3d group">
              <div className="glass rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <div className="text-sm text-purple-600 font-semibold mb-2">Step {i + 1}</div>
                <div className="text-xl font-bold text-gray-800 mb-3">{title}</div>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
