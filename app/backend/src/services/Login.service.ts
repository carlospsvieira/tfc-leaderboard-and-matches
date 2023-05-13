import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../database/models/Users.model';

export interface LoginCredentials {
  email: string;
  password: string;
}

class LoginService {
  public static async login(credentials: LoginCredentials): Promise<string> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('All fields must be filled');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid || !this.validateEmail(email) || !this.validatePassword(password)) {
      throw new Error('Invalid email or password');
    }

    const token = sign(
      { id: user.id, role: user.role },
      'jwt_secret', // my env isn't working properly, so for the sake of testing I left the key open
      { expiresIn: '1h' },
    );
    return token;
  }

  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static validatePassword(password: string): boolean {
    return password.length >= 6;
  }
}

export default LoginService;
