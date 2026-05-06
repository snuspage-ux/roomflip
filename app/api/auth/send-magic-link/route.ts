import { NextResponse } from "next/server";
import { sendMagicLink } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const sent = await sendMagicLink(email);
    if (!sent) {
      return NextResponse.json({ error: "Failed to send email. Try again later." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
