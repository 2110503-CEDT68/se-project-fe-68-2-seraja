"use client";

import { useState, useRef } from "react";
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

  // 👉 popup state
  const [showPolicy, setShowPolicy] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterData | null>(null);

  // 👉 scroll state
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isBottom =
      el.scrollHeight - el.scrollTop <= el.clientHeight + 5;

    if (isBottom) {
      setScrolledToBottom(true);
    }
  };

  // 👉 submit → เปิด policy
  const handleRegister = async (data: RegisterData) => {
    setPendingData(data);
    setScrolledToBottom(false); // reset ทุกครั้ง
    setShowPolicy(true);
  };

  // 👉 confirm → สมัครจริง
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

      {/* ✅ Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              Terms & Privacy Policy
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Scroll to the bottom to accept
            </p>

            {/* ✅ Scroll Area */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="mt-3 max-h-64 overflow-y-auto text-sm text-gray-600 border p-3 rounded space-y-3"
            >
              <p>
                <strong>Privacy Policy & Terms of Service</strong><br />
              </p>

              <p>
                By creating an account and using our platform ("we", "our", "us"),
                you agree to these Terms and Privacy Policy.
              </p>

              <p>
                <strong>1. Information We Collect</strong><br />
                We collect personal data such as your name, email, phone number,
                and booking details. We also collect technical data like IP address,
                device, and usage behavior.
              </p>

              <p>
                <strong>2. How We Use Your Information</strong><br />
                To process bookings, manage accounts, provide support, improve services,
                and comply with legal obligations.
              </p>

              <p>
                <strong>3. Data Retention</strong><br />
                Booking data may be stored up to 5 years. Account data is kept while active.
                Logs and analytics retained up to 12 months.
              </p>

              <p>
                <strong>4. Data Sharing</strong><br />
                We do not sell your data. We only share with service providers,
                payment processors, and campground partners when necessary.
              </p>

              <p>
                <strong>5. Cookies</strong><br />
                Used to enhance experience and analyze traffic. You can control via browser.
              </p>

              <p>
                <strong>6. Security</strong><br />
                We use appropriate safeguards, but no system is 100% secure.
              </p>

              <p>
                <strong>7. Your Rights</strong><br />
                You may access, correct, or delete your data depending on your jurisdiction.
              </p>

              <p>
                <strong>8. Liability</strong><br />
                We are not responsible for indirect damages or third-party issues.
              </p>

              <p>
                <strong>9. Updates</strong><br />
                Continued use means acceptance of updated policies.
              </p>

              <p>
                <strong>10. Contact</strong><br />
                seraja@email.com
              </p>

              <p>
                By scrolling and clicking Accept, you agree to these terms.
              </p>

              <div className="h-6" />
            </div>

            {/* ✅ Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowPolicy(false)}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmRegister}
                disabled={!scrolledToBottom}
                className={`rounded-md px-4 py-2 text-sm text-white ${
                  scrolledToBottom
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}