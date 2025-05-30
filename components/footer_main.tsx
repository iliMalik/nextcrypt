// app/components/Footer_Main.tsx
import Link from "next/link";

export default function Footer_Main() {
  return (
    <footer className="bg-white border-t mt-6 p-4 text-sm text-center text-gray-600">
      <div className="flex justify-content-center align-items-center gap-4">
        <Link href="/about" className="text-blue-500 hover:underline">
          About
        </Link>
        <Link href="/contact" className="text-blue-500 hover:underline">
          Contact
        </Link>
      </div>
      <p className="mt-2">
        © {new Date().getFullYear()} Diagnostic Tool by UNICRES. All rights
        reserved.
      </p>
    </footer>
  );
}
