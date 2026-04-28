import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Building } from 'lucide-react';

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => setFeaturedJobs(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '80px 0', position: 'relative' }}>
        <h1 className="title" style={{ fontSize: '4rem' }}>Find Your Next Dream Job</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Connect with top employers and discover opportunities that match your skills. Your future starts here.
        </p>
        <Link to="/jobs">
          <button style={{ fontSize: '1.2rem', padding: '16px 32px' }}>
            Explore Jobs <ArrowRight size={20} />
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '2rem' }}>Featured Opportunities</h2>
          <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="jobs-grid">
          {featuredJobs.map(job => (
            <div key={job.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge">{job.type}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
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
                <button style={{ width: '100%' }} className="secondary">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
