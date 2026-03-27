import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
        <div className="grid gap-4">
          <Link
            href="/admin/menu-engineering"
            className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-pepe-orange hover:shadow-md transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Menu Engineering</h2>
            <p className="text-gray-500 text-sm">Edit menu items, pricing, classifications, and visibility</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
