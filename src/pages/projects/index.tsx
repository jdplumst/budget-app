import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import { api } from "@/constants";
import useSession from "@/hooks/useSession";
import Router from "next/router";
import { useMutation, useQuery } from "react-query";
import { GrUpdate } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import Head from "next/head";
import Modal from "@/components/Modal";

interface IUpdate {
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
    error: null
  });
  const [updateName, setUpdateName] = useState("");

  const { user, userLoading } = useSession();
  if (!user && !userLoading) {
    Router.push("/");
  }

  const {
    isLoading: projectsLoading,
    isError,
    data: projects,
    refetch: refetchProjects
  } = useQuery<Project[]>(
    "projects",
    async () => {
      const response = await fetch(`${api}/project`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw Error("Not authorized to fetch projects");
      }
      return response.json();
    },
    { enabled: !!user }
  );

  const updateProject = async (name: string) => {
    const response = await fetch(`${api}/project`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: update.project?.id, name: name }),
      credentials: "include"
    });
    if (!response.ok) {
      const error = await response.text();
      throw Error(error);
    }
    return;
  };

  const { mutate: updateMutation, isLoading: updateLoading } = useMutation(
    updateProject,
    {
      onSuccess(data, variables, context) {
        setUpdate({
          disabledIcon: false,
          disabledButton: false,
          modal: false,
          project: null,
          error: null
        });
        setUpdateName("");
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

  const handleUpdate = () => {
    setUpdate({ ...update, disabledButton: true });
    updateMutation(updateName);
  };

  if (userLoading || projectsLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  if (isError) return <div>Error!</div>;

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
                  project: null
                })
              }
              className="ml-auto flex">
              <MdOutlineCancel size={20} />
            </button>
            <div className="text-center text-3xl font-bold">
              Update Project: {update.project?.name}
            </div>
            <div className="pb-5 pt-1 text-center text-xl font-bold">
              Please enter a new project name.
            </div>
            <input
              className="w-full p-2 text-black"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />
            <button
              onClick={() => handleUpdate()}
              disabled={update.disabledButton}
              className="mt-5 w-40 rounded-lg border-2 border-black bg-blue-500 p-2 font-bold hover:bg-blue-600">
              {updateLoading ? <LoadingSpinner /> : "Update Project"}
            </button>
            {update.error && (
              <p className="font-bold text-red-500">{update.error}</p>
            )}
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
                    project: p
                  })
                }
                disabled={update.disabledIcon}
                className="absolute bottom-2 left-5">
                <GrUpdate size={20} />
              </button>
              <button className="absolute bottom-2 right-5">
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
