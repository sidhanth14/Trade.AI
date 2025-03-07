// SignInForm.tsx
'use client';
import type { ChangeEvent } from 'react';

type SignInProps = {
  email: string;
  password: string;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function SignInForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: SignInProps) {
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
      <label style={{ display: 'block', fontWeight: 'bold' }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Enter your password"
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
