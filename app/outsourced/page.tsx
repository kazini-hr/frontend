"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OutsourcedPage() {
  const router = useRouter();

  fetch("https://api.kazinihr.co.ke/api/auth/me")
    .then((Response) => {
      return Response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  useEffect(() => {
    router.replace("/outsourced/dashboard");
  }, [router]);

  return null;
}
