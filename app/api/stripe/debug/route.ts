import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoToken = process.env.TURSO_AUTH_TOKEN;
    
    // Test basic Prisma connection
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      return Response.json({
        ok: true,
        hasTursoUrl: !!tursoUrl,
        hasTursoToken: !!tursoToken,
        dbTest: result,
      });
    } catch (dbError: any) {
      return Response.json({
        ok: false,
        step: "prisma_connect",
        hasTursoUrl: !!tursoUrl,
        tursoUrlPreview: tursoUrl?.substring(0, 30),
        hasTursoToken: !!tursoToken,
        message: dbError.message,
        code: dbError.code,
        stack: dbError.stack?.substring(0, 300),
      });
    }
  } catch (error: any) {
    return Response.json({
      ok: false,
      fatal: true,
      message: error.message,
      stack: error.stack?.substring(0, 300),
    });
  }
}
