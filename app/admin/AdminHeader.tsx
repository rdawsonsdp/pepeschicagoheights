import Link from 'next/link';

export default function AdminHeader() {
  return (
    <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <span className="font-bold tracking-tight">Admin Panel</span>
        <span className="text-gray-500">|</span>
        <Link href="/admin/menu-engineering" className="text-gray-300 hover:text-white transition-colors">
          Menu Engineering
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
        >
          Back to Site
        </Link>
      </div>
    </div>
  );
}
