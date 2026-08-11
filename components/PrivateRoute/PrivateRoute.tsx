"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/authStore";
import { fetchCurrentUser } from "@/lib/api";
import Loader from "@/components/Loader";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    data: user,
    isPending,
    isError,
  } = useQuery<{ name: string; email: string }>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUser(null as any);
      router.push("/login");
    } else if (user) {
      setUser(user);
    }
  }, [isError, user, router, setUser]);

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return null;
  }

  return <>{children}</>;
}
