import React from 'react';
import { Room, RoomStatus } from './types';

interface RoomGridProps {
  rooms: Room[];
  onChangeStatus: (id: number, status: RoomStatus, action: string) => void;
}

const statusColors: Record<RoomStatus, string> = {
  available: '#4caf50',
  occupied: '#f44336',
  maintenance: '#ff9800',
};

export const RoomGrid: React.FC<RoomGridProps> = ({ rooms, onChangeStatus }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
      gap: 8,
      maxWidth: 900,
      margin: '0 auto',
    }}>
      {rooms.map((room) => (
        <div key={room.id} style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 8,
          background: statusColors[room.status],
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>Room {room.id + 1}</div>
          <div style={{ margin: '8px 0' }}>{room.status}</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              disabled={room.status === 'occupied'}
              onClick={() => onChangeStatus(room.id, 'occupied', 'Occupied')}
            >
              Occupy
            </button>
            <button
              disabled={room.status === 'available'}
              onClick={() => onChangeStatus(room.id, 'available', 'Released')}
            >
              Release
            </button>
            <button
              disabled={room.status === 'maintenance'}
              onClick={() => onChangeStatus(room.id, 'maintenance', 'Set to Maintenance')}
            >
              Maintenance
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
