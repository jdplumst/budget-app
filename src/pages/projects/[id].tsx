import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import useGetProject from "@/hooks/useGetProject";
import useSession from "@/hooks/useSession";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Project() {
  const router = useRouter();
  const id = router.query.id;

  const [expenseTotal, setExpenseTotal] = useState(177);

  // Get user
  const { user, userLoading } = useSession();
  if (!user && !userLoading) {
    router.push("/");
  }

  // Get project
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError
  } = useGetProject(user, id);

  if (userLoading || projectLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (projectError)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>{(projectError as Error).message}</p>
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
      <div>
        <Navbar username={user?.username!} />
        <main className="p-5">
          <h1 className="text-5xl font-bold">{project?.name}</h1>
          <div className="flex flex-col items-center justify-center py-10 text-xl font-bold">
            <div>
              You have spent ${expenseTotal} out of your ${project?.budget}{" "}
              budget
            </div>
            <meter
              className="h-6 w-4/5"
              max={project?.budget}
              optimum={project?.budget}
              value={expenseTotal}
              low={project?.budget! * 0.7}
              high={project?.budget! * 0.9}></meter>
          </div>
          <h3 className="pb-4 text-3xl font-bold">Expenses</h3>
          <button className="rounded-lg border-2 border-black bg-blue-500 p-2 text-xl font-bold hover:bg-blue-600">
            Add Expense
          </button>
        </main>
      </div>
    </>
  );
}
