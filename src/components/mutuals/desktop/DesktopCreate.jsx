import { QrCode } from "lucide-react";
import { ROOM_CODE } from "../../../data/mutualsDemoData";

export default function DesktopCreate() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-5">
      <div className="rounded-[34px] bg-[#f3efff] p-6">
        <p className="text-xs font-black uppercase tracking-widest text-black/35">Spice</p>
        <p className="mt-4 text-4xl font-black text-[#ff4f9a]">Medium</p>
        <p className="mt-2 text-sm font-bold text-black/50">Mild / Medium / Unhinged</p>
      </div>
      <div className="rounded-[34px] bg-[#fff3c4] p-6">
        <p className="text-xs font-black uppercase tracking-widest text-black/35">Pack</p>
        <p className="mt-4 text-4xl font-black">College</p>
        <p className="mt-2 text-sm font-bold text-black/50">Inside joke: Tahoe trip</p>
      </div>
      <div className="rounded-[34px] bg-black p-6 text-white">
        <QrCode className="h-20 w-20" />
        <p className="mt-4 text-sm font-black">Optional live code {ROOM_CODE}</p>
      </div>
    </div>
  );
}
