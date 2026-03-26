

// client/src/store/notificationStore.js

import { create } from "zustand";
import { nanoid } from "nanoid";

export const useNotificationStore = create((set) => ({
  notifications: [],

  notify: (msg, type = "info") =>
    set((s) => ({
      notifications: [
        ...s.notifications,
        { id: nanoid(), msg, type }
      ],
    })),

  remove: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
}));
