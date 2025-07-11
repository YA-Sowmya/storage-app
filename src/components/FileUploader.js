import { useState } from "react";
import { supabase } from "./supabaseClient";
import Modal from "./ui/Modal";
const getCategory = (type) => {
  if (type.startsWith("image/")) return "images";
  if (type.startsWith("video/") || type.startsWith("audio/")) return "media";
  if (type === "application/pdf" || type.includes("document"))
    return "documents";
  return "others";
};

const FileUploader = ({ userId, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    setMessage("");

    const extension = file.name.split(".").pop();
    const type = file.type;
    const size = file.size;
    const category = getCategory(type);
    const originalName = file.name;

    const baseName = originalName.replace(/\.[^/.]+$/, "");

    const { data: existingFiles, error: fetchError } = await supabase
      .from("file_metadata")
      .select("display_name")
      .eq("user_id", userId)
      .ilike("display_name", `${baseName}%`);

    let displayName = originalName;
    if (!fetchError && existingFiles.length > 0) {
      const usedNames = existingFiles.map((f) => f.display_name);
      let counter = 1;

      while (usedNames.includes(displayName)) {
        displayName = `${baseName} (${counter}).${extension}`;
        counter++;
      }
    }

    const uniqueName = `${Date.now()}_${originalName}`;

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(uniqueName, file);

    if (uploadError) {
      console.log(uploadError);
      setUploading(false);
      setMessage("Upload failed. Please try again.");
      return;
    }

    const { error: metaError } = await supabase.from("file_metadata").insert([
      {
        user_id: userId,
        file_path: uniqueName,
        display_name: displayName,
        type,
        extension,
        size,
        category,
      },
    ]);

    if (metaError) {
      setMessage("Metadata insert failed.");
    } else {
      setMessage("Upload successful!");
      const channel = new BroadcastChannel("file_upload_channel");
      channel.postMessage("file_uploaded");
      onUploaded?.();
      setTimeout(() => onClose(), 800);
    }

    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center  items-center">
      <Modal isOpen={true} onClose={onClose} title="Upload a File">
        <div className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border text-primary text-mist border-primary p-2 rounded text-paragraph"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1 text-paragraphLg font-paragraph bg-black opacity-60 text-paleBlue hover:text-primary rounded-full"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-1 text-paragraphLg font-paragraph bg-primary text-mist hover:text-paleBlue rounded-full"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {message && (
            <p className=" text-center text-paragraph text-gray-600">
              {message}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FileUploader;
