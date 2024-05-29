"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import supabase from "../db/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

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

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-base-100 p-4 border-b border-base-200">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center">
          <Image
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
            width={250}
            height={250}
          />
        </div>
        <div className="hidden md:flex space-x-4">
          <a
            href="/"
            className="px-3 py-2 text-sm font-medium text-base-content/70 hover:text-base-content/80 hover:underline"
          >
            Home
          </a>
          <a
            href="#"
            className="px-3 py-2 text-sm font-medium text-base-content/70 hover:text-base-content/80 hover:underline"
          >
            About
          </a>
          <a
            href="#"
            className="px-3 py-2 text-sm font-medium text-base-content/70 hover:text-base-content/80 hover:underline"
          >
            Pricing
          </a>
          <a
            href="#"
            className="px-3 py-2 text-sm font-medium text-base-content/70 hover:text-base-content/80 hover:underline"
          >
            Contact
          </a>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-end">
        {user ? (
          <div className="flex space-x-4">
            <a
              href="/my-urls"
              className="px-3 py-2 text-sm font-medium text-base-content/70 hover:text-base-content/80 hover:underline"
            >
              My-urls
            </a>
            <a
              onClick={() => signOut()}
              className="px-3 py-2 text-sm font-medium text-base-content/70 hover:text-base-content/80 hover:underline"
            >
              Logout
            </a>
          </div>
        ) : (
          <div className="flex space-x-4">
            <a
              href="/auth"
              className="px-3 py-2 text-sm font-medium text-base-content/70 hover:text-base-content/80 hover:underline"
            >
              Login
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
