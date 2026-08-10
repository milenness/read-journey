"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
export default function RecommendedPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    // logout(); // Очистити стор
    router.push("/login");
  };

  return (
   <> </>
  );
}
