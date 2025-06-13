import * as jwt from 'jsonwebtoken'
import type {StringValue} from 'ms'

const JWT_SECRET: jwt.Secret = process.env.JWT_PASS!;
const JWT_REFRESH_SECRET: jwt.Secret = process.env.JWT_REFRESH_SECRET!;
const JWT_EXPIRE_IN = (process.env.JWT_EXPIRE_IN || '1h') as StringValue;


if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('As chaves JWT não estão definidas no arquivo .env');
}

export function CreateToken(payload: object): string {
    const options: jwt.SignOptions = { expiresIn: JWT_EXPIRE_IN };
    return jwt.sign(payload, JWT_SECRET, options)
}

export function RefreshToken(payload: object): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '7d'})
}

/**
 * Verifica se o Access Token é válido
 */

export function VerifyCreateToken(token: string): any {
    return jwt.verify(token, JWT_SECRET)
}

/**
 * Verifica se o Refresh Token é válido
 */

export function VerifyRefreshToken(token: string): any {
    return jwt.verify(token, JWT_REFRESH_SECRET)
}