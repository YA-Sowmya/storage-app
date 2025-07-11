import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Button from "../components/ui/Button";
import Logo from "../components/assets/Logo0.png";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/allfiles", label: "All Files" },
  { to: "/documents", label: "Documents" },
  { to: "/images", label: "Images" },
  { to: "/media", label: "Media" },
  { to: "/others", label: "Others" },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id === "sidebar-backdrop") onClose();
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  return (
    <>
      {isOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-52 sm:w-64 bg-darkBlue shadow-md z-40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:z-10
        `}
      >
        <div className="p-4 flex flex-col items-center  space-y-10">
          <img src={Logo} alt="Logo" className="w-32 sm:w-40" />

          <div className="flex flex-col gap-6  w-full items-center">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <NavLink key={link.to} to={link.to} onClick={onClose}>
                  <Button variant={isActive ? "primary" : "secondary"}>
                    {link.label}
                  </Button>
                </NavLink>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
