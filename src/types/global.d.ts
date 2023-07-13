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

  interface Expense {
    id: number;
    name: string;
    type: ExpenseType;
    amount: number;
    projectId: number;
  }
}
