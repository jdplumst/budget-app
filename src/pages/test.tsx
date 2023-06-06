import { useEffect, useState } from "react";
import { api } from "@/types/constants";

export default function Test() {
  const [x, setX] = useState("");

  useEffect(() => {
    console.log(api);
    const get = async () => {
      const response = await fetch(`${api}/test`);
      console.log(response);
      const data = await response.text();
      // console.log(data);
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
