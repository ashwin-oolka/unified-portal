"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useMemo } from "react"

const ADMIN_EMAILS = ["avnii.k02@gmail.com"] as const

export default function AuthComponent() {
  const { data: session, status } = useSession()

  const { role, isAdmin } = useMemo(() => {
    const email = session?.user?.email ?? ""
    const isAdmin = ADMIN_EMAILS.includes(email as (typeof ADMIN_EMAILS)[number])
    return { role: isAdmin ? "Admin Access" : "User Access", isAdmin }
  }, [session?.user?.email])

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-full h-screen flex flex-col items-center justify-center space-y-8 text-center">
        {status === "authenticated" ? (
          <>
            <h1 className="text-5xl font-extrabold text-[#1f4dfd]">
              Welcome Back{isAdmin ? ", Admin" : ""}!
            </h1>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-5 py-2 text-lg font-semibold ${
                  isAdmin
                    ? "bg-green-100 text-green-700 ring-2 ring-green-300"
                    : "bg-gray-100 text-gray-700 ring-2 ring-gray-300"
                }`}
              >
                {role}
              </span>
            </div>

            <p className="text-2xl text-gray-700">
              Signed in as <strong>{session.user?.email}</strong>
            </p>

            <button
              onClick={() => signOut()}
              className="mt-6 px-10 py-4 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold text-lg transition"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold text-[#1f4dfd]">
              Welcome to Oolka!
            </h1>
            <p className="text-2xl text-gray-700">Please sign in to continue</p>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="mt-6 px-10 py-4 rounded-full text-white font-bold text-xl transition bg-[#1f4dfd] hover:bg-[#163dcf]"
            >
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  )
}
