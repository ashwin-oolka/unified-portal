"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthComponent() {
  const { data: session } = useSession()
  console.log(session)

  return (
    <div className="min-h-screen w-full bg-[#e3f2e3] flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-8 py-12 bg-white shadow-2xl rounded-2xl flex flex-col items-center justify-center space-y-6 text-center">
        {session ? (
          <>
            <h1 className="text-3xl font-bold text-[#1f4dfd]">Welcome Back!</h1>
            <p className="text-lg text-gray-700">
              Signed in as <strong>{session.user?.email}</strong>
            </p>
            <button
              onClick={() => signOut()}
              className="mt-4 px-8 py-3 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[#1f4dfd]">Welcome to Oolka!</h1>
            <p className="text-lg text-gray-700">Please sign in to continue</p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="mt-4 px-8 py-3 rounded-full text-white font-semibold transition bg-[#1f4dfd] hover:bg-[#163dcf]"
            >
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  )
}
