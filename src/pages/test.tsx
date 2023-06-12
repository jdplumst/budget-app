import { useEffect, useState } from "react";
import { api } from "@/constants";

export default function Test() {
  const [x, setX] = useState("");

  useEffect(() => {
    console.log(api);
    const get = async () => {
      const response = await fetch(`${api}/test`);
      const data = await response.text();
      setX(data);
    };
    get();
  }, []);

  return (
    <main>
      <div>test</div>
      <div>{x}</div>
    </main>
  );
}
