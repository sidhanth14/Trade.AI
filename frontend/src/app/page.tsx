'use client';
import Header from './components/Header';
import QueryForm from './components/QueryForm';

export default function HomePage() {
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
          padding: '2rem', // some breathing room
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
          Welcome to Trade.AI
        </h1>
        <QueryForm />
      </div>
    </div>
  );
}
