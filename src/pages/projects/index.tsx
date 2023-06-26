import LoadingSpinner from "@/components/LoadingSpinner";
import { api } from "@/constants";
import { useQuery } from "react-query";

interface Project {
  id: number;
  name: string;
}

export default function Projects() {
  const {
    isLoading,
    isError,
    data: projects
  } = useQuery<Project[]>("projects", async () => {
    const response = await fetch(`${api}/project`, { credentials: "include" });
    if (!response.ok) {
      throw Error("Network response was not ok");
    }
    return response.json();
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error!</div>;

  return (
    <div>
      {projects?.length! > 0 ? (
        projects!.map((p) => (
          <div key={2}>
            {p.id} {p.name}
          </div>
        ))
      ) : (
        <span>You currently have no projects!</span>
      )}
    </div>
  );
}
