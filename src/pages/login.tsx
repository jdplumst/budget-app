import LoadingSpinner from "@/components/LoadingSpinner";
import { api } from "@/constants";
import Head from "next/head";
import Router from "next/router";
import React, { useState } from "react";
import { useMutation } from "react-query";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  const login = async () => {
    const response = await fetch(`${api}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    });
    if (!response.ok) {
      const error = await response.text();
      throw Error(error);
    }
    return;
  };

  const { mutate: loginMutation, isLoading } = useMutation(login, {
    onSuccess(data, variables, context) {
      Router.push("/projects");
    },
    onError(error, variables, context) {
      setError((error as Error).message);
      setDisabled(false);
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    loginMutation();
  };

  return (
    <>
      <Head>
        <title>Budget App - Login</title>
        <meta name="description" content="Budget App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-evenly">
        <form
          onSubmit={handleLogin}
          className="border-color flex h-1/3 w-1/2 flex-col border-2 p-10">
          <h3 className="pb-5 text-center text-3xl font-bold">Login</h3>
          <label className="text-xl font-bold">Username:</label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="border-color mb-5 block w-full rounded-lg border-2 border-solid bg-inherit p-2 focus:border-slate-500 focus:outline-none"
          />
          <label className="text-xl font-bold">Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border-color mb-5 block w-full rounded-lg border-2 border-solid bg-inherit p-2 focus:border-slate-500 focus:outline-none"
          />
          <button
            disabled={disabled}
            className="mx-auto w-1/4 rounded-lg bg-purple-500 p-4 text-xl font-bold text-white hover:cursor-pointer hover:bg-purple-600">
            {isLoading ? <LoadingSpinner /> : "Login"}
          </button>
          {error && (
            <div className="mx-auto mt-5 w-3/5 border-2 border-solid border-pink-400 bg-pink-300 p-2 text-center">
              {error}
            </div>
          )}
        </form>
      </main>
    </>
  );
}
