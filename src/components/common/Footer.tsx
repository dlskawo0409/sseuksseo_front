import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 flex items-center justify-between">
        <p className="text-sm text-gray-300">© {new Date().getFullYear()} Sseuksseo. All rights reserved.</p>
      </div>
    </footer>
  )
}
