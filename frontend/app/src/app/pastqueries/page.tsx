'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';

interface Query {
  id: string;
  request_text: string;
  recommendation: string;
  timestamp: {
    seconds: number;
    nanoseconds?: number;
  } | null;
}

export default function PastQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must sign in to access past queries.');
      setLoading(false);
      return;
    }
    fetch('http://localhost:8000/queries/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch queries');
        }
        return res.json();
      })
      .then((data) => {
        setQueries(data.queries);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching queries.');
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f3f4f6', // Light neutral background
      }}
    >
      <Header />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <h1
          style={{
            marginBottom: '2rem',
            fontSize: '2rem',
            color: '#111',
            fontWeight: 600,
          }}
        >
          Your Past Queries
        </h1>
        {loading ? (
          <div>Loading past queries...</div>
        ) : error ? (
          <div>{error}</div>
        ) : queries.length === 0 ? (
          <p>No queries found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {queries.map((q) => (
              <li key={q.id} style={{ marginBottom: '1rem', background: '#fff', padding: '1rem', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
                <p>
                  <strong>Request:</strong> {q.request_text}
                </p>
                <p>
                  <strong>Recommendation:</strong> {q.recommendation}
                </p>
                <p>
                  <strong>Time:</strong>{' '}
                  {q.timestamp && q.timestamp.seconds
                    ? new Date(q.timestamp.seconds * 1000).toLocaleString()
                    : 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
