import type { NextRequest } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { addJWTCookieToAPIResponse, verifyJWTCookie } from './utils'
import { USER_AUTH_TOKEN } from './constants'

export function verifyAuthCookie(request: NextRequest): Promise<boolean> {
  return verifyJWTCookie(request, USER_AUTH_TOKEN)
}

export function setAuthCookie(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<NextApiResponse> {
  return addJWTCookieToAPIResponse(request, response, {
    cookieName: USER_AUTH_TOKEN,
  })
}
