import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../components/supabaseClient";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from("file_metadata")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setFiles(data || []);
    else console.error("Error fetching files:", error.message);
  };

  useEffect(() => {
    fetchFiles();
    const channel = new BroadcastChannel("file_upload_channel");
    channel.onmessage = (event) => {
      if (event.data === "file_uploaded") {
        fetchFiles();
      }
    };
    return () => channel.close();
  }, []);

  const filesWithDisplayName = useMemo(() => {
    const seen = {};
    return files.map((file) => {
      const parts = file.file_path.split("_");
      const originalName = parts.slice(1).join("_") || file.file_path;
      let display = originalName;

      if (!seen[originalName]) {
        seen[originalName] = 1;
      } else {
        const count = seen[originalName]++;
        const dotIndex = originalName.lastIndexOf(".");
        display =
          dotIndex !== -1
            ? `${originalName.slice(0, dotIndex)}(${count})${originalName.slice(
                dotIndex
              )}`
            : `${originalName}(${count})`;
      }

      return { ...file, displayName: display };
    });
  }, [files]);

  return (
    <AppContext.Provider value={{ files: filesWithDisplayName, fetchFiles }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
