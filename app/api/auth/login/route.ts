import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock authentication - replace with actual authentication logic
    if (email === 'admin@kazini.co.ke' && password === 'password123') {
      const user = {
        id: '1',
        email: 'admin@kazini.co.ke',
        name: 'John Admin',
        role: 'admin' as const,
      }

      // Generate a mock JWT token (in production, use proper JWT)
      const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64')

      // Set HTTP-only cookie
      const cookieStore = await cookies()
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })

      return NextResponse.json({ user, token })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}