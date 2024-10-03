"use client";
import { generateCSRFToken, storeCSRFToken } from "@/hooks/csrfToken";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSubmit = async () => {
    const csrfToken = generateCSRFToken();
    storeCSRFToken(csrfToken);
    router.push("/api/google-login?csrfToken=" + csrfToken);
  };

  return (
    <div>
      <button onClick={handleSubmit}>Sign In</button>
    </div>
  );
}
