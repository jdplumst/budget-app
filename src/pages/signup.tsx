import LoadingSpinner from "@/components/LoadingSpinner";
import useSession from "@/hooks/useSession";
import useSignup from "@/hooks/useSignup";
import Head from "next/head";
import Router from "next/router";
import React, { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { user, userLoading } = useSession();
  if (user && !userLoading) {
    Router.push("/projects");
  }

  const {
    mutate: signupMutation,
    isLoading: signupLoading,
    error: signupError
  } = useSignup();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    signupMutation(
      { username, password },
      {
        onSuccess(data, variables, context) {
          Router.push("/projects");
        },
        onError(error, variables, context) {
          setDisabled(false);
        }
      }
    );
  };

  if (userLoading || user)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <Head>
        <title>Budget App - Signup</title>
        <meta name="description" content="Budget App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-evenly">
        <form
          onSubmit={handleSignup}
          className="border-color flex h-1/3 w-1/2 flex-col border-2 p-10">
          <h3 className="pb-5 text-center text-3xl font-bold">Sign Up</h3>
          <label className="text-xl font-bold">Username:</label>
          <input
            data-test="signup-username-input"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="border-color mb-5 block w-full rounded-lg border-2 border-solid bg-inherit p-2 focus:border-slate-500 focus:outline-none"
          />
          <label className="text-xl font-bold">Password:</label>
          <input
            data-test="signup-password-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border-color mb-5 block w-full rounded-lg border-2 border-solid bg-inherit p-2 focus:border-slate-500 focus:outline-none"
          />
          <button
            data-test="signup-button"
            disabled={disabled}
            className="mx-auto w-1/4 rounded-lg bg-green-500 p-4 text-xl font-bold text-white hover:cursor-pointer hover:bg-green-600">
            {signupLoading ? <LoadingSpinner /> : "Sign Up"}
          </button>
          {(signupError as Error) && (
            <div className="mx-auto mt-5 w-3/5 border-2 border-solid border-pink-400 bg-pink-300 p-2 text-center font-bold">
              {(signupError as Error).message}
            </div>
          )}
        </form>
      </main>
    </>
  );
}
