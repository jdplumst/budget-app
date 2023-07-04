import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import useSession from "@/hooks/useSession";
import Router from "next/router";
import { GrUpdate } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import Head from "next/head";
import Modal from "@/components/Modal";
import useGetProjects from "@/hooks/useGetProjects";
import useUpdateProject from "@/hooks/useUpdateProject";
import useDeleteProject from "@/hooks/useDeleteProject";

interface IUpdate {
  disabledIcon: boolean;
  disabledButton: boolean;
  modal: boolean;
  project: Project | null;
  error: string | null;
  name: string;
  budget: string;
}

interface IDelete {
  disabledIcon: boolean;
  disabledButton: boolean;
  modal: boolean;
  project: Project | null;
  error: string | null;
}

export default function Projects() {
  const [update, setUpdate] = useState<IUpdate>({
    disabledIcon: false,
    disabledButton: false,
    modal: false,
    project: null,
    error: null,
    name: "",
    budget: "0.00"
  });

  const [del, setDel] = useState<IDelete>({
    disabledIcon: false,
    disabledButton: false,
    modal: false,
    project: null,
    error: null
  });

  // Get user
  const { user, userLoading } = useSession();
  if (!user && !userLoading) {
    Router.push("/");
  }

  // Get projects
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
    refetch: refetchProjects
  } = useGetProjects(user);

  // Mutation to update project
  const { mutate: updateMutation, isLoading: updateLoading } =
    useUpdateProject();

  // Mutation to delete project
  const { mutate: deleteMutation, isLoading: deleteLoading } =
    useDeleteProject();

  // Update project
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdate({ ...update, disabledButton: true });
    updateMutation(
      {
        id: update.project?.id!,
        name: update.name,
        budget: Number(update.budget)
      },
      {
        onSuccess(data, variables, context) {
          setUpdate({
            disabledIcon: false,
            disabledButton: false,
            modal: false,
            project: null,
            error: null,
            name: "",
            budget: "0.00"
          });
          refetchProjects();
        },
        onError(error, variables, context) {
          setUpdate({
            ...update,
            disabledButton: false,
            error: (error as Error).message
          });
        }
      }
    );
  };

  // Delete project
  const handleDelete = () => {
    setDel({ ...del, disabledButton: true });
    deleteMutation(del.project!, {
      onSuccess(data, variables, context) {
        setDel({
          disabledIcon: false,
          disabledButton: false,
          modal: false,
          project: null,
          error: null
        });
        refetchProjects();
      },
      onError(error, variables, context) {
        setDel({
          ...update,
          disabledButton: false,
          error: (error as Error).message
        });
      }
    });
  };

  if (userLoading || projectsLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (projectsError) return <div>Error!</div>;

  return (
    <>
      <Head>
        <title>Budget App</title>
        <meta name="description" content="Budget App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div>
        {/* Update Modal */}
        {update.modal && (
          <Modal>
            <button
              onClick={() =>
                setUpdate({
                  ...update,
                  disabledIcon: false,
                  modal: false,
                  project: null,
                  error: null,
                  name: "",
                  budget: ""
                })
              }
              className="ml-auto flex">
              <MdOutlineCancel size={20} />
            </button>
            <form onSubmit={handleUpdate}>
              <div className="pb-5 text-center text-3xl font-bold">
                Update Project: {update.project?.name}
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
                  value={update.name}
                  placeholder="Project Name"
                  onChange={(e) =>
                    setUpdate({ ...update, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="budget"
                  className="pb-5 pt-1 text-center text-xl font-bold">
                  Budget:
                </label>
                <input
                  id="budget"
                  name="budget"
                  pattern="^\d+\.{0,1}\d{0,2}$"
                  className="w-full p-2 text-black"
                  value={update.budget}
                  placeholder="0.00"
                  onChange={(e) =>
                    setUpdate({
                      ...update,
                      budget: e.target.value
                    })
                  }
                />
              </div>
              <div className="flex justify-center">
                <button
                  disabled={update.disabledButton}
                  className="mt-5 w-40 rounded-lg border-2 border-black bg-blue-500 p-2 font-bold hover:bg-blue-600">
                  {updateLoading ? <LoadingSpinner /> : "Update Project"}
                </button>
              </div>
              {update.error && (
                <p className="pt-2 text-center font-bold text-red-500">
                  {update.error}
                </p>
              )}
            </form>
          </Modal>
        )}

        {/* Delete Modal */}
        {del.modal && (
          <Modal>
            <div className="text-center text-3xl font-bold">
              Delete Project: {del.project?.name}
            </div>
            <div className="pt-1 text-center text-xl">
              Are you sure you want to delete this project?
            </div>
            <div className="flex gap-5">
              <button
                onClick={() => handleDelete()}
                disabled={del.disabledButton}
                className="mt-5 w-40 rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
                {deleteLoading ? <LoadingSpinner /> : "Yes"}
              </button>
              <button
                onClick={() =>
                  setDel({
                    ...del,
                    disabledIcon: false,
                    modal: false,
                    project: null
                  })
                }
                disabled={del.disabledButton}
                className="mt-5 w-40 rounded-lg border-2 border-black bg-green-500 p-2 font-bold hover:bg-green-600">
                No
              </button>
            </div>
          </Modal>
        )}

        <Navbar username={user?.username!} />
        <div className="projects grid justify-center gap-5 pt-5">
          <div className="relative flex h-72 w-72 justify-center border-2 border-solid border-black text-center text-4xl font-bold">
            <div className="absolute top-10">Add A New Project</div>
            <button className="absolute bottom-10 w-40 rounded-lg border-2 border-black bg-blue-500 p-2 font-bold hover:bg-blue-600">
              Add
            </button>
          </div>
          {projects?.map((p) => (
            <div
              key={p.id}
              className="relative flex h-72 w-72 justify-center border-2 border-solid border-black text-center text-4xl font-bold">
              <button
                onClick={() =>
                  setUpdate({
                    ...update,
                    disabledIcon: true,
                    modal: true,
                    project: p,
                    name: p.name,
                    budget: p.budget.toString()
                  })
                }
                disabled={update.disabledIcon}
                className="absolute bottom-2 left-5">
                <GrUpdate size={20} />
              </button>
              <button
                onClick={() =>
                  setDel({
                    ...del,
                    disabledIcon: true,
                    modal: true,
                    project: p
                  })
                }
                className="absolute bottom-2 right-5">
                <AiFillDelete size={20} />
              </button>
              <div className="absolute top-10">{p.name}</div>
              <button className="absolute bottom-12 w-40 rounded-lg border-2 border-black bg-green-500 p-2 font-bold hover:bg-green-600">
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
