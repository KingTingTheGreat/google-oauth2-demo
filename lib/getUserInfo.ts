"use server";
import getCollection from "@/db";
import { Profile } from "@/app/profile/page";

export const getUserProfile = async (sessionId: string) => {
  console.log("sessionId", sessionId);
  if (!sessionId) return null;

  const userCollection = await getCollection("demo-user-collection");
  const userDoc = await userCollection.findOne({ sessionId });

  if (!userDoc) return null;
  const { name, email } = userDoc;

  if (!name || !email) return null;

  const profile: Profile = {
    name,
    email,
  };

  console.log(profile);

  return profile;
};
