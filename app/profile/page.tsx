import { getUserProfile } from "@/lib/getUserInfo";
import { cookies } from "next/headers";

export type Profile = {
  name: string;
  email: string;
};

export default async function Profile() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("google-oauth2-demo-sessionid");
  console.log(sessionId);

  const profile = await getUserProfile(sessionId?.value as string);

  return profile ? (
    <div>
      <h1>This is your profile</h1>
      <div>
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
      </div>
    </div>
  ) : (
    <div>
      <h1>Please sign in </h1>
    </div>
  );
}
