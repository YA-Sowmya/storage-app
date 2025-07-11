export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-darkBlue rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-heading1 text-paleBlue font-heading font-bold mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-paleBlue hover:text-primary"
        >
          <i className="bi bi-x-square-fill"></i>
        </button>
      </div>
    </div>
  );
}
