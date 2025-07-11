import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Modal from "./ui/Modal";
import { getFileIcon } from "../utils/getFileIcon";

export default function FileRow({ file, onRefresh }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [unsupportedModal, setUnsupportedModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [copied, setCopied] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const getDisplayName = () =>
    file.display_name ||
    file.file_path?.split("_").slice(1).join("_") ||
    file.file_path;

  const handleDownload = async () => {
    const { data } = await supabase.storage
      .from("files")
      .createSignedUrl(file.file_path, 60);
    if (data?.signedUrl) {
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = getDisplayName();
      a.click();
    }
  };

  const handlePreview = async () => {
    setPreviewing(true);
    const { data } = await supabase.storage
      .from("files")
      .createSignedUrl(file.file_path, 60);
    setPreviewing(false);

    if (!data?.signedUrl) return;

    setPreviewUrl(data.signedUrl);

    if (
      file.type?.startsWith("image/") ||
      file.type?.startsWith("video/") ||
      file.type === "application/pdf"
    ) {
      setPreviewModal(true);
    } else {
      setUnsupportedModal(true);
    }
  };

  const handleCopyLink = async () => {
    const { data } = await supabase.storage
      .from("files")
      .createSignedUrl(file.file_path, 60);
    if (data?.signedUrl) {
      navigator.clipboard.writeText(data.signedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  const handleDelete = async () => {
    await supabase.storage.from("files").remove([file.file_path]);
    await supabase
      .from("file_metadata")
      .delete()
      .eq("file_path", file.file_path);
    onRefresh?.();
    setConfirmModal(false);
  };

  return (
    <>
      <div
        className="bg-darkBlue rounded-full px-2 sm:px-8 py-2 shadow-sm shadow-steelBlue relative transition text-paleBlue hover:shadow-md hover:shadow-steelBlue hover:bg-opacity-50 cursor-pointer"
        onClick={handlePreview}
      >
        <div className="flex justify-between items-center gap-4 w-full">
          <div className="flex items-center gap-3 truncate w-full">
            <span>{getFileIcon(file.extension)}</span>
            <span className="truncate text-paragraphLg text-mist">
              {getDisplayName()}
            </span>
          </div>
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-mist min-w-[60px] text-paragraph">
              {(file.size / 1024).toFixed(2)} KB
            </span>
            <div className="relative" ref={menuRef}>
              <button
                className="text-paleBlue"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 bg-black border border-steelBlue text-heading3 text-paleBlue rounded-md shadow-lg w-36 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-steelBlue"
                  >
                    Download
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailsModal(true);
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-steelBlue"
                  >
                    Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink();
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-steelBlue"
                  >
                    Copy link
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmModal(true);
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-steelBlue"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {previewing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-paleBlue"></div>
        </div>
      )}

      {previewModal && previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-darkBlue rounded-xl shadow-lg p-4 overflow-auto">
            <button
              onClick={() => setPreviewModal(false)}
              className="absolute top-4 right-5 text-mist text-2xl hover:text-paleBlue"
              aria-label="Close Preview"
            >
              <i className="bi bi-x-lg" />
            </button>
            <h2 className="text-heading2 sm:text-heading1 font-bold font-heading text-mist text-center mb-4">
              Preview
            </h2>
            {file.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain rounded"
              />
            ) : file.type.startsWith("video/") ? (
              <video
                controls
                src={previewUrl}
                className="w-full h-full object-contain rounded"
              />
            ) : (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                className="w-full h-[600px] rounded"
              />
            )}
          </div>
        </div>
      )}

      {/* Unsupported File Modal */}
      <Modal
        isOpen={unsupportedModal}
        onClose={() => setUnsupportedModal(false)}
        title="Preview Not Available"
      >
        <div className="text-mist text-center space-y-4 text-paragraphLg">
          <p>This file type cannot be previewed.</p>
          <button
            onClick={handleDownload}
            className="px-4 py-1 bg-primary text-paragraphLg font-paragraph text-mist hover:text-paleBlue rounded-full"
          >
            Download File
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Delete File?"
      >
        <p className="mb-4 text-paragraphLg font-paragraph text-mist">
          Are you sure you want to delete <strong>{getDisplayName()}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setConfirmModal(false)}
            className="px-4 py-1 text-paragraphLg font-paragraph bg-black opacity-60 text-paleBlue hover:text-primary rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-1 bg-red-800 text-paragraphLg font-paragraph text-mist hover:text-paleBlue rounded-full"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* File Details */}
      <Modal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        title="File Details"
      >
        <div className="text-paragraphLg font-paragraph text-mist space-y-1">
          <p>
            <strong>Name:</strong> {getDisplayName()}
          </p>
          <p>
            <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
          <p>
            <strong>Type:</strong> {file.type || "Unknown"}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(file.created_at).toLocaleString()}
          </p>
        </div>
      </Modal>

      {/* Link Copied Popover */}
      {copied && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-mist text-paragraphLg px-3 py-1 rounded shadow-md z-50">
          Link copied!
        </div>
      )}
    </>
  );
}
