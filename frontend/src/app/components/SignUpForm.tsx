// SignUpForm.tsx
'use client';
import type { ChangeEvent } from 'react';

type SignUpProps = {
  email: string;
  password: string;
  confirmPass: string;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onConfirmPassChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function SignUpForm({
  email,
  password,
  confirmPass,
  onEmailChange,
  onPasswordChange,
  onConfirmPassChange,
}: SignUpProps) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: 'bold' }}>Email</label>
      <input
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Enter your email"
        style={{
          width: '100%',
          marginBottom: '1rem',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          color: '#000',
        }}
      />
      <label style={{ display: 'block', fontWeight: 'bold' }}>
        Create a password
      </label>
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Create a password"
        style={{
          width: '100%',
          marginBottom: '1rem',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          color: '#000',
        }}
      />
      <label style={{ display: 'block', fontWeight: 'bold' }}>
        Confirm your password
      </label>
      <input
        type="password"
        value={confirmPass}
        onChange={onConfirmPassChange}
        placeholder="Confirm your password"
        style={{
          width: '100%',
          marginBottom: '1rem',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          color: '#000',
        }}
      />
      {/* no button here */}
    </div>
  );
}
