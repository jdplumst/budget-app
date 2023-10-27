import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import useSession from "@/hooks/useSession";
import Router from "next/router";
import { GrUpdate } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import React, { useState } from "react";
import Head from "next/head";
import Modal from "@/components/Modal";
import useGetProjects from "@/hooks/useGetProjects";
import useUpdateProject from "@/hooks/useUpdateProject";
import useDeleteProject from "@/hooks/useDeleteProject";
import useCreateProject from "@/hooks/useCreateProject";

interface ICreate {
  disabledIcon: boolean;
  disabledButton: boolean;
  modal: boolean;
  error: string | null;
  name: string;
  nameLength: number;
  budget: string;
}

interface IUpdate {
  disabledIcon: boolean;
  disabledButton: boolean;
  modal: boolean;
  project: Project | null;
  error: string | null;
  name: string;
  nameLength: number;
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
  const [create, setCreate] = useState<ICreate>({
    disabledIcon: false,
    disabledButton: false,
    modal: false,
    error: null,
    name: "",
    nameLength: 0,
    budget: "0.00"
  });

  const [update, setUpdate] = useState<IUpdate>({
    disabledIcon: false,
    disabledButton: false,
    modal: false,
    project: null,
    error: null,
    name: "",
    nameLength: 0,
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

  // Mutation to create project
  const { mutate: createMutation, isLoading: createLoading } =
    useCreateProject();

  // Mutation to update project
  const { mutate: updateMutation, isLoading: updateLoading } =
    useUpdateProject();

  // Mutation to delete project
  const { mutate: deleteMutation, isLoading: deleteLoading } =
    useDeleteProject();

  // Create project
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreate({ ...create, disabledButton: true });
    createMutation(
      {
        name: create.name,
        budget: Number(create.budget)
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
            budget: "0.00"
          });
          refetchProjects();
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
            nameLength: 0,
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
          ...del,
          disabledButton: false,
          error: (error as Error).message
        });
      }
    });
  };

  if (userLoading || projectsLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
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
        <link rel="icon" href="/favicon.ico" />
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
                  budget: ""
                })
              }
              className="ml-auto flex">
              <MdOutlineCancel size={20} />
            </button>
            <form onSubmit={handleCreate}>
              <div className="pb-5 text-center text-3xl font-bold">
                Create Project
              </div>
              <div className="pb-4">
                <label
                  htmlFor="name"
                  className="pb-5 pt-1 text-center text-xl font-bold">
                  Name:
                </label>
                <input
                  data-test="create-project-name-input"
                  id="name"
                  name="name"
                  className="w-full p-2 text-black"
                  value={create.name}
                  placeholder="Project Name"
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
                  htmlFor="budget"
                  className="pb-5 pt-1 text-center text-xl font-bold">
                  Budget:
                </label>
                <input
                  data-test="create-project-budget-input"
                  id="budget"
                  name="budget"
                  pattern="^\d+\.{0,1}\d{0,2}$"
                  className="w-full p-2 text-black"
                  value={create.budget}
                  placeholder="0.00"
                  onChange={(e) =>
                    setCreate({
                      ...create,
                      budget: e.target.value
                    })
                  }
                />
              </div>
              <div className="flex justify-center">
                <button
                  data-test="create-project-button"
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
                  nameLength: 0,
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
                  data-test="update-project-name-input"
                  id="name"
                  name="name"
                  className="w-full p-2 text-black"
                  value={update.name}
                  placeholder="Project Name"
                  onChange={(e) =>
                    setUpdate({
                      ...update,
                      name: e.target.value,
                      nameLength: e.target.value.length
                    })
                  }
                />
                <div>{update.nameLength}/30</div>
              </div>
              <div>
                <label
                  htmlFor="budget"
                  className="pb-5 pt-1 text-center text-xl font-bold">
                  Budget:
                </label>
                <input
                  data-test="update-project-budget-input"
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
                  data-test="update-project-button"
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
                data-test="delete-project-yes-button"
                onClick={() => handleDelete()}
                disabled={del.disabledButton}
                className="mt-5 w-40 rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
                {deleteLoading ? <LoadingSpinner /> : "Yes"}
              </button>
              <button
                data-test="delete-project-no-button"
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
        <main className="projects grid justify-center gap-5 pt-5">
          <div className="relative flex h-72 w-72 flex-col items-center justify-evenly border-2 border-solid border-black text-center text-4xl font-bold">
            <div>Add A New Project</div>
            <div></div>
            <button
              data-test="add-project-button"
              onClick={() =>
                setCreate({ ...create, disabledIcon: true, modal: true })
              }
              disabled={create.disabledIcon}
              className="w-40 rounded-lg border-2 border-black bg-blue-500 p-2 text-3xl font-bold hover:bg-blue-600">
              Add
            </button>
          </div>
          {projects?.map((p) => (
            <div
              key={p.id}
              className="relative flex h-72 w-72 flex-col items-center justify-evenly border-2 border-solid border-black text-center text-4xl font-bold">
              <button
                data-test={`update-project-icon-${p.id}`}
                onClick={() =>
                  setUpdate({
                    ...update,
                    disabledIcon: true,
                    modal: true,
                    project: p,
                    name: p.name,
                    nameLength: p.name.length,
                    budget: p.budget.toString()
                  })
                }
                disabled={update.disabledIcon}
                className="absolute bottom-2 left-5">
                <GrUpdate size={20} />
              </button>
              <button
                data-test={`delete-project-icon-${p.id}`}
                disabled={del.disabledIcon}
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
              <div className="h-10 w-64 truncate text-3xl">{p.name}</div>
              <div className="w-64 truncate text-3xl">
                ${p.budget.toFixed(2)}
              </div>
              <button
                data-test={`project-${p.id}`}
                onClick={() => Router.push(`/projects/${p.id}`)}
                className="w-40 rounded-lg border-2 border-black bg-green-500 p-2 text-3xl font-bold hover:bg-green-600">
                Select
              </button>
            </div>
          ))}
        </main>
      </div>
    </>
  );
}
