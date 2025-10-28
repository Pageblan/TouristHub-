// src/_tests_/AuthContext.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the supabase client module used by AuthContext
vi.mock('../lib/supabase', () => {
  // Minimal supabase mock that matches supabase-js v2 API used by AuthContext:
  const mockUser = { id: 'user-1', email: 'x@x.com' };
  const mockSession = { user: mockUser };

  const supabase = {
    auth: {
      // getSession returns a Promise resolving to { data: { session } }
      getSession: () => Promise.resolve({ data: { session: mockSession } }),

      // onAuthStateChange returns { data: { subscription } } where subscription has unsubscribe()
      onAuthStateChange: (cb) => {
        // create a subscription object with an unsubscribe method (Supabase v2 style)
        const subscription = {
          unsubscribe: () => { /* noop for tests */ }
        };

        // call the callback asynchronously to simulate an existing signed-in session
        setTimeout(() => {
          try {
            cb('SIGNED_IN', { session: mockSession });
          } catch (e) {
            // swallow in test environment
          }
        }, 0);

        return { data: { subscription } };
      },

      // other auth methods used elsewhere
      signOut: vi.fn().mockResolvedValue({ error: null })
    },

    // chainable "from().select().eq().single()" mock used by AuthContext to fetch user_profile
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: { id: mockUser.id, email: mockUser.email, role: 'tourist' },
            error: null
          })
        })
      })
    })
  };

  return { supabase };
});

// import after mock so the module gets the mocked supabase
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function TestConsumer() {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="is-authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="user-role">{auth.userProfile?.role ?? 'no-role'}</span>
    </div>
  );
}

test('AuthProvider exposes isAuthenticated and userProfile.role', async () => {
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );

  // wait for async getSession/onAuthStateChange and profile fetch to settle
  await waitFor(() => {
    expect(screen.getByTestId('is-authenticated').textContent).toBe('true');
    expect(screen.getByTestId('user-role').textContent).toBe('tourist');
  });
});
