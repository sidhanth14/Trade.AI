// 'use client';
// import { useState } from 'react';

// export default function QueryForm() {
//   const [inputText, setInputText] = useState('');
//   const [response, setResponse] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:8000/api/ai', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: inputText }),
//       });
//       const data = await res.json();
//       setResponse(data.response || 'No response from server');
//     } catch (error) {
//       console.error('Error:', error);
//       setResponse('Error calling the backend');
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: '#ffffff',
//         padding: '1.5rem',
//         borderRadius: '6px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//       }}
//     >
//       <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="What problem can we solve for you?"
//           style={{
//             width: '300px',
//             padding: '0.5rem',
//             marginRight: '0.75rem',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//           }}
//         />
//         <button
//           type="submit"
//           style={{
//             border: '1px solid #000',
//             backgroundColor: '#666', // A sleeker gray
//             color: '#fff',
//             padding: '0.5rem 1rem',
//             cursor: 'pointer',
//             borderRadius: '4px',
//             transition: 'background-color 0.3s ease',
//           }}
//           onMouseEnter={(e) => {
//             (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#444';
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#666';
//           }}
//         >
//           Submit
//         </button>
//       </form>
//       {response && (
//         <p style={{ margin: 0, color: '#333' }}>
//           Response: {response}
//         </p>
//       )}
//     </div>
//   );
// }
'use client';
import { useState } from 'react';

export default function QueryForm() {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve token from localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      setResponse('Please sign in to use this feature.');
      return;
    }

    try {
      const res = await fetch('https://tradeai-backend-920966971294.europe-west2.run.app/api/ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include JWT for protected endpoints
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      setResponse(data.response || 'No response from server');
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error calling the backend');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="What problem can we solve for you?"
          style={{
            width: '300px',
            padding: '0.5rem',
            marginRight: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            border: '1px solid #000',
            backgroundColor: '#666',
            color: '#fff',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#444';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#666';
          }}
        >
          Submit
        </button>
      </form>
      {response && (
        <p style={{ margin: 0, color: '#333' }}>
          Response: {response}
        </p>
      )}
    </div>
  );
}
