"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/Loader";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.push("/recommended");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return <Loader />;
}
