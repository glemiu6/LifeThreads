import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id: string) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter((n: any) => n.id !== id));
    } catch (err) {
      alert("Erro ao atualizar");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter((n: any) => n.id !== id));
    } catch (err) {
      alert("Erro ao eliminar");
    }
  };

  if (loading) return <div className="p-8">A carregar...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notificações</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Não tens notificações novas.</p>
      ) : (
        <div className="grid gap-4">
          {notifications.map((n: any) => (
            <div key={n.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
              <div>
                <p className="text-gray-800">{n.content}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleRead(n.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Lido
                </button>
                <button 
                  onClick={() => handleDelete(n.id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200"
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
