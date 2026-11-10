"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  List,
  LayoutGrid,
  CalendarDays,
  Eye,
  Settings2,
  RotateCcw,
  FileText,
} from "lucide-react";

/* =========================================================
   MASTER DATA
   ========================================================= */

const JENIS_MESIN = [
  "ThunderJet FY3208",
  "EcoSolvent E-200",
  "Offset M003",
  "Digital Indigo",
];

// TODO: ganti "[nama mesin]" dengan nama mesin yang sebenarnya
const KODE_MESIN: Record<string, string> = {
  P01: "[nama mesin]",
  P02: "[nama mesin]",
  P03: "[nama mesin]",
  P04: "[nama mesin]",
  P05: "[nama mesin]",
  P06: "[nama mesin]",
  P07: "[nama mesin]",
  P08: "[nama mesin]",
  P09: "[nama mesin]",
  P10: "[nama mesin]",
};

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

/* =========================================================
   TIPE DATA
   ========================================================= */

type Status = "belum" | "sedang";
type Person = { name: string; at: string } | null;

// Satu produk = satu Work Order. Format WO: WO-[kode_order]-[huruf_urut]
type Produk = {
  nama: string;
  qty: string;
  wo: string;
  jenisMesin: string; // salah satu dari JENIS_MESIN
  kodeMesin: string; // P01 - P10
};

type Retail = {
  id: string;
  nota: string;
  jenis: "spot" | "nanti";
  tahap: string;
  status: Status;
  pelanggan: string;
  waktu: string; // YYYY-MM-DDTHH:mm:ss
  bayar: "Lunas" | "Belum Bayar";
  deadlineMenit: number | null; // null kalau jenis = spot
  produk: Produk[];
  pj: { Kasir: Person; Operator: Person; Desain: Person };
};

type Corp = {
  id: string;
  tahap: string;
  status: Status;
  klien: string;
  tanggal: string;
  termin: string; // "Termin 30 hari" | "Menunggu Invoice" | "Lewat Deadline"
  deadlineMenit: number;
  cabang: string;
  produk: Produk[];
  pj: {
    AO: Person;
    Desain: Person;
    Operator: Person;
    Finishing: Person;
    Pengiriman: Person; // kurir
  };
  dokumen: { suratJalan: boolean; invoice: boolean; po: boolean };
};

/* =========================================================
   DATA DUMMY
   ========================================================= */

const RETAIL: Retail[] = [
  {
    id: "r1",
    nota: "GS2610000479",
    jenis: "spot",
    tahap: "Proses Produksi",
    status: "sedang",
    pelanggan: "Zahwa - 087868218417",
    waktu: "2026-10-03T17:04:49",
    bayar: "Lunas",
    deadlineMenit: null,
    produk: [
      { nama: "Fotokopi A4 BW", qty: "x100", wo: "WO-0479-A", jenisMesin: "Digital Indigo", kodeMesin: "P03" },
      { nama: "Laminating A4", qty: "x5", wo: "WO-0479-B", jenisMesin: "Digital Indigo", kodeMesin: "P03" },
    ],
    pj: {
      Kasir: { name: "Indah Afrilyanti", at: "2026-10-03T17:04:49" },
      Operator: { name: "Yogi", at: "2026-10-03T17:10:00" },
      Desain: null,
    },
  },
  {
    id: "r2",
    nota: "GS2610000487",
    jenis: "nanti",
    tahap: "Verifikasi Pembayaran",
    status: "belum",
    pelanggan: "Gusti Putra - 087888633759",
    waktu: "2026-10-03T17:02:01",
    bayar: "Belum Bayar",
    deadlineMenit: 6 * 60 + 51,
    produk: [
      { nama: "Spanduk China Solvent 3x1m", qty: "x2", wo: "WO-0487-A", jenisMesin: "EcoSolvent E-200", kodeMesin: "P01" },
      { nama: "Spanduk China Solvent 2x1m", qty: "x1", wo: "WO-0487-B", jenisMesin: "EcoSolvent E-200", kodeMesin: "P01" },
    ],
    pj: {
      Kasir: { name: "Indah Afrilyanti", at: "2026-10-03T17:02:01" },
      Operator: null,
      Desain: { name: "Mira", at: "2026-10-03T17:02:01" },
    },
  },
  {
    id: "r3",
    nota: "GS2610000485",
    jenis: "nanti",
    tahap: "Proses Produksi",
    status: "sedang",
    pelanggan: "Tini Makaroni - 081347890703",
    waktu: "2026-10-03T16:59:24",
    bayar: "Lunas",
    deadlineMenit: 9 * 60 + 42,
    produk: [
      { nama: "Cetak Art Paper A3", qty: "x50", wo: "WO-0485-A", jenisMesin: "Offset M003", kodeMesin: "P05" },
    ],
    pj: {
      Kasir: { name: "Indah Afrilyanti", at: "2026-10-03T16:59:24" },
      Operator: { name: "Hamid", at: "2026-10-03T17:15:00" },
      Desain: { name: "Hamid", at: "2026-10-03T16:59:24" },
    },
  },
  {
    id: "r4",
    nota: "GS2610000521",
    jenis: "nanti",
    tahap: "Proses Produksi",
    status: "sedang",
    pelanggan: "Budi Santoso - 085612345678",
    waktu: "2026-10-03T13:15:10",
    bayar: "Lunas",
    deadlineMenit: -135,
    produk: [
      { nama: "Banner Flexi 2x1m", qty: "x1", wo: "WO-0521-A", jenisMesin: "ThunderJet FY3208", kodeMesin: "P02" },
    ],
    pj: {
      Kasir: { name: "Sari", at: "2026-10-03T13:15:10" },
      Operator: { name: "Yogi", at: "2026-10-03T14:00:00" },
      Desain: null,
    },
  },
  {
    id: "r5",
    nota: "GS2610000530",
    jenis: "nanti",
    tahap: "Siap Diproses",
    status: "belum",
    pelanggan: "Lina Marlina - 087712345678",
    waktu: "2026-10-04T08:20:00",
    bayar: "Belum Bayar",
    deadlineMenit: 40,
    produk: [
      { nama: "Stiker Vinyl 1x1m", qty: "x3", wo: "WO-0530-A", jenisMesin: "ThunderJet FY3208", kodeMesin: "P02" },
    ],
    pj: {
      Kasir: { name: "Sari", at: "2026-10-04T08:20:00" },
      Operator: null,
      Desain: null,
    },
  },
];

const CORP: Corp[] = [
  {
    id: "c1",
    tahap: "Proses Produksi",
    status: "sedang",
    klien: "PT Mitra Sejahtera",
    tanggal: "2026-10-03T09:12:00",
    termin: "Termin 30 hari",
    deadlineMenit: 10 * 60 + 5,
    cabang: "Gunung Guntur",
    produk: [
      { nama: "Banner Indoor 3x1m", qty: "x4", wo: "WO-0512-A", jenisMesin: "EcoSolvent E-200", kodeMesin: "P01" },
      { nama: "Brosur A5", qty: "x1000", wo: "WO-0512-B", jenisMesin: "Offset M003", kodeMesin: "P05" },
    ],
    pj: {
      AO: { name: "Dimas", at: "2026-10-03T09:12:00" },
      Desain: { name: "Nadia", at: "2026-10-03T10:30:00" },
      Operator: null,
      Finishing: null,
      Pengiriman: null,
    },
    dokumen: { suratJalan: false, invoice: false, po: true },
  },
  {
    id: "c2",
    tahap: "Menunggu Invoice",
    status: "belum",
    klien: "CV Anugerah Logistik",
    tanggal: "2026-10-03T11:40:00",
    termin: "Menunggu Invoice",
    deadlineMenit: 45,
    cabang: "Gunung Guntur",
    produk: [
      { nama: "Stiker Vinyl Outdoor 2x1m", qty: "x6", wo: "WO-0518-A", jenisMesin: "ThunderJet FY3208", kodeMesin: "P02" },
    ],
    pj: {
      AO: { name: "Dimas", at: "2026-10-03T11:40:00" },
      Desain: null,
      Operator: null,
      Finishing: null,
      Pengiriman: null,
    },
    dokumen: { suratJalan: false, invoice: false, po: true },
  },
  {
    id: "c3",
    tahap: "Pengiriman",
    status: "sedang",
    klien: "PT Guntur Konstruksi",
    tanggal: "2026-10-02T14:05:00",
    termin: "Termin 14 hari",
    deadlineMenit: 28 * 60,
    cabang: "Balikpapan Baru",
    produk: [
      { nama: "X-Banner 60x160cm", qty: "x10", wo: "WO-0503-A", jenisMesin: "EcoSolvent E-200", kodeMesin: "P01" },
      { nama: "Kartu Nama", qty: "x5 box", wo: "WO-0503-B", jenisMesin: "Digital Indigo", kodeMesin: "P03" },
      { nama: "Map Plastik", qty: "x200", wo: "WO-0503-C", jenisMesin: "Offset M003", kodeMesin: "P05" },
    ],
    pj: {
      AO: { name: "Rina", at: "2026-10-02T14:05:00" },
      Desain: { name: "Hanif", at: "2026-10-02T15:20:00" },
      Operator: { name: "Yogi", at: "2026-10-03T08:10:00" },
      Finishing: { name: "Eko", at: "2026-10-03T13:00:00" },
      Pengiriman: { name: "Kurir Andi", at: "2026-10-03T15:30:00" },
    },
    dokumen: { suratJalan: true, invoice: true, po: true },
  },
  {
    id: "c4",
    tahap: "Proses Produksi",
    status: "sedang",
    klien: "Toko Sinar Abadi",
    tanggal: "2026-10-01T10:00:00",
    termin: "Lewat Deadline",
    deadlineMenit: -(26 * 60),
    cabang: "Grandcity",
    produk: [
      { nama: "Spanduk Flexi 4x1m", qty: "x2", wo: "WO-0498-A", jenisMesin: "EcoSolvent E-200", kodeMesin: "P01" },
    ],
    pj: {
      AO: { name: "Dimas", at: "2026-10-01T10:00:00" },
      Desain: { name: "Nadia", at: "2026-10-01T11:15:00" },
      Operator: { name: "Yogi", at: "2026-10-02T09:00:00" },
      Finishing: null,
      Pengiriman: null,
    },
    dokumen: { suratJalan: false, invoice: true, po: true },
  },
  {
    id: "c5",
    tahap: "Siap Diproses",
    status: "belum",
    klien: "PT Kaltim Prima Service",
    tanggal: "2026-10-04T08:20:00",
    termin: "Termin 30 hari",
    deadlineMenit: 3 * 1440 + 30,
    cabang: "Balikpapan Regency",
    produk: [
      { nama: "Safety Sign Akrilik", qty: "x40", wo: "WO-0530-A", jenisMesin: "ThunderJet FY3208", kodeMesin: "P02" },
      { nama: "Rambu K3 Sticker", qty: "x120", wo: "WO-0530-B", jenisMesin: "ThunderJet FY3208", kodeMesin: "P02" },
    ],
    pj: {
      AO: { name: "Rina", at: "2026-10-04T08:20:00" },
      Desain: null,
      Operator: null,
      Finishing: null,
      Pengiriman: null,
    },
    dokumen: { suratJalan: false, invoice: false, po: true },
  },
];

const PRODUKSI = [
  { nota: "GS2610000479", wo: "WO-0479-A", priority: "Tinggi", date: "03-10-2026", owner: "Yogi" },
  { nota: "-", wo: "WO-0512-A", priority: "Sedang", date: "03-10-2026", owner: "Nadia" },
  { nota: "-", wo: "WO-0503-A", priority: "Rendah", date: "02-10-2026", owner: "Hanif" },
  { nota: "GS2610000485", wo: "WO-0485-A", priority: "Tinggi", date: "03-10-2026", owner: "Hamid" },
];

/* =========================================================
   HELPER
   ========================================================= */

const TABS = ["Daftar Pesanan", "Proses Produksi", "Status & Tracking Pengajuan"] as const;
type Tab = (typeof TABS)[number];
type View = "list" | "grid" | "calendar";
type Tipe = "retail" | "corporate";

function dur(m: number) {
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  if (d > 0) return `${d} Hari ${h} Jam`;
  if (h > 0) return `${h} Jam ${mm} Menit`;
  return `${mm} Menit`;
}

// Warna deadline: merah = lewat, kuning < 1 jam, biru < 1 hari, hijau > 1 hari
function deadline(m: number | null) {
  if (m === null) return { label: "-", cls: "bg-neutral-100 text-neutral-400" };
  if (m < 0) return { label: `Lewat ${dur(-m)}`, cls: "bg-red-500 text-white" };
  if (m < 60) return { label: dur(m), cls: "bg-amber-400 text-black" };
  if (m < 1440) return { label: dur(m), cls: "bg-blue-500 text-white" };
  return { label: dur(m), cls: "bg-green-400 text-black" };
}

function fmtDT(iso: string) {
  const [d, t] = iso.split("T");
  return `${d.split("-").reverse().join("-")} ${t}`;
}

const field =
  "h-9 rounded-lg border border-neutral-200 bg-white px-3 text-xs outline-none placeholder:text-neutral-400 focus:border-neutral-400";

/* =========================================================
   KOMPONEN KECIL
   ========================================================= */

function StatusBadges({ tahap, status }: { tahap: string; status: Status }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="rounded bg-neutral-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
        {tahap}
      </span>
      <span
        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
          status === "sedang" ? "bg-amber-400 text-black" : "bg-red-500 text-white"
        }`}
      >
        {status === "sedang" ? "Sedang Dikerjakan" : "Belum Dikerjakan"}
      </span>
    </div>
  );
}

function MesinChips({ jenis, kode }: { jenis: string; kode: string }) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] text-neutral-600">
        <Settings2 size={10} />
        {jenis}
      </span>
      <span
        title={KODE_MESIN[kode]}
        className="rounded-md border border-neutral-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-neutral-700"
      >
        {kode}
      </span>
    </div>
  );
}

function ProdukList({ items }: { items: Produk[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((p) => (
        <div key={p.wo} className="rounded-lg border border-neutral-200 p-2">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-semibold leading-tight">
              {p.nama} <span className="font-normal text-neutral-500">{p.qty}</span>
            </p>
            <span className="whitespace-nowrap text-[10px] font-semibold text-blue-700">
              {p.wo}
            </span>
          </div>
          <MesinChips jenis={p.jenisMesin} kode={p.kodeMesin} />
        </div>
      ))}
    </div>
  );
}

function PJBox({ pj }: { pj: Record<string, Person> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200">
      {Object.entries(pj).map(([role, p], i) => (
        <div
          key={role}
          className={`grid grid-cols-[78px_1fr] items-center ${
            i > 0 ? "border-t border-neutral-200" : ""
          }`}
        >
          <span className="px-2 py-1.5 text-[11px] font-semibold">{role}</span>
          <div className="min-h-[28px] border-l border-neutral-200 px-2 py-1">
            {p && (
              <>
                <p className="text-[11px] leading-tight">{p.name}</p>
                <span className="mt-0.5 inline-block rounded bg-sky-400 px-1.5 py-px text-[9px] font-semibold text-white">
                  {fmtDT(p.at)}
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function JenisBadge({ jenis }: { jenis: Retail["jenis"] }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
        jenis === "spot" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-neutral-800"
      }`}
    >
      {jenis === "spot" ? "On The Spot" : "Ambil Nanti"}
    </span>
  );
}

function BayarText({ v }: { v: Retail["bayar"] }) {
  return (
    <span className={`text-xs font-medium ${v === "Lunas" ? "text-emerald-600" : "text-red-600"}`}>
      {v}
    </span>
  );
}

function TerminText({ v }: { v: string }) {
  const cls =
    v === "Lewat Deadline"
      ? "font-semibold text-red-600"
      : v === "Menunggu Invoice"
      ? "font-medium text-amber-600"
      : "text-neutral-800";
  return <span className={`text-xs ${cls}`}>{v}</span>;
}

function DokumenList({ d }: { d: Corp["dokumen"] }) {
  const items = [
    { label: "Surat Jalan", ok: d.suratJalan },
    { label: "Invoice", ok: d.invoice },
    { label: "Salinan PO", ok: d.po },
  ];
  return (
    <div className="flex flex-col gap-1">
      {items.map((i) => (
        <span
          key={i.label}
          className={`inline-flex items-center gap-1.5 text-[11px] ${
            i.ok ? "text-emerald-700" : "text-neutral-300 line-through"
          }`}
        >
          <FileText size={11} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

function Legenda({ count }: { count: number }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
      {[
        ["bg-red-500", "Lewat deadline"],
        ["bg-amber-400", "< 1 jam"],
        ["bg-blue-500", "< 1 hari"],
        ["bg-green-400", "> 1 hari"],
      ].map(([c, l]) => (
        <span key={l} className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${c}`} />
          {l}
        </span>
      ))}
      <span className="ml-auto">
        <span className="font-medium text-black">{count}</span> pesanan
      </span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
      {text}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-neutral-500">{label}</label>
      {children}
    </div>
  );
}

function FilterButtons({ onApply, onReset }: { onApply: () => void; onReset: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onApply}
        className="flex h-9 items-center gap-2 rounded-lg bg-black px-4 text-xs font-medium text-white transition hover:bg-neutral-800"
      >
        <Filter size={14} />
        Filter
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 transition hover:bg-neutral-50"
      >
        <RotateCcw size={13} />
        Reset
      </button>
    </>
  );
}

const TH = "border-b border-neutral-200 px-3 py-3 text-center text-[11px] font-semibold";

/* =========================================================
   DAFTAR RETAIL
   ========================================================= */

const RETAIL_INIT = {
  status: "",
  jenis: "",
  bayar: "",
  dari: "2026-10-01",
  sampai: "2026-10-31",
  q: "",
};

function RetailList({ view }: { view: View }) {
  const [form, setForm] = useState(RETAIL_INIT);
  const [applied, setApplied] = useState(RETAIL_INIT);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof RETAIL_INIT, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  function apply() {
    if (!form.dari || !form.sampai) return setErr("Isi kedua tanggal");
    if (form.dari > form.sampai)
      return setErr("Tanggal mulai tidak boleh lebih besar dari tanggal akhir");
    setErr("");
    setApplied(form);
  }

  function reset() {
    setForm(RETAIL_INIT);
    setApplied(RETAIL_INIT);
    setErr("");
  }

  const rows = useMemo(() => {
    const kw = applied.q.trim().toLowerCase();
    return RETAIL.filter((r) => {
      const tgl = r.waktu.slice(0, 10);
      return (
        (!applied.status || r.status === applied.status) &&
        (!applied.jenis || r.jenis === applied.jenis) &&
        (!applied.bayar || r.bayar === applied.bayar) &&
        tgl >= applied.dari &&
        tgl <= applied.sampai &&
        (!kw ||
          r.nota.toLowerCase().includes(kw) ||
          r.pelanggan.toLowerCase().includes(kw) ||
          r.produk.some((p) => p.wo.toLowerCase().includes(kw)))
      );
    });
  }, [applied]);

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
        <Field label="Status">
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={`${field} w-[160px]`}>
            <option value="">Semua Status</option>
            <option value="belum">Belum Dikerjakan</option>
            <option value="sedang">Sedang Dikerjakan</option>
          </select>
        </Field>
        <Field label="Jenis">
          <select value={form.jenis} onChange={(e) => set("jenis", e.target.value)} className={`${field} w-[140px]`}>
            <option value="">Semua Jenis</option>
            <option value="spot">On The Spot</option>
            <option value="nanti">Ambil Nanti</option>
          </select>
        </Field>
        <Field label="Status Bayar">
          <select value={form.bayar} onChange={(e) => set("bayar", e.target.value)} className={`${field} w-[130px]`}>
            <option value="">Semua</option>
            <option value="Lunas">Lunas</option>
            <option value="Belum Bayar">Belum Bayar</option>
          </select>
        </Field>
        <Field label="Tanggal mulai">
          <input type="date" value={form.dari} max={form.sampai || undefined} onChange={(e) => set("dari", e.target.value)} className={field} />
        </Field>
        <Field label="s/d">
          <input type="date" value={form.sampai} min={form.dari || undefined} onChange={(e) => set("sampai", e.target.value)} className={field} />
        </Field>
        <Field label="Nota / Nama / WO">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={form.q}
              onChange={(e) => set("q", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="Cari nota, nama, atau WO..."
              className={`${field} w-[230px] pl-9`}
            />
          </div>
        </Field>
        <FilterButtons onApply={apply} onReset={reset} />
      </div>

      {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
      <Legenda count={rows.length} />

      {view === "calendar" ? (
        <Empty text="Tampilan kalender belum dibuat." />
      ) : rows.length === 0 ? (
        <Empty text="Tidak ada pesanan yang cocok dengan filter." />
      ) : view === "list" ? (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[1250px] border-collapse text-left text-xs">
            <thead>
              <tr>
                {["#", "Jenis", "Status", "Pelanggan", "Nota", "Waktu Order", "Status Bayar", "Durasi Deadline", "Produk & WO", "Penanggung Jawab"].map((h) => (
                  <th key={h} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const dl = deadline(r.deadlineMenit);
                return (
                  <tr key={r.id} className="border-b border-neutral-100 align-top last:border-0">
                    <td className="px-3 py-3">{i + 1}</td>
                    <td className="px-3 py-3"><JenisBadge jenis={r.jenis} /></td>
                    <td className="px-3 py-3"><StatusBadges tahap={r.tahap} status={r.status} /></td>
                    <td className="px-3 py-3 font-medium">{r.pelanggan}</td>
                    <td className="px-3 py-3 font-semibold">{r.nota}</td>
                    <td className="px-3 py-3">{fmtDT(r.waktu)}</td>
                    <td className="px-3 py-3"><BayarText v={r.bayar} /></td>
                    <td className={`px-3 py-3 text-center text-xs font-medium ${dl.cls}`}>{dl.label}</td>
                    <td className="min-w-[260px] px-3 py-3"><ProdukList items={r.produk} /></td>
                    <td className="min-w-[230px] px-3 py-3"><PJBox pj={r.pj} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const dl = deadline(r.deadlineMenit);
            return (
              <div key={r.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className={`px-4 py-2 text-center text-xs font-semibold ${dl.cls}`}>{dl.label}</div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{r.nota}</p>
                      <p className="text-[11px] text-neutral-500">{r.pelanggan}</p>
                    </div>
                    <JenisBadge jenis={r.jenis} />
                  </div>
                  <div className="mt-3"><ProdukList items={r.produk} /></div>
                  <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                    <StatusBadges tahap={r.tahap} status={r.status} />
                    <div className="text-right">
                      <BayarText v={r.bayar} />
                      <p className="text-[10px] text-neutral-400">{fmtDT(r.waktu)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* =========================================================
   DAFTAR CORPORATE
   ========================================================= */

const CORP_INIT = {
  status: "",
  termin: "",
  cabang: "",
  dari: "2026-10-01",
  sampai: "2026-10-31",
  q: "",
};

function CorporateList({ view }: { view: View }) {
  const [form, setForm] = useState(CORP_INIT);
  const [applied, setApplied] = useState(CORP_INIT);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof CORP_INIT, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  function apply() {
    if (!form.dari || !form.sampai) return setErr("Isi kedua tanggal");
    if (form.dari > form.sampai)
      return setErr("Tanggal mulai tidak boleh lebih besar dari tanggal akhir");
    setErr("");
    setApplied(form);
  }

  function reset() {
    setForm(CORP_INIT);
    setApplied(CORP_INIT);
    setErr("");
  }

  const rows = useMemo(() => {
    const kw = applied.q.trim().toLowerCase();
    return CORP.filter((c) => {
      const tgl = c.tanggal.slice(0, 10);
      return (
        (!applied.status || c.status === applied.status) &&
        (!applied.termin || c.termin.startsWith(applied.termin)) &&
        (!applied.cabang || c.cabang === applied.cabang) &&
        tgl >= applied.dari &&
        tgl <= applied.sampai &&
        (!kw ||
          c.klien.toLowerCase().includes(kw) ||
          c.produk.some((p) => p.wo.toLowerCase().includes(kw)))
      );
    });
  }, [applied]);

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
        <Field label="Status">
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={`${field} w-[160px]`}>
            <option value="">Semua Status</option>
            <option value="belum">Belum Dikerjakan</option>
            <option value="sedang">Sedang Dikerjakan</option>
          </select>
        </Field>
        <Field label="Status Termin">
          <select value={form.termin} onChange={(e) => set("termin", e.target.value)} className={`${field} w-[160px]`}>
            <option value="">Semua Termin</option>
            <option value="Termin">Termin (X hari)</option>
            <option value="Menunggu Invoice">Menunggu Invoice</option>
            <option value="Lewat Deadline">Lewat Deadline</option>
          </select>
        </Field>
        <Field label="Cabang">
          <select value={form.cabang} onChange={(e) => set("cabang", e.target.value)} className={`${field} w-[180px]`}>
            <option value="">Semua Cabang</option>
            {CABANG.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Tanggal mulai">
          <input type="date" value={form.dari} max={form.sampai || undefined} onChange={(e) => set("dari", e.target.value)} className={field} />
        </Field>
        <Field label="s/d">
          <input type="date" value={form.sampai} min={form.dari || undefined} onChange={(e) => set("sampai", e.target.value)} className={field} />
        </Field>
        <Field label="Klien / WO">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={form.q}
              onChange={(e) => set("q", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="Cari klien atau WO..."
              className={`${field} w-[210px] pl-9`}
            />
          </div>
        </Field>
        <FilterButtons onApply={apply} onReset={reset} />
      </div>

      {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
      <Legenda count={rows.length} />

      {view === "calendar" ? (
        <Empty text="Tampilan kalender belum dibuat." />
      ) : rows.length === 0 ? (
        <Empty text="Tidak ada pesanan yang cocok dengan filter." />
      ) : view === "list" ? (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[1350px] border-collapse text-left text-xs">
            <thead>
              <tr>
                {["#", "Status", "Klien", "Tanggal Order", "Status Termin", "Durasi Deadline", "Produk & WO", "Cabang", "Penanggung Jawab", "Dokumen"].map((h) => (
                  <th key={h} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => {
                const dl = deadline(c.deadlineMenit);
                return (
                  <tr key={c.id} className="border-b border-neutral-100 align-top last:border-0">
                    <td className="px-3 py-3">{i + 1}</td>
                    <td className="px-3 py-3"><StatusBadges tahap={c.tahap} status={c.status} /></td>
                    <td className="px-3 py-3 font-medium">{c.klien}</td>
                    <td className="px-3 py-3">{fmtDT(c.tanggal)}</td>
                    <td className="px-3 py-3"><TerminText v={c.termin} /></td>
                    <td className={`px-3 py-3 text-center text-xs font-medium ${dl.cls}`}>{dl.label}</td>
                    <td className="min-w-[270px] px-3 py-3"><ProdukList items={c.produk} /></td>
                    <td className="px-3 py-3">{c.cabang}</td>
                    <td className="min-w-[230px] px-3 py-3"><PJBox pj={c.pj} /></td>
                    <td className="px-3 py-3"><DokumenList d={c.dokumen} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => {
            const dl = deadline(c.deadlineMenit);
            return (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className={`px-4 py-2 text-center text-xs font-semibold ${dl.cls}`}>{dl.label}</div>
                <div className="p-4">
                  <p className="text-sm font-semibold">{c.klien}</p>
                  <p className="text-[11px] text-neutral-500">
                    {c.cabang} · {fmtDT(c.tanggal)}
                  </p>
                  <div className="mt-1"><TerminText v={c.termin} /></div>
                  <div className="mt-3"><ProdukList items={c.produk} /></div>
                  <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                    <StatusBadges tahap={c.tahap} status={c.status} />
                    <DokumenList d={c.dokumen} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* =========================================================
   HALAMAN UTAMA WORKFLOW
   ========================================================= */

export default function WorkflowPage() {
  const [tab, setTab] = useState<Tab>("Daftar Pesanan");
  const [view, setView] = useState<View>("list");
  const [tipe, setTipe] = useState<Tipe>("retail");
  const [qProduksi, setQProduksi] = useState("");

  const produksiRows = PRODUKSI.filter((p) => {
    const kw = qProduksi.trim().toLowerCase();
    return !kw || p.nota.toLowerCase().includes(kw) || p.wo.toLowerCase().includes(kw);
  });

  const toggles: { id: View; icon: typeof List; label: string }[] = [
    { id: "list", icon: List, label: "Tampilan daftar" },
    { id: "grid", icon: LayoutGrid, label: "Tampilan kartu" },
    { id: "calendar", icon: CalendarDays, label: "Tampilan kalender" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{tab}</h2>
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
          {toggles.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              onClick={() => setView(id)}
              className={`flex size-7 items-center justify-center rounded-md transition ${
                view === id ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 inline-flex rounded-lg border border-neutral-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-xs transition ${
              tab === t ? "bg-neutral-900 font-medium text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ===== DAFTAR PESANAN ===== */}
      {tab === "Daftar Pesanan" && (
        <>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] font-medium text-neutral-500">Tipe</span>
            <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1">
              {(["retail", "corporate"] as Tipe[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipe(t)}
                  className={`rounded-md px-4 py-1.5 text-xs capitalize transition ${
                    tipe === t ? "bg-neutral-900 font-medium text-white" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {t === "retail" ? "Retail" : "Corporate (B2B)"}
                </button>
              ))}
            </div>
          </div>

          {tipe === "retail" ? <RetailList view={view} /> : <CorporateList view={view} />}
        </>
      )}

      {/* ===== PROSES PRODUKSI ===== */}
      {tab === "Proses Produksi" && (
        <>
          <div className="mt-4 flex items-center gap-3">
            <div className="relative w-full max-w-[380px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={qProduksi}
                onChange={(e) => setQProduksi(e.target.value)}
                placeholder="Cari nota atau WO..."
                className={`${field} w-full pl-9`}
              />
            </div>
          </div>

          <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[600px] text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  {["Nota", "Aksi", "Work Order", "Priority", "Date", "Owner"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {produksiRows.map((p) => (
                  <tr key={p.wo} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3 text-neutral-600">{p.nota}</td>
                    <td className="px-4 py-3">
                      <button type="button" aria-label="Lihat detail" className="text-neutral-500 hover:text-black">
                        <Eye size={15} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.wo}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.priority}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.date}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.owner}</td>
                  </tr>
                ))}
                {produksiRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">Tidak ada data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ===== STATUS & TRACKING ===== */}
      {tab === "Status & Tracking Pengajuan" && (
        <Empty text="Halaman ini belum dibuat." />
      )}
    </div>
  );
}