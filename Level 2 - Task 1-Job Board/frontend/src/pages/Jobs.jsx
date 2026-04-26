import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building, MapPin } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = (query) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/jobs?search=${query}`)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs(search);
    }, 300); // 300ms delay for auto-search
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  return (
    <div>
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
        <h1 className="title" style={{ fontSize: '2rem', marginBottom: '24px' }}>Search Jobs</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
            <input 
              type="text" 
              placeholder="Job title, company, or keywords..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '48px' }}
            />
          </div>
          <button type="submit">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Showing {jobs.length} jobs</p>
          <div className="jobs-grid" style={{ marginTop: 0 }}>
            {jobs.map(job => (
              <div key={job.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge">{job.type}</span>
                </div>
                <h3 style={{ fontSize: '1.4rem' }}>{job.title}</h3>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building size={16} /> {job.company}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={16} /> {job.location}
                  </div>
                </div>
                <Link to={`/jobs/${job.id}`} style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  <button style={{ width: '100%' }} className="secondary">Apply Now</button>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
