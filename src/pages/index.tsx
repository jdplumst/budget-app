import LoadingSpinner from "@/components/LoadingSpinner";
import { api } from "@/constants";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useMutation } from "react-query";
process.env;
export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  const guestLogin = async () => {
    const response = await fetch(`${api}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: process.env.NEXT_PUBLIC_GUEST_USERNAME,
        password: process.env.NEXT_PUBLIC_GUEST_PWORD
      }),
      credentials: "include"
    });
    if (!response.ok) {
      const error = await response.text();
      throw Error(error);
    }
    return;
  };

  const { mutate: guestMutation, isLoading } = useMutation(guestLogin, {
    onSuccess(data, variables, context) {
      Router.push("/projects");
    },
    onError(error, variables, context) {
      setError((error as Error).message);
      setDisabled(false);
    }
  });

  const handleGuestLogin = () => {
    setDisabled(true);
    guestMutation();
  };

  return (
    <>
      <Head>
        <title>Budget App</title>
        <meta name="description" content="Budget App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-evenly">
        <h1 className="text-8xl">Budget App</h1>
        <div className="flex justify-center gap-10">
          <Link href="/login">
            <button className="h-20 w-60 rounded-lg bg-purple-500 p-4 text-4xl font-bold text-white hover:cursor-pointer hover:bg-purple-600">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button className="h-20 w-60 rounded-lg bg-green-500 p-4 text-4xl font-bold text-white hover:cursor-pointer hover:bg-green-600">
              Sign Up
            </button>
          </Link>
          <button
            onClick={() => handleGuestLogin()}
            disabled={disabled}
            className="h-20 w-60 rounded-lg bg-slate-500 p-4 text-4xl font-bold text-white hover:cursor-pointer hover:bg-slate-600">
            {isLoading ? <LoadingSpinner /> : "Guest Login"}
          </button>
        </div>
        {error && (
          <div className="mx-auto w-3/5 border-2 border-solid border-pink-400 bg-pink-300 p-2 text-center">
            {error}
          </div>
        )}
      </main>
    </>
  );
}
