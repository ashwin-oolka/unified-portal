// middleware.ts
import { auth } from "@/auth/auth"
import { NextResponse } from "next/server"

export default auth((req:any) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const url = new URL("/", req.url)
    return NextResponse.redirect(url)
  }
})

// Limit scope
export const config = {
  matcher: ["/dashboard/:path*"],
}
