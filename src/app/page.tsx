"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertUrls } from "@/db/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import supabase from "../db/supabase";
import { useEffect, useState } from "react";

const formSchema = z.object({
  longUrl: z.string().url(),
  shortUrl: z.string().max(7),
  uuid: z.string().uuid().optional(),
});

function UrlForm() {
  const [user, setUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      longUrl: "",
      shortUrl: "",
      uuid: user?.id,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      setUser(user.user);

      form.setValue("uuid", user.user?.id);
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
  }, [form]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);

    const url = insertUrls.parse({
      longUrl: values.longUrl,
      shortUrl: values.shortUrl,
      userId: values.uuid,
    });

    console.log(url);

    fetch("/generate-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(url),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.log(err);
        setIsGenerating(false);
      });
  }

  function copyToClipboard() {
    console.log("copy to clipboard");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="longUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Url</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                This is the long url that you want to shorten.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Url</FormLabel>

              <FormControl>
                <div className="flex flex-row gap-2 items-center">
                  <span>mini-url-nu.vercel.app/</span>
                  <Input
                    style={{ flex: 1 }}
                    placeholder="short-url"
                    {...field}
                  />
                  <Button type="button" onClick={copyToClipboard}>
                    Copy
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                This is the short url that you want to shorten.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isGenerating}>
          Generate Short Url
        </Button>
      </form>
    </Form>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Mini Url</h1>
      <UrlForm />
    </main>
  );
}
