'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setID] = useState('');

  // 取得資料庫中的使用者
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const { data } = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []); // 確保依賴陣列是空的，避免重複執行


  // 提交新增的使用者資料
  const handleSubmit = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    const { data } = await res.json();
    setUsers((prevState) => [...prevState, data]);
    setName('');
    setEmail('');
  };

  const handleDelete = async () => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const { message } = await res.json();
    console.log(message)
  }



  return (
    <div>
      <h1 style={{ background: "grey", marginTop: 10 }}>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.id} - {user.name} - {user.email}
          </li>
        ))}
      </ul>

      <h1 style={{ background: "grey", marginTop: 10 }}>Add New User</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" style={{ background: 'orange' }}>Add User</button>
      </form>

      <h1 style={{ background: "grey", marginTop: 10 }}>Delete User</h1>
      <form onSubmit={handleDelete} style={{ marginTop: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setID(e.target.value)}
        />
        <button type="submit" style={{ background: 'tomato' }}>Delete</button>
      </form>
    </div>
  );
}


