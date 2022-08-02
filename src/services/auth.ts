import jwt from 'jsonwebtoken';

export interface IAuthPayload {
    id: number;
}

interface IAuth {
    sign(payload: IAuthPayload): Promise<string>;
    verify(token: string): Promise<IAuthPayload>;
}

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("There is no JWT secret!!");
}

class Auth implements IAuth {
    sign(payload: IAuthPayload): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            jwt.sign(payload, secret!, (error, token) => {
                if (error) {
                    reject(error);
                }
                resolve(token!);
            });
        });
    }

    verify(token: string): Promise<IAuthPayload> {
        return new Promise<IAuthPayload>((resolve, reject) => {
            jwt.verify(token, secret!, (error, payload) => {
                if (error) {
                    reject(error);
                }
                resolve(payload as IAuthPayload);
            });
        });
    }
}

export const auth = new Auth();