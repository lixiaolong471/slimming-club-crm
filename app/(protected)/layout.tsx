'use client';

import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/components/AuthProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}