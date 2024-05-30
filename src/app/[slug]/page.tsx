"use client";

import { notFound, useRouter } from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  // TODO: Fetch url from database and redirect to it and if not found, show 404 page
  const router = useRouter(); // TODO: Fetch url from database and redirect to it and if not found, show 404 page

  fetch("/select-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shortUrl: params.slug }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data[0]);
      router.push(data[0].longUrl);
    })
    .catch((err) => {
      console.log(err);
    });

  return <div>Loading...</div>;
}
