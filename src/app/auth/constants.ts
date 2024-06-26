export const USER_AUTH_TOKEN = 'knxt-auth-token'

export const getAuthEnvVariables = () => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

  if (JWT_SECRET_KEY === undefined) {
    throw 'JWT_SECRET_KEY env variable is required'
  }

  return {
    JWT_SECRET_KEY,
  }
}
