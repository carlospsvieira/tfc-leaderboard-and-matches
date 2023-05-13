import { Request, Response } from 'express';
import LoginService from '../services/Login.service';

class LoginController {
  public static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'All fields must be filled' });
        return;
      }

      const token = await LoginService.login({ email, password });
      res.status(200).json({ token });
    } catch (error: unknown) {
      res.status(401).json({ message: (error as Error).message });
    }
  };
}

export default LoginController;
