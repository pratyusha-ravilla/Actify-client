

// client/src/store/profileStore.js

import { create } from "zustand";

export const useProfileStore = create((set) => ({
  profile: { name: "", email: "", department: "CSE", designation: "" },
  setProfile: (p) => set({ profile: p }),
}));
