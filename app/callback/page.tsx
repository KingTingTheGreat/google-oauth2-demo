"use client";

import { clearCSRFToken, getCSRFToken } from "@/hooks/csrfToken";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function Callback() {
  // const [failed, setFailed] = useState(false); // use for displaying errors; not implemented here
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    // setFailed(true);
    router.push("/");
  }

  useEffect(() => {
    const localState = getCSRFToken();
    if (!localState || localState !== state) {
      clearCSRFToken();
      // setFailed(true);
      router.push("/");
    }

    const getSessionId = async () => {
      try {
        const res = await fetch("/api/google-login", {
          method: "POST",
          body: JSON.stringify({ code }),
        });
        const data = await res.json();

        if (res.status !== 200) {
          router.push("/");
        }

        console.log(data);
      } catch {
        router.push("/");
      }
    };
    getSessionId();
  });

  return (
    <div>
      {code && state ? (
        <div>
          <h2>Successfully Authenticated</h2>
          <Link href="/profile">go to profile</Link>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

export default function CallbackPage() {
  <Suspense fallback={<div>loading...</div>}>
    <Callback />
  </Suspense>;
}
