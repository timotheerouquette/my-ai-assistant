import type { NextRequest, NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { jwtVerify, SignJWT } from 'jose'
import { getAuthEnvVariables } from './constants'

const { JWT_SECRET_KEY } = getAuthEnvVariables()

export const decodeBase64 = (data: string) => {
  const buff = Buffer.from(data, 'base64')

  return buff.toString('utf-8')
}

/**
 * Verifies the user's JWT token and returns true if
 * valid, false if not.
 */
export async function verifyJWTCookie(
  request: NextRequest,
  cookieName: string
): Promise<boolean> {
  const token = request.cookies.get(cookieName)

  if (token === undefined) {
    return false
  }

  try {
    await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET_KEY))

    return true
  } catch (err) {
    return false
  }
}

/**
 * Adds a JWT token cookie to a Next API response.
 */
export async function addJWTCookieToAPIResponse(
  request: NextApiRequest,
  response: NextApiResponse,
  {
    cookieName,
    payload,
  }: {
    cookieName: string
    payload?: Record<string, unknown>
  }
): Promise<NextApiResponse> {
  const token = await generateToken(payload)

  return setCookieToAPIResponse(response, cookieName, token)
}

/**
 * Adds a JWT token cookie to a Next response.
 */
export async function addJWTCookieToResponse(
  request: NextRequest,
  response: NextResponse,
  {
    cookieName,
    payload,
  }: {
    cookieName: string
    payload?: Record<string, unknown>
  }
): Promise<NextResponse> {
  const cookie = request.cookies.get(cookieName)

  if (cookie === undefined) {
    const token = await generateToken(payload)

    return setJWTCookieToNextResponse(response, cookieName, token)
  }

  return response
}

async function generateToken(
  payload?: Record<string, unknown>
): Promise<string> {
  const token = await new SignJWT(payload ?? {})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET_KEY))

  return token
}

export function setCookieToAPIResponse(
  response: NextApiResponse,
  cookieName: string,
  token: string
): NextApiResponse {
  response.setHeader(
    'Set-Cookie',
    `${cookieName}=${token}; HttpOnly; Secure; Path=/; SameSite=Lax`
  )

  return response
}

function setJWTCookieToNextResponse(
  response: NextResponse,
  cookieName: string,
  token: string
): NextResponse {
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: true,
    path: '/',
  })

  return response
}
