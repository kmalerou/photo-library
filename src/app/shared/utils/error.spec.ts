import { toErrorMessage } from './error';

describe('toErrorMessage', () => {
  it('returns the message of an Error instance', () => {
    expect(toErrorMessage(new Error('Storage unavailable'))).toBe('Storage unavailable');
  });

  it('falls back to a generic message for a non-Error value', () => {
    expect(toErrorMessage('boom')).toBe('Something went wrong.');
  });
});
