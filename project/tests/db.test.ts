import test from 'node:test';
import assert from 'node:assert/strict';

// Test DB business logic in isolation
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  passwordHash: string;
}

function validateRegistration(data: { name: string; email: string; password: string }) {
  if (!data.name.trim()) return { success: false, error: 'Name required' };
  if (!data.email.includes('@')) return { success: false, error: 'Valid email required' };
  if (data.password.length < 4) return { success: false, error: 'Password too short' };
  return { success: true };
}

function calculateConfidenceScore(rawProbability: number, isDeepfake: boolean): number {
  if (isDeepfake) {
    return Math.round(rawProbability * 100);
  } else {
    return Math.round((1 - rawProbability) * 100);
  }
}

test('validateRegistration accepts valid student credentials', () => {
  const result = validateRegistration({
    name: 'Muhammad Adnan',
    email: 'adnannawazk080@gmail.com',
    password: 'securePass123',
  });
  assert.equal(result.success, true);
});

test('validateRegistration rejects invalid email', () => {
  const result = validateRegistration({
    name: 'Hadia Noor',
    email: 'invalid-email',
    password: 'securePass123',
  });
  assert.equal(result.success, false);
  assert.equal(result.error, 'Valid email required');
});

test('calculateConfidenceScore accurately maps fake and authentic scores', () => {
  const fakeScore = calculateConfidenceScore(0.872, true);
  assert.equal(fakeScore, 87);

  const realScore = calculateConfidenceScore(0.06, false);
  assert.equal(realScore, 94);
});
