import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_PASS || ''
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || ''

export function CreateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'})
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