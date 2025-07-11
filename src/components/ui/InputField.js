export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="flex justify-center">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-64 sm:w-80 lg:w-[400px] px-4 py-2 text-paragraphLg text-primary font-paragraph bg-mist rounded-xl border-2 border-mist shadow-md shadow-steelBlue focus:outline-none focus:border-primary transition"
      />
    </div>
  );
}
