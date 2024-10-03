"use server";
import getCollection from "@/db";
import { Profile } from "@/app/profile/page";

export const getUserProfile = async (sessionId: string) => {
  const userCollection = await getCollection("demo-user-collection");
  const userDoc = await userCollection.findOne({ sessionId });

  if (!userDoc) return null;
  const { name, email } = userDoc;

  if (!name || !email) return null;

  const profile: Profile = {
    name,
    email,
  };

  return profile;
};
