"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Headset } from "lucide-react";

export default function LoginCard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal masuk");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f4f4] px-4">
      <div className="w-full max-w-[348px] rounded-3xl border border-neutral-200 bg-white px-9 pb-8 pt-9">
        <p className="text-center text-sm font-medium text-neutral-500">
          Space Creative
        </p>

        <h1 className="mt-9 text-center text-[22px] font-bold text-black">
          Masuk ke Space Creative
        </h1>
        <p className="mx-auto mt-1 max-w-[240px] text-center text-[13px] leading-snug text-neutral-500">
          Masukkan username dan password untuk melanjutkan
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3">
          <div className="relative">
            <User
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="h-[34px] w-full rounded-lg border border-neutral-200 pl-9 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </div>

          <div className="relative">
            <Lock
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-[34px] w-full rounded-lg border border-neutral-200 pl-9 pr-9 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex cursor-pointer items-center gap-1.5 text-neutral-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-3 accent-black"
              />
              Ingat saya
            </label>
            <a href="#" className="text-blue-800 underline">
              Lupa password?
            </a>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 h-[34px] w-full rounded-lg bg-black text-xs font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-[11px] text-neutral-400">atau</span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <button
          type="button"
          className="flex h-[28px] w-full items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white text-xs font-semibold text-black transition hover:bg-neutral-50"
        >
          <Headset size={13} />
          Hubungi admin
        </button>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        © 2026 Space Creative. All rights reserved.
      </p>
    </div>
  );
}