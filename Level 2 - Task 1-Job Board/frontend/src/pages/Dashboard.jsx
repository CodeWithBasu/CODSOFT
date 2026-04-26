import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Employer state
  const [showNewJob, setShowNewJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', type: 'Full-time', description: '' });

  useEffect(() => {
    if (!user) return;

    if (user.role === 'employer') {
      fetch(`http://localhost:5000/api/employers/${user.id}/applications`)
        .then(res => res.json())
        .then(resData => setData(resData))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      fetch(`http://localhost:5000/api/candidates/${user.id}/applications`)
        .then(res => res.json())
        .then(resData => setData(resData))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handlePostJob = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newJob, employerId: user.id })
    })
    .then(res => res.json())
    .then(() => {
      setShowNewJob(false);
      setNewJob({ title: '', company: '', location: '', type: 'Full-time', description: '' });
      alert('Job posted successfully!');
    })
    .catch(console.error);
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="title" style={{ margin: 0, fontSize: '2.2rem' }}>
          Welcome, {user.name}
        </h1>
        {user.role === 'employer' && (
          <button onClick={() => setShowNewJob(!showNewJob)}>
            {showNewJob ? 'Cancel' : 'Post New Job'}
          </button>
        )}
      </div>

      {user.role === 'employer' && showNewJob && (
        <div className="glass-panel" style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '24px' }}>Post a New Job</h2>
          <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label>Job Title</label>
                <input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              </div>
              <div>
                <label>Company</label>
                <input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
              </div>
              <div>
                <label>Location</label>
                <input required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              </div>
              <div>
                <label>Job Type</label>
                <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>
            <div>
              <label>Description</label>
              <textarea required rows="5" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
            </div>
            <button type="submit" style={{ alignSelf: 'flex-start' }}>Publish Job</button>
          </form>
        </div>
      )}

      <div className="glass-panel">
        <h2 style={{ marginBottom: '24px' }}>
          {user.role === 'employer' ? 'Applications Received' : 'Your Applications'}
        </h2>
        
        {loading ? <div className="loader"></div> : (
          data.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No applications found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data.map((item, i) => (
                <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{item.title}</h3>
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                      {item.status}
                    </span>
                  </div>
                  
                  {user.role === 'employer' ? (
                    <>
                      <p><strong>Candidate:</strong> {item.name} ({item.email})</p>
                      <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}><strong>Cover Letter:</strong><br/>{item.coverLetter}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Company:</strong> {item.company}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                        Applied on: {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
