"use client";

import WorkflowPage from "../../components/WorkflowPage";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Workflow,
  Archive,
  Factory,
  Users,
  FileBarChart,
  Filter,
  List,
  LayoutGrid,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  LogOut,
  RotateCcw,
} from "lucide-react";

const USERNAME = "ricardo090606";

type MenuItem = {
  label: string;
  icon: typeof LayoutDashboard;
  children?: string[];
};

const menus: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Workflow", icon: Workflow },
  {
    label: "SIP",
    icon: Archive,
    children: ["Pengambilan Barang", "Sistem Gudang"],
  },
  {
    label: "Pengerjaan Vendor",
    icon: Factory,
    children: ["Proses Produksi"],
  },
  { label: "Pelanggan", icon: Users },
  { label: "Laporan", icon: FileBarChart },
];

const CABANG = [
  "Gunung Guntur",
  "Balikpapan Baru",
  "Grandcity",
  "Kilo 5",
  "Balikpapan Super Block",
  "Grand Senyiur",
  "Gunung Bakaran",
  "Balikpapan Regency",
  "Lamaru",
  "Tritip",
  "Gunung Pipa",
  "Mulawarman",
];

const KATEGORI = [
  "Aksesoris Merchandise",
  "OUTDOOR",
  "Advertising",
  "ThunderJet",
  "Safety Sign",
  "Corporate",
  "Retail",
];

type View = "list" | "grid" | "calendar";
type Job = {
  cabang: string;
  kategori: string;
  tanggal: string;
  status: "belum" | "sedang";
};

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fmt(iso: string) {
  return iso.split("-").reverse().join("-");
}

// DATA CONTOH. Ganti dengan data asli dari API/database nanti.
function buildJobs(): Job[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const jobs: Job[] = [];
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const tanggal = toISO(d);
    for (const cabang of CABANG) {
      for (const kategori of KATEGORI) {
        const n = Math.floor(rand() * 3);
        for (let k = 0; k < n; k++) {
          jobs.push({
            cabang,
            kategori,
            tanggal,
            status: rand() > 0.5 ? "sedang" : "belum",
          });
        }
      }
    }
  }
  return jobs;
}

const ALL_JOBS = buildJobs();

function pct(part: number, whole: number) {
  return whole ? Math.round((part / whole) * 100) : 0;
}

function Dot({ color }: { color: string }) {
  return <span className={`inline-block size-1.5 rounded-full ${color}`} />;
}

function SummaryCard({
  value,
  label,
  percent,
  dot,
}: {
  value: number;
  label: string;
  percent: number;
  dot?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        {dot && <Dot color={dot} />}
        {label}
      </div>
      <p className="mt-2 text-4xl font-semibold leading-none tracking-tight">
        {value}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-neutral-900"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[11px] text-neutral-500">{percent}%</span>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  percent,
  dot,
}: {
  value: number;
  label: string;
  percent: number;
  dot: string;
}) {
  return (
    <div className="rounded-lg bg-neutral-50 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] leading-tight text-neutral-500">
        <Dot color={dot} />
        {label}
      </div>
      <p className="mt-0.5 text-sm font-medium">
        {value}
        <span className="ml-1.5 text-[10px] font-normal text-neutral-400">
          {percent}%
        </span>
      </p>
    </div>
  );
}

function CategoryStats({
  belum,
  sedang,
  total,
}: {
  belum: number;
  sedang: number;
  total: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Stat
        value={belum}
        label="Belum Dikerjakan"
        percent={pct(belum, total)}
        dot="bg-red-500"
      />
      <Stat
        value={sedang}
        label="Sedang Dikerjakan"
        percent={pct(sedang, total)}
        dot="bg-emerald-500"
      />
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const today = toISO(new Date());

  const [view, setView] = useState<View>("list");
  const [menuOpen, setMenuOpen] = useState(false);

  // menu sidebar
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const [cabang, setCabang] = useState("");
  const [dari, setDari] = useState(today);
  const [sampai, setSampai] = useState(today);
  const [filterError, setFilterError] = useState("");

  const [applied, setApplied] = useState({
    cabang: "",
    dari: today,
    sampai: today,
  });

  function toggleGroup(label: string) {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  }

  function applyFilter() {
    if (!dari || !sampai) return setFilterError("Isi kedua tanggal");
    if (dari > sampai)
      return setFilterError(
        "Tanggal awal tidak boleh lebih besar dari tanggal akhir"
      );
    setFilterError("");
    setApplied({ cabang, dari, sampai });
  }

  function resetFilter() {
    setCabang("");
    setDari(today);
    setSampai(today);
    setFilterError("");
    setApplied({ cabang: "", dari: today, sampai: today });
  }

  const filtered = useMemo(
    () =>
      ALL_JOBS.filter(
        (j) =>
          (!applied.cabang || j.cabang === applied.cabang) &&
          j.tanggal >= applied.dari &&
          j.tanggal <= applied.sampai
      ),
    [applied]
  );

  const categories = useMemo(
    () =>
      KATEGORI.map((name) => {
        const rows = filtered.filter((j) => j.kategori === name);
        return {
          name,
          total: rows.length,
          belum: rows.filter((j) => j.status === "belum").length,
          sedang: rows.filter((j) => j.status === "sedang").length,
        };
      }),
    [filtered]
  );

  const total = filtered.length;
  const belum = filtered.filter((j) => j.status === "belum").length;
  const sedang = filtered.filter((j) => j.status === "sedang").length;

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const toggles: { id: View; icon: typeof List; label: string }[] = [
    { id: "list", icon: List, label: "Tampilan daftar" },
    { id: "grid", icon: LayoutGrid, label: "Tampilan kotak" },
    { id: "calendar", icon: CalendarDays, label: "Tampilan kalender" },
  ];

  const fieldClass =
    "h-9 rounded-lg border border-neutral-200 bg-white px-3 text-xs outline-none focus:border-neutral-400";

  const rangeLabel =
    applied.dari === applied.sampai
      ? fmt(applied.dari)
      : `${fmt(applied.dari)} s/d ${fmt(applied.sampai)}`;

  const isDashboard = activeMenu === "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#fafaf9] text-neutral-900">
      {/* Sidebar */}
      <aside className="hidden w-[210px] shrink-0 border-r border-neutral-200 bg-white px-3 py-6 md:block">
        <p className="px-2.5 text-lg font-bold tracking-tight">
          Space Creative
        </p>
        <nav className="mt-6 flex flex-col gap-1">
          {menus.map(({ label, icon: Icon, children }) => {
            const hasChildren = !!children;
            const childActive = children?.includes(activeMenu) ?? false;
            const active = activeMenu === label;
            const expanded =
              hasChildren && (openGroups.includes(label) || childActive);

            return (
              <div key={label}>
                <button
                  type="button"
                  onClick={() =>
                    hasChildren ? toggleGroup(label) : setActiveMenu(label)
                  }
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition ${
                    active
                      ? "bg-neutral-100 font-medium text-black"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                  <span className="flex-1">{label}</span>
                  {hasChildren &&
                    (expanded ? (
                      <ChevronDown size={14} className="text-neutral-400" />
                    ) : (
                      <ChevronRight size={14} className="text-neutral-400" />
                    ))}
                </button>

                {hasChildren && expanded && (
                  <div className="ml-[26px] mt-1 flex flex-col gap-0.5 border-l border-neutral-200 pl-3">
                    {children!.map((child) => (
                      <button
                        key={child}
                        type="button"
                        onClick={() => setActiveMenu(child)}
                        className={`rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                          activeMenu === child
                            ? "bg-neutral-100 font-medium text-black"
                            : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
                        }`}
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-5 md:px-10">
          <h1 className="text-base font-semibold">{activeMenu}</h1>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 transition hover:bg-neutral-50"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                {USERNAME[0].toUpperCase()}
              </span>
              <span className="hidden text-xs font-medium sm:block">
                {USERNAME}
              </span>
              <ChevronDown size={14} className="text-neutral-500" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium">{USERNAME}</p>
                    <p className="text-[11px] text-neutral-500">
                      Administrator
                    </p>
                  </div>
                  <div className="my-1 h-px bg-neutral-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <LogOut size={14} />
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="px-5 py-6 md:px-10">
          {activeMenu === "Workflow" ? (
  <WorkflowPage />
) : !isDashboard ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
              <p className="text-sm font-semibold">{activeMenu}</p>
              <p className="mt-1 text-xs text-neutral-500">
                Halaman ini belum dibuat.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="cabang"
                    className="text-[11px] font-medium text-neutral-500"
                  >
                    Cabang
                  </label>
                  <select
                    id="cabang"
                    value={cabang}
                    onChange={(e) => setCabang(e.target.value)}
                    className={`${fieldClass} w-[220px]`}
                  >
                    <option value="">Semua cabang</option>
                    {CABANG.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="dari"
                    className="text-[11px] font-medium text-neutral-500"
                  >
                    Tanggal
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="dari"
                      type="date"
                      value={dari}
                      max={sampai || undefined}
                      onChange={(e) => setDari(e.target.value)}
                      className={fieldClass}
                    />
                    <span className="text-xs text-neutral-500">s/d</span>
                    <input
                      type="date"
                      value={sampai}
                      min={dari || undefined}
                      onChange={(e) => setSampai(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyFilter}
                  className="flex h-9 items-center gap-2 rounded-lg bg-black px-4 text-xs font-medium text-white transition hover:bg-neutral-800"
                >
                  <Filter size={14} />
                  Filter
                </button>
                <button
                  type="button"
                  onClick={resetFilter}
                  className="flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 transition hover:bg-neutral-50"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>

                <div className="ml-auto flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
                  {toggles.map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      aria-label={label}
                      onClick={() => setView(id)}
                      className={`flex size-7 items-center justify-center rounded-md transition ${
                        view === id
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-500 hover:bg-neutral-100"
                      }`}
                    >
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
              </div>

              {filterError && (
                <p className="mt-2 text-xs text-red-600">{filterError}</p>
              )}

              <p className="mt-4 text-xs text-neutral-500">
                Menampilkan{" "}
                <span className="font-medium text-black">{total}</span>{" "}
                pekerjaan · {rangeLabel} ·{" "}
                {applied.cabang ? `Cabang ${applied.cabang}` : "Semua cabang"}
              </p>

              <section className="mt-3 grid gap-3 sm:grid-cols-3">
                <SummaryCard
                  value={total}
                  label="Total Pekerjaan"
                  percent={total ? 100 : 0}
                />
                <SummaryCard
                  value={belum}
                  label="Belum Dikerjakan"
                  percent={pct(belum, total)}
                  dot="bg-red-500"
                />
                <SummaryCard
                  value={sedang}
                  label="Sedang Dikerjakan"
                  percent={pct(sedang, total)}
                  dot="bg-emerald-500"
                />
              </section>

              {view === "calendar" ? (
                <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
                  Tampilan kalender belum dibuat.
                </div>
              ) : total === 0 ? (
                <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
                  Tidak ada pekerjaan pada tanggal dan cabang ini.
                </div>
              ) : view === "list" ? (
                <section className="mt-4 flex flex-col gap-2.5">
                  {categories.map((c) => (
                    <div
                      key={c.name}
                      className="grid items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-3 md:grid-cols-[1.2fr_1fr_1.5fr]"
                    >
                      <p className="text-[13px] font-semibold">{c.name}</p>
                      <div className="flex items-center gap-4">
                        <div className="leading-tight">
                          <p className="text-base font-medium">{c.total}</p>
                          <p className="text-[10px] text-neutral-500">
                            Total Pekerjaan
                          </p>
                        </div>
                        <div className="h-1 w-full max-w-[90px] overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full bg-neutral-900"
                            style={{ width: `${pct(c.total, total)}%` }}
                          />
                        </div>
                      </div>
                      <CategoryStats
                        belum={c.belum}
                        sedang={c.sedang}
                        total={c.total}
                      />
                    </div>
                  ))}
                </section>
              ) : (
                <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {categories.map((c) => (
                    <div
                      key={c.name}
                      className="rounded-2xl border border-neutral-200 bg-white p-5"
                    >
                      <p className="text-[13px] font-semibold">{c.name}</p>
                      <p className="mt-3 text-3xl font-semibold leading-none">
                        {c.total}
                      </p>
                      <p className="mt-1 text-[10px] text-neutral-500">
                        Total Pekerjaan
                      </p>
                      <div className="mt-4">
                        <CategoryStats
                          belum={c.belum}
                          sedang={c.sedang}
                          total={c.total}
                        />
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}