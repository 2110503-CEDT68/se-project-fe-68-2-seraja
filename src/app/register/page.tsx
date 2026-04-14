"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/libs/hooks/useAuth";
import { RegisterData } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 👉 state สำหรับ popup
  const [showPolicy, setShowPolicy] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterData | null>(null);

  // 👉 กด submit → เปิด popup ก่อน
  const handleRegister = async (data: RegisterData) => {
    setPendingData(data);
    setShowPolicy(true);
  };

  // 👉 กดยอมรับ policy → สมัครจริง
  const confirmRegister = async () => {
    if (!pendingData) return;

    setError(null);
    setLoading(true);

    try {
      await register(pendingData);
      router.push("/");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
      setShowPolicy(false);
    }
  };

  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Sign up to start booking your perfect campground.
          </p>

          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            error={error ?? undefined}
          />

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </PageContainer>

      {/* ✅ Popup Policy */}
      {showPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              Terms & Privacy Policy
            </h2>

            <div className="mt-3 max-h-40 overflow-y-auto text-sm text-gray-600">
              <p className="mb-2">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy.
              </p>
              <p>
                Your personal data will be handled securely and used only for
                booking and account-related services.
              </p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowPolicy(false)}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmRegister}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}