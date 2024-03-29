import { ReactNode } from "react";

interface IModal {
  children: ReactNode;
}

export default function Modal({ children }: IModal) {
  return (
    <div className="absolute bottom-0 top-0 z-10 h-screen w-full bg-white/50">
      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-black p-4 text-white opacity-100">
        {children}
      </div>
    </div>
  );
}
