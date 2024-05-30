"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function EditUrlForm({ url }: { url: any }) {
  const [newRedirectUrl, setNewRedirectUrl] = useState(url.longUrl);
  const [newShortUrl, setNewShortUrl] = useState(url.shortUrl);

  function editUrl(shortUrl: string, redirectUrl: string) {
    fetch("/edit-url", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortUrl, redirectUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit your redirection</SheetTitle>
          <SheetDescription>
            Make changes to your redirection here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longUrl" className="text-right">
              Long Url
            </Label>
            <Input
              id="longUrl"
              value={newRedirectUrl}
              className="col-span-3"
              onChangeCapture={(e) => setNewRedirectUrl(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Label htmlFor="redirectUrl" className="text-right">
              Redirect Url mini-url-nu.vercel.app/
            </Label>
            <Input
              style={{ flex: 1 }}
              id="redirectUrl"
              value={newShortUrl}
              className="col-span-3"
              onChangeCapture={(e) => setNewShortUrl(e.currentTarget.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={() => editUrl(newShortUrl, newRedirectUrl)}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

import { useEffect, useState } from "react";
import supabase from "../../db/supabase";

function Row({ url }: { url: any }) {
  const [newRedirectUrl, setNewRedirectUrl] = useState("");

  function copyToClipboard() {
    navigator.clipboard.writeText(url.longUrl);
  }

  function editUrl(shortUrl: string) {
    fetch("/edit-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function deleteUrl(shortUrl: string) {
    fetch("/delete-url", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortUrl }),
    });
  }
  return (
    <div className="flex flex-row gap-2 items-center">
      <span>{url.longUrl}</span>
      <span>{url.shortUrl}</span>
      <Button variant="ghost" onClick={() => deleteUrl(url.shortUrl)}>
        Delete
      </Button>
      <Button variant="ghost" onClick={() => copyToClipboard()}>
        Copy
      </Button>
      <EditUrlForm url={url} />
    </div>
  );
}

export default function MyUrls() {
  const [user, setUser] = useState<any>(null);
  const [urls, setUrls] = useState<any>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      setUser(user.user);
    };

    // Fetch the user data when the component mounts
    fetchUser();

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Re-fetch the user data whenever the auth state changes
        fetchUser();
      }
    );

    // Cleanup the listener when the component is unmounted
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetch("/get-user-urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user?.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUrls(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>My Urls</h1>
      {urls.map((url: (typeof urls)[0]) => (
        <Row key={url.shortUrl} url={url} />
      ))}
    </main>
  );
}
