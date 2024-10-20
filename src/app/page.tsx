// import Image from "next/image";
import AccountMessage from "./accountMessage";
import Dashboard from "./dashboard";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col text-center mt-5">
        <Dashboard />
        <AccountMessage />
      </div>
    </div>
  );
}
