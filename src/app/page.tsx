// import Image from "next/image";
import Navbar from "@/components/navbar";
import AccountMessage from "./accountMessage";
import Dashboard from "./dashboard";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex flex-col text-center mt-5">
        <Dashboard />
        <AccountMessage />
      </div>
    </div>
  );
}
