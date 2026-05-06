import { prisma } from "./prisma";

export const CREDIT_PACKAGES = [
  { id: "starter", credits: 6, usd: 2.5, label: "Starter", description: "6 room redesigns — just $2.5" },
  { id: "popular", credits: 15, usd: 5, label: "Popular", description: "15 room redesigns — best value" },
] as const;

export function getCreditPackage(packageId: string) {
  return CREDIT_PACKAGES.find((p) => p.id === packageId);
}

export async function checkCredits(userId: string, amount: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  if (!user) return false;
  return user.credits >= amount;
}

export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  try {
    const result = await prisma.user.updateMany({
      where: { id: userId, credits: { gte: amount } },
      data: { credits: { decrement: amount } },
    });
    return result.count > 0;
  } catch {
    return false;
  }
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });
}
