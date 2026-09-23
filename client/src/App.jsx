import { useState, useEffect } from 'react';

function App() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ project_name: '', prompt_title: '', prompt_text: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchRecords = async () => {
    const res = await fetch('/api/capsules', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setRecords(data);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/capsules/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
    }
    setForm({ project_name: '', prompt_title: '', prompt_text: '' });
    setEditingId(null);
    fetchRecords();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await fetch(`/api/capsules/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchRecords();
  };

  const handleEdit = (record) => {
    setForm({ project_name: record.project_name, prompt_title: record.prompt_title, prompt_text: record.prompt_text });
    setEditingId(record.id);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>AI Capsule</h1>
      <div style={{ marginBottom: '20px' }}>
        <a href="/auth/github"><button>Login with GitHub</button></a>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>{editingId ? 'Edit Record' : 'Create Record'}</h3>
        <div style={{ marginBottom: '10px' }}>
          <input placeholder="Project Name" value={form.project_name} onChange={e => setForm({...form, project_name: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input placeholder="Prompt Title" value={form.prompt_title} onChange={e => setForm({...form, prompt_title: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea placeholder="Prompt Text" value={form.prompt_text} onChange={e => setForm({...form, prompt_text: e.target.value})} required style={{ width: '100%', padding: '8px', height: '80px' }} />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>{editingId ? 'Update' : 'Create'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm({ project_name: '', prompt_title: '', prompt_text: '' }); }} style={{ marginLeft: '10px', padding: '10px 20px' }}>Cancel</button>}
      </form>

      <h3>My Records</h3>
      {records.length === 0 ? <p>No records found. Login and create one!</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {records.map(record => (
            <li key={record.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
              <strong>{record.project_name}</strong> - {record.prompt_title}
              <p>{record.prompt_text}</p>
              <button onClick={() => handleEdit(record)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(record.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;