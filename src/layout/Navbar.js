import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../components/supabaseClient";
import Logo from "../components/assets/Logo.png";
import FileUploader from "../components/FileUploader";
import Modal from "../components/ui/Modal";

export default function Navbar({ toggleSidebar }) {
  const [showUploader, setShowUploader] = useState(false);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate("/");
      } else {
        setUser(data.user);
      }
    };
    getSession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const fetchMatches = async () => {
      if (!query.trim()) {
        setMatches([]);
        return;
      }

      const { data, error } = await supabase
        .from("file_metadata")
        .select("*")
        .ilike("file_path", `%${query}%`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error) setMatches(data);
    };

    const debounce = setTimeout(() => {
      fetchMatches();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handlePreview = async (file) => {
    const { data } = await supabase.storage
      .from("files")
      .createSignedUrl(file.file_path, 60);

    if (data?.signedUrl) {
      setPreviewUrl(data.signedUrl);
      setPreviewFile(file);
    }
  };

  const isPreviewable = (type) =>
    type?.startsWith("image/") ||
    type === "application/pdf" ||
    type?.startsWith("video/");

  return (
    <>
      <header className="flex sticky top-0 z-50 justify-between px-4 py-3 bg-darkBlue w-full shadow-darkBlue gap-2">
        <div className="flex items-center text-mist text-heading1 gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-heading2"
            aria-label="Toggle Sidebar"
          >
            <i className="bi bi-view-list"></i>
          </button>
          <Link to="/" className="block">
            <img
              src={Logo}
              alt="Cirro Icon"
              className="block lg:hidden w-[48px] h-auto"
            />
          </Link>
        </div>

        <div className="flex-grow flex flex-col justify-center relative max-w-[900px] z-50">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            placeholder="Search files..."
            className="w-full px-4 py-1 sm:py-2 bg-black border shadow-sm shadow-steelBlue border-steelBlue rounded-full text-paragraphLg text-mist font-paragraph focus:outline-none focus:ring-2 focus:ring-paleBlue transition"
          />

          {showResults && matches.length > 0 && (
            <div className="absolute top-full mt-1 bg-darkBlue border border-steelBlue rounded-md w-full text-mist shadow-lg max-h-60 overflow-y-auto">
              {matches.map((file) => (
                <div
                  key={file.id}
                  onClick={() => {
                    handlePreview(file);
                    setQuery("");
                    setMatches([]);
                    setShowResults(false);
                  }}
                  className="px-4 py-2 hover:bg-steelBlue cursor-pointer truncate"
                >
                  {file.file_path.replace(/^\d+_/, "")}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center text-heading1 gap-2 shrink-0">
          <button
            title="Upload"
            onClick={() => setShowUploader(true)}
            className="text-primary px-1 hover:text-mist text-center"
          >
            <i className="bi bi-plus-square-fill"></i>
          </button>

          <button
            title="Logout"
            onClick={handleLogout}
            className="text-mist px-1 hover:text-primary text-center"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </header>

      {showUploader && user && (
        <FileUploader userId={user.id} onClose={() => setShowUploader(false)} />
      )}

      {previewUrl && isPreviewable(previewFile?.type) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center px-4 z-50">
          <div className="relative w-full max-w-6xl h-[90vh] bg-darkBlue rounded-xl shadow-lg p-4 overflow-auto">
            <button
              onClick={() => {
                setPreviewUrl(null);
                setPreviewFile(null);
              }}
              className="absolute top-4 right-5 text-mist text-2xl hover:text-paleBlue"
              aria-label="Close Preview"
            >
              <i className="bi bi-x-lg" />
            </button>

            <h2 className="text-heading2 sm:text-heading1 font-bold text-mist text-center mb-4">
              Preview
            </h2>

            <div className="w-full h-full flex items-center justify-center">
              {previewFile.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : previewFile.type.startsWith("video/") ? (
                <video
                  controls
                  src={previewUrl}
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : previewFile.type === "application/pdf" ? (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  className="w-full h-[600px] rounded"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
