import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('email', email);

    const response = await fetch('https://api.check-mail.org/v2/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to check email: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[check-email] API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
