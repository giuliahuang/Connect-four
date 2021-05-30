import jwt from 'jsonwebtoken'

export interface Payload {
  sub: string,
  iat: number
}

export async function issueJWT(user): Promise<any> {
  const _id = user._id
  const expiresIn = '30d'

  const payload: Payload = {
    sub: _id,
    iat: Date.now()
  }

  if (process.env.JWT_SECRET) {
    const signedToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn, algorithm: 'HS256' })
    return {
      token: `Bearer ${signedToken}`,
      expires: expiresIn
    }
  }
}