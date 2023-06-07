import Head from "next/head";
import Link from "next/link";

export default function Home() {
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
            // onClick={() => handleGuestLogin()}
            className="h-20 w-60 rounded-lg bg-slate-500 p-4 text-4xl font-bold text-white hover:cursor-pointer hover:bg-slate-600">
            Guest Login
          </button>
        </div>
      </main>
    </>
  );
}
