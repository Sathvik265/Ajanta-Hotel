import { useEffect, useState } from 'react';
import './App.css';
import type { Room, RoomStatus } from './types';
import { saveRoomsToStorage, loadRoomsFromStorage } from './utils';

const MAX_ROOMS = 300;

function getInitialRooms(): Room[] {
  const loaded = loadRoomsFromStorage();
  if (loaded.length > 0) return loaded;
  return Array.from({ length: MAX_ROOMS }, (_, i) => ({
    id: i,
    status: 'available' as RoomStatus,
    history: [
      {
        timestamp: Date.now(),
        status: 'available',
        action: 'Initialized',
      },
    ],
  }));
}

function App() {
  const [rooms, setRooms] = useState<Room[]>(getInitialRooms());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [occupantForm, setOccupantForm] = useState<null | {
    name: string;
    aadhar: string;
    occupants: string;
    address: string;
  }>(null);
  const [occupantRoomId, setOccupantRoomId] = useState<number | null>(null);

  useEffect(() => {
    saveRoomsToStorage(rooms);
  }, [rooms]);

  const handleChangeStatus = (id: number, status: RoomStatus, action: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === id && room.status !== status
          ? {
              ...room,
              status,
              history: [
                {
                  timestamp: Date.now(),
                  status,
                  action,
                },
                ...room.history,
              ],
            }
          : room
      )
    );
  };

  const handleOccupyClick = (room: Room) => {
    setOccupantRoomId(room.id);
    setOccupantForm({ name: '', aadhar: '', occupants: '', address: '' });
  };

  const handleOccupantFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (occupantRoomId === null || !occupantForm) return;
    setRooms((prev) =>
      prev.map((room) =>
        room.id === occupantRoomId && room.status !== 'occupied'
          ? {
              ...room,
              status: 'occupied',
              history: [
                {
                  timestamp: Date.now(),
                  status: 'occupied',
                  action: 'Occupied',
                  occupantData: {
                    name: occupantForm.name,
                    aadhar: occupantForm.aadhar,
                    occupants: Number(occupantForm.occupants),
                    address: occupantForm.address,
                  },
                },
                ...room.history,
              ],
            }
          : room
      )
    );
    setOccupantForm(null);
    setOccupantRoomId(null);
    setSelectedRoom(null);
  };

  // Keyboard shortcuts for room actions
  useEffect(() => {
    if (!selectedRoom || occupantForm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'o' || e.key === 'O') {
        if (selectedRoom.status !== 'occupied') {
          handleOccupyClick(selectedRoom);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (selectedRoom.status !== 'available') {
          handleChangeStatus(selectedRoom.id, 'available', 'Released');
        }
      } else if (e.key === 'm' || e.key === 'M') {
        if (selectedRoom.status !== 'maintenance') {
          handleChangeStatus(selectedRoom.id, 'maintenance', 'Set to Maintenance');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRoom, occupantForm]);

  // Keyboard shortcuts for occupant form modal
  useEffect(() => {
    if (!occupantForm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // Save
        (document.activeElement as HTMLElement)?.blur();
        const form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      } else if (e.key === 'Escape') {
        // Cancel
        setOccupantForm(null);
        setOccupantRoomId(null);
      } else if (e.key === 's' || e.key === 'S') {
        // Skip
        if (occupantRoomId === null) return;
        setRooms((prev) =>
          prev.map((room) =>
            room.id === occupantRoomId && room.status !== 'occupied'
              ? {
                  ...room,
                  status: 'occupied',
                  history: [
                    {
                      timestamp: Date.now(),
                      status: 'occupied',
                      action: 'Occupied',
                    },
                    ...room.history,
                  ],
                }
              : room
          )
        );
        setOccupantForm(null);
        setOccupantRoomId(null);
        setSelectedRoom(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [occupantForm, occupantRoomId, setRooms, setOccupantForm, setOccupantRoomId, setSelectedRoom]);

  // Gather all history entries for all rooms
  const allHistory: Array<{roomId: number, entry: {timestamp: number, status: RoomStatus, action: string, occupantData?: {name: string, aadhar: string, occupants: number, address: string}}}>
    = rooms.flatMap(room => room.history.map(entry => ({ roomId: room.id, entry })));
  // Sort by timestamp descending
  allHistory.sort((a, b) => b.entry.timestamp - a.entry.timestamp);

  return (
    <div>
      <h1>Ajanta Hotel</h1>
      <p>Click a room to change its status. View all rooms' history below.</p>
      <button style={{marginBottom: 16}} onClick={() => setShowAllHistory(true)}>
        Show All Rooms' History
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
          gap: 8,
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {rooms.map((room) => {
          const statusColors: Record<RoomStatus, string> = {
            available: '#4caf50',
            occupied: '#f44336',
            maintenance: '#ff9800',
          };
          return (
            <div
              key={room.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 8,
                background: statusColors[room.status],
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedRoom(room)}
            >
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>Room {room.id + 1}</div>
              <div style={{ margin: '8px 0' }}>{room.status}</div>
            </div>
          );
        })}
      </div>
      {selectedRoom && !occupantForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedRoom(null)}
        >
          <div
            style={{
              background: '#fff',
              color: '#222',
              borderRadius: 12,
              padding: 24,
              minWidth: 320,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2>Room {selectedRoom.id + 1} Options</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                disabled={selectedRoom.status === 'occupied'}
                onClick={() => handleOccupyClick(selectedRoom)}
              >
                Occupy
              </button>
              <button
                disabled={selectedRoom.status === 'available'}
                onClick={() => handleChangeStatus(selectedRoom.id, 'available', 'Released')}
              >
                Release
              </button>
              <button
                disabled={selectedRoom.status === 'maintenance'}
                onClick={() => handleChangeStatus(selectedRoom.id, 'maintenance', 'Set to Maintenance')}
              >
                Maintenance
              </button>
            </div>
            <button onClick={() => setSelectedRoom(null)}>Close</button>
          </div>
        </div>
      )}
      {occupantForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            setOccupantForm(null);
            setOccupantRoomId(null);
          }}
        >
          <form
            style={{
              background: '#fff',
              color: '#222',
              borderRadius: 12,
              padding: 24,
              minWidth: 320,
              maxWidth: 400,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
            onClick={e => e.stopPropagation()}
            onSubmit={handleOccupantFormSubmit}
          >
            <h2>Occupant Details</h2>
            <input
              required
              placeholder="Name"
              value={occupantForm.name}
              onChange={e => setOccupantForm(f => f && { ...f, name: e.target.value })}
            />
            <input
              required
              placeholder="Aadhar Number"
              value={occupantForm.aadhar}
              onChange={e => setOccupantForm(f => f && { ...f, aadhar: e.target.value })}
            />
            <input
              required
              type="number"
              min={1}
              placeholder="Number of Occupants"
              value={occupantForm.occupants}
              onChange={e => setOccupantForm(f => f && { ...f, occupants: e.target.value })}
            />
            <input
              required
              placeholder="Address"
              value={occupantForm.address}
              onChange={e => setOccupantForm(f => f && { ...f, address: e.target.value })}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="submit">Save</button>
              <button type="button" onClick={() => { setOccupantForm(null); setOccupantRoomId(null); }}>Cancel</button>
              <button type="button" onClick={() => {
                // Occupy without occupant data
                if (occupantRoomId === null) return;
                setRooms((prev) =>
                  prev.map((room) =>
                    room.id === occupantRoomId && room.status !== 'occupied'
                      ? {
                          ...room,
                          status: 'occupied',
                          history: [
                            {
                              timestamp: Date.now(),
                              status: 'occupied',
                              action: 'Occupied',
                            },
                            ...room.history,
                          ],
                        }
                      : room
                  )
                );
                setOccupantForm(null);
                setOccupantRoomId(null);
                setSelectedRoom(null);
              }}>Skip</button>
            </div>
          </form>
        </div>
      )}
      {showAllHistory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowAllHistory(false)}
        >
          <div
            style={{
              background: '#fff',
              color: '#222',
              borderRadius: 12,
              padding: 24,
              minWidth: 600,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2>All Rooms' History</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Room</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Action</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Status</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Timestamp</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Occupant Name</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Aadhar</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}># Occupants</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Address</th>
                </tr>
              </thead>
              <tbody>
                {allHistory.map(({ roomId, entry }, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>Room {roomId + 1}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{entry.action}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{entry.status}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{new Date(entry.timestamp).toLocaleString()}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{entry.occupantData?.name || ''}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{entry.occupantData?.aadhar || ''}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{entry.occupantData?.occupants || ''}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{entry.occupantData?.address || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={{marginTop: 16}} onClick={() => setShowAllHistory(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
