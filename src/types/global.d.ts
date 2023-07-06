export {};

declare global {
  interface User {
    username: string;
    role: Role;
  }

  interface Project {
    id?: number;
    name: string;
    budget: number;
    createDate?: string;
    modifyDate?: string;
  }

  enum Role {
    User = 0,
    Premium = 1
  }
}
