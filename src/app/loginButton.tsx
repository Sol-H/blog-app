"use client";
import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginButton() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <button 
        className="text-gray-900 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white" 
        onClick={() => signOut()}
        >
          Sign out
        </button>
      </>
    )
  }
  return (
    <>
      <button 
      className="text-gray-900 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white" 
      onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  )
}