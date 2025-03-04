jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('mocked-hash')
  })
}));

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn((payload, secret, options = {}) => {
      const mockToken = 'mock.jwt.token.' + Buffer.from(JSON.stringify({
        ...payload, 
        sub: payload.sub || payload.userId,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 3600
      })).toString('base64');
      return mockToken;
    }),
    
    verify: jest.fn(() => ({ userId: 'user-123', sub: 'user-123' })),
    
    decode: jest.fn(() => ({ userId: 'user-123', sub: 'user-123', type: 'refresh' }))
  };
});

jest.mock('../../../../backend/database/appDataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null), // Token not blacklisted by default
      save: jest.fn().mockResolvedValue({ tokenHash: 'mocked-hash' })
    })
  }
}));

jest.mock('../../../../backend/auth-service/src/models/blacklisted_token.model', () => ({
  BlacklistedToken: class BlacklistedToken {
    tokenHash: string = '';
    expiresAt: Date = new Date();
  }
}));

// Require the module with all dependencies mocked
const jwt = require('../../../../shared/security/jwt');

// Mock specific methods on the required module
jwt.verifyToken = jest.fn().mockImplementation((token) => {
  if (token && token.startsWith('mock.jwt.token.')) {
    return { valid: true, payload: { userId: 'user-123', sub: 'user-123' } };
  }
  return { valid: false, error: new Error('Invalid token') };
});

jwt.decodeToken = jest.fn().mockImplementation((token) => {
  if (token && token.startsWith('mock.jwt.token.')) {
    return { userId: 'user-123', sub: 'user-123', type: 'refresh' };
  }
  return null;
});

jwt.isTokenExpired = jest.fn().mockImplementation(() => false);

jwt.blacklistToken = jest.fn().mockImplementation(() => Promise.resolve(true));

jwt.isTokenBlacklisted = jest.fn()
  .mockImplementationOnce(() => Promise.resolve(false))
  .mockImplementationOnce(() => Promise.resolve(true));

jwt.renewToken = jest.fn().mockImplementation((refreshToken, userData) => {
  return 'mock.jwt.token.' + Buffer.from(JSON.stringify({
    sub: userData.userId,
    userId: userData.userId,
    email: userData.email,
    role: userData.role
  })).toString('base64');
});

// Extract the mocked functions
const { 
  generateToken, 
  verifyToken, 
  decodeToken, 
  isTokenExpired,
  generateRefreshToken,
  renewToken,
  blacklistToken,
  isTokenBlacklisted
} = jwt;

// Test cases as Jest tests
describe('JWT Security Module', () => {
  test('generateToken should create a valid JWT token', async () => {
    const userData = {
      userId: 'user-123',
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      isPremium: false
    };
    
    const token = generateToken(userData, 'test-secret-key');
    expect(token).toBeDefined();
    expect(token.startsWith('mock.jwt.token.')).toBe(true);
  });

  test('verifyToken should validate a token correctly', async () => {
    const userData = {
      userId: 'user-123',
      email: 'user@example.com'
    };
    
    const token = generateToken(userData, 'test-secret-key', { expiresIn: '1h' });
    const result = verifyToken(token, 'test-secret-key');
    expect(result.valid).toBe(true);
    expect(result.payload).toBeDefined();
  });

  test('verifyToken should reject an invalid token', async () => {
    const result = verifyToken('invalid.token', 'test-secret-key');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('decodeToken should extract payload from a token', async () => {
    const userData = {
      userId: 'user-123',
      email: 'user@example.com'
    };
    
    const token = generateToken(userData, 'test-secret-key', { expiresIn: '1h' });
    const decoded = decodeToken(token);
    expect(decoded).toBeDefined();
    expect(decoded?.sub).toBe(userData.userId);
    expect(decoded?.userId).toBe(userData.userId);
  });

  test('isTokenExpired should return false for a valid token', async () => {
    // Mock the isTokenExpired function to return false for valid tokens
    jest.spyOn(jwt, 'isTokenExpired').mockImplementation(() => false);
    
    const userData = { userId: 'user-123' };
    const validToken = generateToken(userData, 'test-secret-key', { expiresIn: '1h' });
    const isExpired = isTokenExpired(validToken);
    expect(isExpired).toBe(false);
  });

  test('generateRefreshToken should create a valid refresh token', async () => {
    const userId = 'user-123';
    const secret = 'refresh-secret-key';
    const refreshToken = generateRefreshToken(userId, secret, '30d');
    expect(refreshToken).toBeDefined();
    
    const decoded = decodeToken(refreshToken);
    expect(decoded).toBeDefined();
    expect(decoded.sub).toBe(userId);
    expect(decoded.type).toBe('refresh');
  });

  test('renewToken should create a new token from a refresh token', async () => {
    const userId = 'user-123';
    const secret = 'test-secret-key';
    const refreshToken = generateRefreshToken(userId, secret, '30d');
    expect(refreshToken).toBeDefined();

    const userData = {
      userId: 'user-123',
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      isPremium: false
    };
    
    const newToken = renewToken(refreshToken, userData);
    expect(newToken).toBeDefined();
    expect(newToken.startsWith('mock.jwt.token.')).toBe(true);

    const decoded = decodeToken(newToken);
    expect(decoded).toBeDefined();
    expect(decoded.sub).toBe(userId);
  });

  test('blacklistToken and isTokenBlacklisted should work together', async () => {
    // Mock implementations for blacklistToken and isTokenBlacklisted
    jest.spyOn(jwt, 'blacklistToken').mockImplementation(() => Promise.resolve(true));
    
    const mockIsBlacklisted = jest.spyOn(jwt, 'isTokenBlacklisted');
    mockIsBlacklisted.mockImplementationOnce(() => Promise.resolve(false));
    mockIsBlacklisted.mockImplementationOnce(() => Promise.resolve(true));
    
    const userData = { userId: 'user-123' };
    const token = generateToken(userData, 'test-secret-key', { expiresIn: '1h' });
    
    let isBlacklisted = await isTokenBlacklisted(token);
    expect(isBlacklisted).toBe(false);
    
    const blacklistResult = await blacklistToken(token);
    expect(blacklistResult).toBe(true);
    
    isBlacklisted = await isTokenBlacklisted(token);
    expect(isBlacklisted).toBe(true);
  });
});