
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Loading() {
  return (
    <div className={`flex min-h-screen w-full flex-col items-center justify-center bg-white gap-4 ${inter.className}`}>
      <div className="flex items-end text-5xl font-extrabold tracking-tighter">
        <span className="text-[#ff4f00] animate-pulse">Z</span>
        <span className="text-gray-900">Flow</span>
      </div>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff4f00]" />
    </div>
  )
}
