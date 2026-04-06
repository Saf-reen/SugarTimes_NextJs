"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect /admin directly to /admin/login for a better user experience
    // instead of showing a 404 page.
    router.replace("/admin/login");
  }, [router]);

  return null;
}
