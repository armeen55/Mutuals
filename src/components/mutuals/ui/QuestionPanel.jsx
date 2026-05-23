import { cx } from "../../../utils/ui";

export default function QuestionPanel({ question, options, selected }) {
  return (
    <div className="mt-8 rounded-[36px] bg-[#fff2df] p-6">
      <p className="text-xs font-black uppercase tracking-widest text-black/35">Question</p>
      <h3 className="mt-3 text-4xl font-black leading-none">{question}</h3>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {options.map((option, i) => (
          <button
            key={option}
            className={cx(
              "flex items-center gap-3 rounded-3xl p-5 text-left text-sm font-black shadow-sm",
              i === selected ? "bg-[#ff4f9a] text-white" : "bg-white text-black"
            )}
          >
            <span
              className={cx(
                "grid h-8 w-8 place-items-center rounded-full text-xs",
                i === selected ? "bg-white text-[#ff4f9a]" : "bg-[#f3efff] text-[#6b2cff]"
              )}
            >
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
