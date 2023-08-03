import Navbar from "@/components/Navbar";
import useSession from "@/hooks/useSession";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";

export default function Premium() {
  // Get user
  const { user, userLoading } = useSession();
  if (!user && !userLoading) {
    Router.push("/");
  }

  const [error, setError] = useState(true);

  return (
    <>
      <Head>
        <title>Budget App</title>
        <meta name="description" content="Budget App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar username={user?.username!} />
      <main className="flex w-screen flex-col items-center gap-10 pt-10">
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-6xl font-bold">Premium</h2>
          <span className="text-2xl font-medium">
            Get started with a plan to help track your budgets.
          </span>
        </div>
        <div className="flex min-w-[50%] max-w-[60%] flex-col gap-5 border-2 border-orange-500 bg-gradient-to-r from-orange-200 to-orange-300 p-10">
          <div className="text-3xl font-medium">Forever</div>
          <div>
            Our premium plan allows users to get access to a{" "}
            <b>all premium features</b>, including the chart displaying budget
            allocation for each project.
          </div>
          <div className="text-4xl font-semibold">$0</div>
          <button
            onClick={() => setError((p) => !p)}
            className="w-full rounded-lg border-2 border-black bg-black p-2 text-xl text-white hover:bg-stone-900">
            Subscribe
          </button>
          {error && <div className="font-medium text-red-500">Error!</div>}
        </div>
      </main>
    </>
  );
}
