import { AlreadyRegisteredException } from '../../src/common/exceptions/already-registered.exception';

describe('AlreadyRegisteredException', () => {
  it('should have valid message', () => {
    const message = 'User with such username is already registered';
    const exception = new AlreadyRegisteredException();
    expect(exception.message).toBe(message);
  });
});
