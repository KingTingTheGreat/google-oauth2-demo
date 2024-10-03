import { getUserProfile } from "@/lib/getUserInfo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("google-oauth2-demo-sessionid");

  if (!cookie)
    return NextResponse.json({ message: "no sessionId" }, { status: 400 });

  const sessionId = cookie.value;

  const profile = await getUserProfile(sessionId);

  if (!profile)
    return NextResponse.json({ message: "invalid sessionId" }, { status: 401 });

  console.log("got profile", profile);

  return NextResponse.json({ profile }, { status: 200 });
}
