// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import SignInForm from './SignInForm';
// import SignUpForm from './SignUpForm';

// type AuthModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   // This callback is invoked when user has valid creds and hits black button
//   onSuccessfulAuth: () => void;
// };

// export default function AuthModal({ isOpen, onClose, onSuccessfulAuth }: AuthModalProps) {
//   const [isLoginMode, setIsLoginMode] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPass, setConfirmPass] = useState('');

//   const router = useRouter();

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Real logic would validate creds here
//     if (isLoginMode) {
//       // Sign In logic
//       alert(`Signing In with Email: ${email}, Password: ${password}`);
//       router.push('/');
//       onSuccessfulAuth();
//     } else {
//       // Sign Up logic
//       if (password !== confirmPass) {
//         alert('Passwords do not match!');
//         return;
//       }
//       alert(`Signing Up with Email: ${email}, Password: ${password}`);
//       router.push('/');
//       onSuccessfulAuth();
//     }
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         backgroundColor: 'rgba(0,0,0,0.4)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 9999,
//       }}
//     >
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           width: '350px',
//           background: '#fff',
//           borderRadius: '8px',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
//           padding: '1.5rem',
//           position: 'relative',
//         }}
//       >
//         {/* close button */}
//         <button
//           type="button"
//           onClick={onClose}
//           style={{
//             position: 'absolute',
//             top: '1rem',
//             right: '1rem',
//             background: 'none',
//             border: 'none',
//             fontSize: '1.2rem',
//             cursor: 'pointer',
//           }}
//         >
//           ×
//         </button>

//         {/* Toggle */}
//         <div style={{ display: 'flex', marginBottom: '1rem' }}>
//           <button
//             type="button"
//             onClick={() => setIsLoginMode(true)}
//             style={{
//               background: isLoginMode ? 'none' : 'none',
//               color: isLoginMode ? '#0070f3' : '#000',
//               border: '1px solid #000',
//               padding: '0.5rem 1rem',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               flex: 1,
//               marginRight: '0.5rem',
//             }}
//           >
//             Log In
//           </button>
//           <button
//             type="button"
//             onClick={() => setIsLoginMode(false)}
//             style={{
//               background: !isLoginMode ? 'none' : 'none',
//               color: !isLoginMode ? '#0070f3' : '#000',
//               border: '1px solid #000',
//               padding: '0.5rem 1rem',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               flex: 1,
//             }}
//           >
//             Sign Up
//           </button>
//         </div>

//         {isLoginMode ? (
//           <SignInForm
//             email={email}
//             password={password}
//             onEmailChange={(e) => setEmail(e.target.value)}
//             onPasswordChange={(e) => setPassword(e.target.value)}
//           />
//         ) : (
//           <SignUpForm
//             email={email}
//             password={password}
//             confirmPass={confirmPass}
//             onEmailChange={(e) => setEmail(e.target.value)}
//             onPasswordChange={(e) => setPassword(e.target.value)}
//             onConfirmPassChange={(e) => setConfirmPass(e.target.value)}
//           />
//         )}

//         <button
//           type="submit"
//           style={{
//             background: '#000',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             padding: '0.5rem 1rem',
//             cursor: 'pointer',
//             width: '100%',
//           }}
//         >
//           {isLoginMode ? 'Sign In' : 'Sign Up'}
//         </button>
//       </form>
//     </div>
//   );
// }
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulAuth: () => void;
};

export default function AuthModal({ isOpen, onClose, onSuccessfulAuth }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLoginMode ? '/auth/login' : '/auth/signup';
    const payload = { email, password };

    // For sign up, ensure passwords match
    if (!isLoginMode && password !== confirmPass) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert('Error: ' + errorData.detail);
        return;
      }
      const data = await res.json();
      // Save the token (you might later use it for protected requests)
      localStorage.setItem('access_token', data.access_token);
      router.push('/');
      onSuccessfulAuth();
    } catch (err) {
      console.error(err);
      alert('Error contacting server');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '350px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          padding: '1.5rem',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        {/* Toggle buttons */}
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            style={{
              flex: 1,
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid #000',
              borderRadius: '4px',
              color: isLoginMode ? '#0070f3' : '#000',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              border: '1px solid #000',
              borderRadius: '4px',
              color: !isLoginMode ? '#0070f3' : '#000',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            Sign Up
          </button>
        </div>

        {isLoginMode ? (
          <SignInForm
            email={email}
            password={password}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
          />
        ) : (
          <SignUpForm
            email={email}
            password={password}
            confirmPass={confirmPass}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onConfirmPassChange={(e) => setConfirmPass(e.target.value)}
          />
        )}

        <button
          type="submit"
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {isLoginMode ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
