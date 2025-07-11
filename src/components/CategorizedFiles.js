import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import FileRow from "./FileRow";

export default function CategorizedFiles({ category }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();
  }, []);

  const fetchFiles = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("file_metadata")
      .select("*")
      .eq("user_id", user.id)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (!error) setFiles(data);
    else console.error("Error fetching files:", error.message);

    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchFiles();
  }, [user, category]);

  useEffect(() => {
    const channel = new BroadcastChannel("file_upload_channel");

    channel.onmessage = (event) => {
      if (event.data === "file_uploaded") {
        fetchFiles();
      }
    };

    return () => channel.close();
  }, [user, category]);

  return (
    <div className="p-4">
      <h1 className="text-mist font-heading text-heading1 md:text-heading0 font-bold capitalize mb-4 ml-2">
        {category}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-paleBlue" />
        </div>
      ) : files.length === 0 ? (
        <p className="text-gray-500 ml-2">No {category} found.</p>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <FileRow key={file.id} file={file} onRefresh={fetchFiles} />
          ))}
        </div>
      )}
    </div>
  );
}
