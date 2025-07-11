import { useEffect, useState, useCallback } from "react";
import { supabase } from "../components/supabaseClient";
import FileUploader from "../components/FileUploader";
import FileRow from "../components/FileRow";

export default function AllFiles() {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchFiles = useCallback(
    async (showLoader = false) => {
      if (!user) return;
      if (showLoader) setLoading(true);

      const { data, error } = await supabase
        .from("file_metadata")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setFiles(data);
      if (showLoader) setLoading(false);
    },
    [user]
  );

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();

    const channel = new BroadcastChannel("file_upload_channel");
    channel.onmessage = (event) => {
      if (event.data === "file_uploaded") {
        fetchFiles(false);
      }
    };

    return () => channel.close();
  }, [fetchFiles]);

  useEffect(() => {
    if (user) {
      fetchFiles(true).then(() => setInitialLoad(false));
    }
  }, [user, fetchFiles]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center ml-2 mb-4">
        <h1 className="text-mist font-heading text-heading1 md:text-heading0 font-bold">
          All Files
        </h1>
      </div>

      {initialLoad && loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-paleBlue"></div>
        </div>
      ) : files.length === 0 ? (
        <p className="text-gray-500 ml-2">No files uploaded yet.</p>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onRefresh={() => fetchFiles(false)}
            />
          ))}
        </div>
      )}

      {showModal && user && (
        <FileUploader
          userId={user.id}
          onClose={() => setShowModal(false)}
          onUploaded={() => fetchFiles(false)}
        />
      )}
    </div>
  );
}
