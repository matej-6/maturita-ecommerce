import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrentSessionState = {
  context: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    isEmailVerified: boolean;
    userId: string;
  } | null;
};

type CurrentSessionActions = {
  actions: {
    setContext: (context: CurrentSessionState["context"]) => void;
  };
};

export type CurrentSessionStore = CurrentSessionState & CurrentSessionActions;

const initialState: CurrentSessionState = {
  context: null,
};

export const useCurrentSessionStore = create<CurrentSessionStore>()(
  persist(
    (set) => ({
      ...initialState,
      actions: {
        setContext: (context) => set({ context }),
      },
    }),
    {
      name: "currentSession-storage",
    }
  )
);
