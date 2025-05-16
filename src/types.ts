// Room state types for the hotel manager app

export type RoomStatus = "available" | "occupied" | "maintenance";

export interface OccupantData {
  name: string;
  aadhar: string;
  occupants: number;
  address: string;
}

export interface RoomHistoryEntry {
  timestamp: number;
  status: RoomStatus;
  action: string;
  occupantData?: OccupantData;
}

export interface Room {
  id: number;
  status: RoomStatus;
  history: RoomHistoryEntry[];
}
