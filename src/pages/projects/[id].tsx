import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import useGetExpenses from "@/hooks/useGetExpenses";
import useGetProject from "@/hooks/useGetProject";
import useSession from "@/hooks/useSession";
import { ExpenseType } from "@/types/enums";
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

  // Get expenses
  const {
    data: expenses,
    isLoading: expenseLoading,
    error: expenseError,
    refetch: refetchExpenses
  } = useGetExpenses(project);

  if (userLoading || projectLoading || expenseLoading)
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

  if (expenseError)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>{(expenseError as Error).message}</p>
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
          <ul className="flex flex-col items-center gap-5 pt-5">
            {expenses?.map((e) => (
              <li
                key={e.id}
                className="flex w-4/5 justify-between border-2 border-solid border-black p-4 text-2xl">
                <div className="flex flex-col justify-evenly">
                  <p>
                    <b>Name:</b> {e.name}
                  </p>
                  <p>
                    <b>Amount:</b> $
                    {e.amount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                  </p>
                  <p>
                    <b>Type:</b> {ExpenseType[e.type]}
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <button className="w-40 rounded-lg border-2 border-black bg-green-500 p-2 text-xl font-bold hover:bg-green-600">
                    Update
                  </button>
                  <button className="w-40 rounded-lg border-2 border-black bg-red-500 p-2 text-xl font-bold hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}
