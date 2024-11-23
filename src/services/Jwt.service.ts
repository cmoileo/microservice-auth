import * as jwt from 'jsonwebtoken';

class JwtService {
  constructor(private secret: string = process.env.JWT_SECRET || undefined) {}

  async generateToken(
    payload: { email: string },
    expiresIn: string,
  ): Promise<string> {
    if (!this.secret) {
      throw new Error('Secret is not defined');
    }
    return jwt.sign(payload, this.secret, { expiresIn: expiresIn });
  }

  async verify(token: string): Promise<object> {
    try {
      if (!process.env.JWT_SECRET) return new Error('Secret is not defined');
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      return {
        valid: true,
        decoded: decoded,
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }
}

export default JwtService;
