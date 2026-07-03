import * as constants from '../constants';

describe('public requests constants', () => {
  it('should export correct endpoint strings', () => {
    expect(constants.LOGIN_URL).toBe('/auth/login_user');
    expect(constants.REGISTER_URL).toBe('/auth/register_user');
    expect(constants.VERIFY_URL).toBe('/auth/verify_user');
    expect(constants.FORGOT_PASSWORD_URL).toBe('/auth/forgot_password');
    expect(constants.RESET_PASSWORD_URL).toBe('/auth/reset_password');
    expect(constants.RESET_PASSWORD_FP_URL).toBe('/auth/reset_password_fp');
    expect(constants.PING_URL).toBe('/ping_server');
  });
});
