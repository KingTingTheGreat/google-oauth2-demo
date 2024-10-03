"use client";
import { useState, useEffect } from "react";

export type Profile = {
  name: string;
  email: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch("/api/profile");
      if (res.status === 200) {
        const { profile } = await res.json();
        setProfile(profile);
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  return loading ? (
    <p>loading...</p>
  ) : !profile ? (
    <p>please sign in </p>
  ) : (
    <div>
      <h1>This is your profile</h1>
      <div>
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
      </div>
    </div>
  );
}
