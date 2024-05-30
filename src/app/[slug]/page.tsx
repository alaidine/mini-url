"use client";

import { useRouter } from 'next/navigation';

function NotFound() {
  return (
    <div className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center h-screen w-screen bg-gray-50">
      Not Found
    </div>
  );
}

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
      return <NotFound />;
    });

  return (
    <div className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center h-screen w-screen bg-gray-50">
      Loading...
    </div>
  );
}
