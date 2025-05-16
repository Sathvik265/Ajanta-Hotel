// Utility functions for local storage and offline support
import type { Room } from "./types";

const STORAGE_KEY = "hotel_manager_rooms_v1";

export function saveRoomsToStorage(rooms: Room[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

export function loadRoomsFromStorage(): Room[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Room[];
  } catch {
    return [];
  }
}
