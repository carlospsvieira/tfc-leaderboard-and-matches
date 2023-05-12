import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../database/models/Users.model';

interface LoginCredentials {
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
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = sign(
      { id: user.id, role: user.role },
      'jwt_secret',
      { expiresIn: '1h' },
    );
    return token;
  }
}

export default LoginService;
