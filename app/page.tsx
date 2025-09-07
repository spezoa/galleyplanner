export default function Page() {
  return (
    <main className="card">
      <h2 className="text-xl font-semibold mb-2">Welcome</h2>
      <p className="text-gray-700">
        This is a lean starter for a Paxia-style galley planning tool.
      </p>
      <ul className="list-disc pl-6 mt-4 text-gray-700">
        <li>Supabase for auth & database</li>
        <li>Prisma ORM + seed (A320 demo)</li>
        <li>Drag-and-drop galley grid</li>
        <li>PDF export stubs</li>
      </ul>
      <div className="mt-6">
        <a className="btn border-gray-300" href="/dashboard">Go to Dashboard</a>
      </div>
    </main>
  );
}
