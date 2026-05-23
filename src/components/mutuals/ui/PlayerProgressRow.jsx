import { cx } from "../../../utils/ui";
import Avatar from "./Avatar";

export default function PlayerProgressRow({ member }) {
  const statusCopy =
    member.status === "done"
      ? "Done"
      : member.status === "guessing"
      ? `Guessing ${member.guessed}/9`
      : member.status === "stuck"
      ? `Answered ${member.answered}/8`
      : "Not started";
  const color =
    member.status === "done"
      ? "bg-[#35c58a]"
      : member.status === "guessing"
      ? "bg-[#ffbd00]"
      : member.status === "stuck"
      ? "bg-[#ff4f9a]"
      : "bg-black/20";
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f7f3ff] px-3 py-2">
      <div className="flex items-center gap-3">
        <Avatar member={member} size="sm" />
        <div>
          <p className="text-sm font-black">{member.name}</p>
          <p className="text-[11px] font-bold text-black/45">{statusCopy}</p>
        </div>
      </div>
      <span className={cx("h-3 w-3 rounded-full", color)} />
    </div>
  );
}
