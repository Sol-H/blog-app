"use client";
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet"
import { FaGithub, FaGoogle } from "react-icons/fa"

export default function LoginButton() {
  const { data: session } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)

  const handleSignIn = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
      redirect: true
    })
  }

  if (session) {
    return (
      <button 
        className="text-gray-900 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white" 
        onClick={() => signOut()}
      >
        Sign out
      </button>
    )
  }

  return (
    <>
      <button 
        className="text-gray-900 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white" 
        onClick={() => setShowSignIn(true)}
      >
        Sign in
      </button>

      <Sheet open={showSignIn} onOpenChange={setShowSignIn}>
        <SheetOverlay className="bg-black/5 w-full h-full" />
        <SheetContent className="w-full max-w-sm rounded-lg p-6">
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold">Sign In</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Choose your preferred sign in method
            </p>
            
            <div className="flex flex-col w-full gap-4">
              <button
                onClick={() => handleSignIn('google')}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-md bg-white text-black hover:bg-gray-100 border border-gray-300"
              >
                <FaGoogle />
                Sign in with Google
              </button>

              <button
                onClick={() => handleSignIn('github')}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-md bg-[#24292F] text-white hover:bg-[#24292F]/90"
              >
                <FaGithub />
                Sign in with GitHub
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
