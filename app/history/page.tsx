import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.plan === "free") redirect("/");

  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Designs</h1>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to generator
          </Link>
        </div>

        {generations.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg mb-4">No designs yet</p>
            <Link href="/" className="text-indigo-400 hover:text-indigo-300">
              Create your first design →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((gen) => (
              <div key={gen.id} className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
                <img src={gen.outputUrl} alt={`${gen.style} ${gen.room}`} className="w-full aspect-[4/3] object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{gen.style}</span>
                    <span className="text-xs text-slate-500">{gen.room}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {new Date(gen.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
