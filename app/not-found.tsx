import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-zinc-400 mb-8 max-w-md">The study material you're looking for seems to have vanished into the void.</p>
      <Link href="/" className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
        Return Home
      </Link>
    </div>
  );
}
