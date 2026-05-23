export default function ActionTile({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full rounded-[26px] bg-[#f4f1fa] p-4 text-center">
      <Icon className="mx-auto h-6 w-6 text-[#6b2cff]" />
      <p className="mt-2 text-sm font-black">{label}</p>
    </button>
  );
}
