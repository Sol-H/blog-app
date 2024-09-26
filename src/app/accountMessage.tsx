"use client";
import { useSession } from "next-auth/react"

export default function AccountMessage () {
  const { data: session } = useSession()
  if (session) {
    return(
    <p>Signed in as {session.user?.name}</p>
    )
  }
  else {
    return (
      <>
      <div className="flex w-full items-center justify-center mt-10">
        <span className="text-3xl absolute mx-auto py-4 flex border w-fit bg-gradient-to-r blur-xl dark:from-blue-500 dark:via-teal-500 dark:to-green-500 from-blue-700 via-teal-700 to-green-700 bg-clip-text box-content font-extrabold text-transparent text-center select-none">
        Blogging has never been easier.
      </span>
        <h1
            className="text-3xl relative top-0 w-fit h-auto py-4 justify-center flex bg-gradient-to-r items-center dark:from-blue-500 dark:via-teal-500 dark:to-green-500 from-blue-700 via-teal-700 to-green-700 bg-clip-text font-extrabold text-transparent text-center select-auto">
            Blogging has never been easier.
        </h1>
        
      </div>
      <p>Sign in to get started.</p>
      </>
    )
  }
}