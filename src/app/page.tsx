"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
  longUrl: z.string().url(),
  shortUrl: z.string().max(7)
});

function UrlForm() {
  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      longUrl: "",
      shortUrl: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                  <span>
                    mini-url-nu.vercel.app/
                  </span>
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
        <Button type="submit">Generate Short Url</Button>
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
