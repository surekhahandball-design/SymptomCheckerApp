import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-light">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-semibold mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded font-semibold hover:bg-blue-700 transition">
          Go Home
        </Link>
      </div>
    </main>
  )
}
