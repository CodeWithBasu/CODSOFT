import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Building, MapPin, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login as a candidate to apply for jobs.");
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      alert("Only candidates can apply to jobs.");
      return;
    }

    fetch('http://localhost:5000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: job.id,
        candidateId: user.id,
        coverLetter: coverLetter
      })
    })
    .then(res => {
      if(res.ok) {
        setApplied(true);
        // Note: The backend handles "email notification" mocking via console log
      }
    })
    .catch(console.error);
  };

  if (loading) return <div className="loader"></div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div style={{ paddingBottom: '60px' }}>
      <Link to="/jobs" style={{ display: 'inline-block', marginBottom: '20px', color: 'var(--text-muted)' }}>
        ← Back to Jobs
      </Link>
      
      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 className="title" style={{ margin: 0, fontSize: '2.5rem' }}>{job.title}</h1>
            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', marginTop: '16px', fontSize: '1.1rem' }}>
              <span className="flex-center"><Building size={18} /> {job.company}</span>
              <span className="flex-center"><MapPin size={18} /> {job.location}</span>
              <span className="flex-center"><Briefcase size={18} /> {job.type}</span>
              <span className="flex-center"><Calendar size={18} /> {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <span className="badge" style={{ fontSize: '1rem', padding: '8px 16px' }}>{job.type}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div className="glass-panel">
          <h2 style={{ marginBottom: '16px', fontSize: '1.5rem', color: 'var(--primary)' }}>Job Description</h2>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
            {job.description}
          </div>
        </div>

        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Apply for this position</h3>
          {applied ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <CheckCircle size={48} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--accent)' }}>Application Sent!</h4>
              <p style={{ color: 'var(--text-muted)' }}>You will receive an email confirmation shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Cover Letter</label>
                <textarea 
                  rows="6" 
                  placeholder="Introduce yourself and explain why you're a great fit..." 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Resume</label>
                <input type="file" required style={{ padding: '8px' }} />
                <small style={{ color: 'var(--text-muted)', display: 'block', mt: '4px' }}>PDF, DOCX up to 5MB</small>
              </div>
              <button type="submit" style={{ marginTop: '8px' }}>Submit Application</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
