"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  },[]);


  return (
        <title>hello Duan</title>
  )  
}
