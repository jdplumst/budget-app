import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import useCreateExpense from "@/hooks/useCreateExpense";
import useGetExpenses from "@/hooks/useGetExpenses";
import useGetProject from "@/hooks/useGetProject";
import useSession from "@/hooks/useSession";
import { ExpenseType } from "@/types/enums";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

interface ICreate {
  disabledIcon: boolean;
  disabledButton: boolean;
  modal: boolean;
  error: string | null;
  name: string;
  nameLength: number;
  amount: string;
  type: ExpenseType;
}

export default function Project() {
  const router = useRouter();
  const id = router.query.id;

  const [expenseTotal, setExpenseTotal] = useState(177);
  const [create, setCreate] = useState<ICreate>({
    disabledIcon: false,
    disabledButton: false,
    modal: false,
    error: null,
    name: "",
    nameLength: 0,
    amount: "0",
    type: ExpenseType.Housing
  });

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

  // Mutation to create expense
  const { mutate: createMutation, isLoading: createLoading } =
    useCreateExpense();

  // Create project
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreate({ ...create, disabledButton: true });
    createMutation(
      {
        name: create.name,
        amount: Number(create.amount),
        type: create.type,
        projectId: Number(id)
      },
      {
        onSuccess(data, variables, context) {
          setCreate({
            disabledIcon: false,
            disabledButton: false,
            modal: false,
            error: null,
            name: "",
            nameLength: 0,
            amount: "0.00",
            type: ExpenseType.Housing
          });
          refetchExpenses();
        },
        onError(error, variables, context) {
          setCreate({
            ...create,
            disabledButton: false,
            error: (error as Error).message
          });
        }
      }
    );
  };

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
        {/* Create Modal */}
        {create.modal && (
          <Modal>
            <button
              onClick={() =>
                setCreate({
                  ...create,
                  disabledIcon: false,
                  modal: false,
                  error: null,
                  name: "",
                  nameLength: 0,
                  amount: "",
                  type: ExpenseType.Housing
                })
              }
              className="ml-auto flex">
              <MdOutlineCancel size={20} />
            </button>
            <form onSubmit={handleCreate}>
              <div className="pb-5 text-center text-3xl font-bold">
                Create Expense
              </div>
              <div className="pb-4">
                <label
                  htmlFor="name"
                  className="pb-5 pt-1 text-center text-xl font-bold">
                  Name:
                </label>
                <input
                  id="name"
                  name="name"
                  className="w-full p-2 text-black"
                  value={create.name}
                  placeholder="Expense Name"
                  onChange={(e) =>
                    setCreate({
                      ...create,
                      name: e.target.value,
                      nameLength: e.target.value.length
                    })
                  }
                />
                <div>{create.nameLength}/30</div>
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="pb-5 pt-1 text-center text-xl font-bold">
                  Budget:
                </label>
                <input
                  id="amount"
                  name="amount"
                  pattern="^\d+\.{0,1}\d{0,2}$"
                  className="w-full p-2 text-black"
                  value={create.amount}
                  placeholder="0.00"
                  onChange={(e) =>
                    setCreate({
                      ...create,
                      amount: e.target.value
                    })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="type" className="pt-5 text-xl font-bold">
                  Type:
                </label>
                <select
                  name="type"
                  id="type"
                  onChange={(e) =>
                    setCreate({ ...create, type: Number(e.target.value) })
                  }
                  className="text-black"
                  value={create.type}>
                  {Object.keys(ExpenseType)
                    .filter((key) => !isNaN(Number(key)))
                    .map((key) => (
                      <option key={key} value={key} className="text-black">
                        {ExpenseType[Number(key)]}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-center">
                <button
                  disabled={create.disabledButton}
                  className="mt-5 w-40 rounded-lg border-2 border-black bg-blue-500 p-2 font-bold hover:bg-blue-600">
                  {createLoading ? <LoadingSpinner /> : "Create Project"}
                </button>
              </div>
              {create.error && (
                <p className="pt-2 text-center font-bold text-red-500">
                  {create.error}
                </p>
              )}
            </form>
          </Modal>
        )}
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
          <button
            disabled={create.disabledIcon}
            onClick={() => {
              setCreate({ ...create, disabledIcon: true, modal: true });
              window.scrollTo(0, 0);
            }}
            className="rounded-lg border-2 border-black bg-blue-500 p-2 text-xl font-bold hover:bg-blue-600">
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
