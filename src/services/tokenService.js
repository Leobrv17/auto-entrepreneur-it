const revokedTokens = new Set();

const tokenService = {
  revoke(token) {
    revokedTokens.add(token);
  },
  isRevoked(token) {
    return revokedTokens.has(token);
  },
};

export default tokenService;
