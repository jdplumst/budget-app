import LoadingSpinner from "@/components/LoadingSpinner";
import useLogin from "@/hooks/useLogin";
import useSession from "@/hooks/useSession";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState<null | "Guest" | "Premium">(
    null
  );

  const { user, userLoading } = useSession();
  if (user && !userLoading) {
    Router.push("/projects");
  }

  const { mutate: loginMutation, isLoading: loginLoading } = useLogin();

  if (userLoading || user)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

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
        <div className="grid grid-cols-2 gap-10">
          <Link href="/login">
            <button
              disabled={disabled}
              className="h-28 w-60 rounded-lg bg-purple-500 p-4 text-4xl font-bold text-white hover:cursor-pointer hover:bg-purple-600">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button
              disabled={disabled}
              className="h-28 w-60 rounded-lg bg-green-500 p-4 text-4xl font-bold text-white hover:cursor-pointer hover:bg-green-600">
              Sign Up
            </button>
          </Link>
          <button
            onClick={() => {
              setDisabled(true);
              setIsLoggingIn("Guest");
              loginMutation(
                {
                  username: process.env.NEXT_PUBLIC_GUEST_USERNAME as string,
                  password: process.env.NEXT_PUBLIC_GUEST_PWORD as string
                },
                {
                  onSuccess(data, variables, context) {
                    Router.push("/projects");
                  },
                  onError(error, variables, context) {
                    setDisabled(false);
                  }
                }
              );
            }}
            disabled={disabled}
            className="h-28 w-60 rounded-lg bg-blue-500 p-4 text-4xl font-bold text-white hover:cursor-pointer hover:bg-blue-600">
            {loginLoading && isLoggingIn === "Guest" ? (
              <LoadingSpinner />
            ) : (
              "Guest Login"
            )}
          </button>
          <button
            onClick={() => {
              setDisabled(true);
              setIsLoggingIn("Premium");
              loginMutation(
                {
                  username: process.env.NEXT_PUBLIC_PREMIUM_USERNAME as string,
                  password: process.env.NEXT_PUBLIC_PREMIUM_PWORD as string
                },
                {
                  onSuccess(data, variables, context) {
                    Router.push("/projects");
                  },
                  onError(error, variables, context) {
                    setDisabled(false);
                  }
                }
              );
            }}
            disabled={disabled}
            className="h-28 w-60 rounded-lg bg-orange-500 p-4 text-4xl font-bold text-white hover:cursor-pointer hover:bg-orange-600">
            {loginLoading && isLoggingIn === "Premium" ? (
              <LoadingSpinner />
            ) : (
              "Premium Login"
            )}
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
