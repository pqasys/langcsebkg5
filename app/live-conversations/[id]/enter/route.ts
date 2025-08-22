import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const conversationId = params.id
  const callbackUrl = `/live-conversations/${conversationId}/enter`

  if (!session?.user?.id) {
    const signinUrl = new URL('/auth/signin', request.url)
    signinUrl.searchParams.set('callbackUrl', callbackUrl)
    return NextResponse.redirect(signinUrl)
  }

  // Call join endpoint to enforce entitlements and open/create the video session
  try {
    const base = new URL(request.url)
    const joinUrl = new URL(`/api/live-conversations/${conversationId}/join`, `${base.protocol}//${base.host}`)
    const res = await fetch(joinUrl.toString(), { method: 'POST', headers: { cookie: request.headers.get('cookie') || '' } })
    const data = await res.json().catch(() => ({}))

    if (res.ok && data?.success && data?.videoSessionId) {
      const vs = new URL(`/video-session/${data.videoSessionId}`, `${base.protocol}//${base.host}`)
      return NextResponse.redirect(vs)
    }

    // If backend suggested an upgrade or trial, redirect there and preserve return
    if (data?.redirectUrl) {
      const target = new URL(data.redirectUrl, `${base.protocol}//${base.host}`)
      target.searchParams.set('next', callbackUrl)
      return NextResponse.redirect(target)
    }

    // Fallback: go back to details with error
    const details = new URL(`/live-conversations/${conversationId}`, `${base.protocol}//${base.host}`)
    if (data?.error) details.searchParams.set('error', data.error)
    return NextResponse.redirect(details)
  } catch {
    const details = new URL(`/live-conversations/${conversationId}`, request.url)
    details.searchParams.set('error', 'Failed to open session')
    return NextResponse.redirect(details)
  }
}


