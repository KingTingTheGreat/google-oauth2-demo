import getCollection from "@/db";
import { CSRF_TOKEN_LENGTH } from "@/hooks/csrfToken";
import { generateSessionId } from "@/lib/generateSessionId";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const csrfToken = req.nextUrl.searchParams.get("csrfToken");
  if (!csrfToken || csrfToken.length !== CSRF_TOKEN_LENGTH) {
    console.log("no csrf token");
    return NextResponse.redirect(new URL("/", req.url));
  }

  const queryParams = new URLSearchParams({
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    response_type: "code",
    access_type: "offline",
    state: csrfToken,
    redirect_uri: process.env.REDIRECT_URI as string,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
  });

  const redir = `https://accounts.google.com/o/oauth2/auth?${queryParams.toString()}`;
  console.log(redir);

  return NextResponse.redirect(redir);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code } = body;

  if (!code)
    return NextResponse.json(
      { message: "no authorization code provided" },
      { status: 400 },
    );

  const queryParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.REDIRECT_URI as string,
  });

  const codeRes = await fetch(
    `https://oauth2.googleapis.com/token?${queryParams.toString()}`,
    {
      method: "POST",
    },
  );

  const data = await codeRes.json();

  const { access_token, expires_in, refresh_token, id_token } = data;

  const userRes = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
  const userData = await userRes.json();
  const { name, email } = userData;

  console.log("userData", userData);

  if (!name || !email) {
    console.error(userData);
    return NextResponse.json(
      { message: "internal server error, user not found from google" },
      { status: 500 },
    );
  }

  const sessionId = generateSessionId();

  const newUserEntry = {
    sessionId,
    name,
    email,
    accessToken: access_token,
    expiresIn: expires_in,
    refreshToken: refresh_token,
    idToken: id_token,
    lastLogin: new Date().toISOString(),
  };

  const userCollection = await getCollection("demo-user-collection");
  const dbRes = await userCollection.updateOne(
    { email },
    { $set: newUserEntry },
    { upsert: true },
  );
  if (
    dbRes.acknowledged &&
    dbRes.modifiedCount === 0 &&
    dbRes.upsertedCount === 0
  ) {
    console.error(dbRes);
    return NextResponse.json(
      { message: "internal service error, error storing user in db" },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ message: "success" }, { status: 200 });
  res.cookies.set("google-oauth2-demo-sessionid", sessionId, {
    httpOnly: true, // prevents js access
    secure: (process.env.NODE_ENV as string) === "prod", // use secure cookies in production (must be sent over HTTPS)
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/", // available on all routes
  });
  return res;
}
