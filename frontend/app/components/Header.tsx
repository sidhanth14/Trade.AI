// 'use client';
// import { useState } from 'react';
// import AuthModal from './AuthModal';

// export default function Header() {
//   // Track whether user is signed in or not
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // For opening/closing the AuthModal
//   const [showModal, setShowModal] = useState(false);

//   // For showing the "Are you sure you want to sign out?" overlay
//   const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

//   // Called by the AuthModal when user successfully signs in/up
//   const handleAuthSuccess = () => {
//     setIsLoggedIn(true);
//     setShowModal(false); // close the modal
//   };

//   // "Sign In" button in the corner
//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   // "Sign Out" button in the corner
//   const handleSignOutClick = () => {
//     setShowSignOutConfirm(true);
//   };

//   // If user confirms sign out => revert to "Sign In" mode
//   // If user says no => do nothing except close the confirm
//   const handleSignOutResponse = (yes: boolean) => {
//     setShowSignOutConfirm(false);
//     if (yes) {
//       // user is signed out
//       setIsLoggedIn(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         // Original styling
//         minHeight: '10vh',
//         background: 'linear-gradient(135deg, #0f766e 0%, #15803d 100%)',
//         color: 'white',
//         padding: '0.75rem 2rem',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}
//     >
//       {/* Left side: New Query / Past Queries (unchanged) */}
//       <div style={{ display: 'flex', gap: '1.5rem' }}>
//         <button
//           style={{
//             background: 'none',
//             border: 'none',
//             color: 'inherit',
//             cursor: 'pointer',
//             fontSize: '1rem',
//           }}
//         >
//           New Query
//         </button>
//         <button
//           style={{
//             background: 'none',
//             border: 'none',
//             color: 'inherit',
//             cursor: 'pointer',
//             fontSize: '1rem',
//           }}
//         >
//           Past Queries
//         </button>
//       </div>

//       {/* Right side: either Sign In OR Sign Out */}
//       {!isLoggedIn ? (
//         <button
//           onClick={handleOpenModal}
//           style={{
//             background: 'none',
//             border: '1px solid white',
//             color: 'white',
//             cursor: 'pointer',
//             padding: '0.3rem 0.75rem',
//             borderRadius: '4px',
//             fontSize: '0.9rem',
//           }}
//         >
//           Sign In
//         </button>
//       ) : (
//         <button
//           onClick={handleSignOutClick}
//           style={{
//             background: 'none',
//             border: '1px solid white',
//             color: 'white',
//             cursor: 'pointer',
//             padding: '0.3rem 0.75rem',
//             borderRadius: '4px',
//             fontSize: '0.9rem',
//           }}
//         >
//           Sign Out
//         </button>
//       )}

//       {/* Auth modal: pass "onSuccessfulAuth" callback */}
//       <AuthModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onSuccessfulAuth={handleAuthSuccess}
//       />

//       {/* Sign Out confirmation overlay */}
//       {showSignOutConfirm && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100vw',
//             height: '100vh',
//             backgroundColor: 'rgba(0,0,0,0.4)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               width: '300px',
//               background: '#fff',
//               borderRadius: '8px',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
//               padding: '1.5rem',
//               textAlign: 'center',
//             }}
//           >
//             <p style={{ marginBottom: '1rem', color: '#000' }}>
//               Are you sure you want to sign out?
//             </p>
//             <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
//               <button
//                 onClick={() => handleSignOutResponse(true)}
//                 style={{
//                   background: '#000',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '4px',
//                   padding: '0.5rem 1rem',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => handleSignOutResponse(false)}
//                 style={{
//                   background: '#fff',
//                   color: '#000',
//                   border: '1px solid #000',
//                   borderRadius: '4px',
//                   padding: '0.5rem 1rem',
//                   cursor: 'pointer',
//                 }}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';
import AuthModal from './AuthModal';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';



export default function Header() {
  // Track whether user is signed in or not
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // For opening/closing the AuthModal
  const [showModal, setShowModal] = useState(false);

  // For showing the "Are you sure you want to sign out?" overlay
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const router = useRouter();

  // On mount, check if an access token exists to set the initial auth state
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  // Called by the AuthModal when user successfully signs in/up
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowModal(false); // close the modal
  };

  // "Sign In" button in the corner
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // "Sign Out" button in the corner
  const handleSignOutClick = () => {
    setShowSignOutConfirm(true);
  };

  // When the user confirms sign out, remove the token and reload the page
  const handleSignOutResponse = (yes: boolean) => {
    setShowSignOutConfirm(false);
    if (yes) {
      // Remove token from localStorage
      localStorage.removeItem('access_token');
      // Update authentication state
      setIsLoggedIn(false);
      // Reload the page to clear any UI state (e.g., query responses)
      window.location.reload();
    }
  };

  return (
    <div
      style={{
        minHeight: '10vh',
        background: 'linear-gradient(135deg, #0f766e 0%, #15803d 100%)',
        color: 'white',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Left side: New Query / Past Queries */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          onClick={() => router.push('/')}
        >
          New Query
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          onClick={() => router.push('/pastqueries')}

        >
          Past Queries
        </button>
      </div>

      {/* Right side: either Sign In OR Sign Out */}
      {!isLoggedIn ? (
        <button
          onClick={handleOpenModal}
          style={{
            background: 'none',
            border: '1px solid white',
            color: 'white',
            cursor: 'pointer',
            padding: '0.3rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        >
          Sign In
        </button>
      ) : (
        <button
          onClick={handleSignOutClick}
          style={{
            background: 'none',
            border: '1px solid white',
            color: 'white',
            cursor: 'pointer',
            padding: '0.3rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        >
          Sign Out
        </button>
      )}

      {/* Auth modal: pass "onSuccessfulAuth" callback */}
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccessfulAuth={handleAuthSuccess}
      />

      {/* Sign Out confirmation overlay */}
      {showSignOutConfirm && (
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
          <div
            style={{
              width: '300px',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ marginBottom: '1rem', color: '#000' }}>
              Are you sure you want to sign out?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => handleSignOutResponse(true)}
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleSignOutResponse(false)}
                style={{
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
