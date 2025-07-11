export default function Card({ icon, title, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div>
          <h4 className="text-heading3 font-garnet">{title}</h4>
          <p className="text-sm text-gray-500 font-lovato">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
