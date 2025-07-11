import { useEffect, useState } from "react";
import { supabase } from "../components/supabaseClient";
import FileRow from "../components/FileRow";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCategory = (type) => {
    if (type?.startsWith("image/")) return "images";
    if (type?.startsWith("video/") || type?.startsWith("audio/"))
      return "media";
    if (
      type === "application/pdf" ||
      type?.includes("document") ||
      type?.includes("msword") ||
      type?.includes("presentation") ||
      type?.includes("spreadsheet")
    )
      return "documents";
    return "others";
  };

  const fetchUserAndFiles = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    setUser(currentUser);
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("file_metadata")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (!error) setFiles(data);
    else console.error("Error fetching files:", error.message);

    setLoading(false);
  };

  useEffect(() => {
    fetchUserAndFiles();

    const channel = new BroadcastChannel("file_upload_channel");
    channel.onmessage = (event) => {
      if (event.data === "file_uploaded") {
        fetchUserAndFiles();
      }
    };

    return () => channel.close();
  }, []);

  const categories = {
    documents: [],
    images: [],
    media: [],
    others: [],
  };

  let totalSize = 0;
  files.forEach((file) => {
    const cat = getCategory(file.type);
    categories[cat]?.push(file);
    totalSize += file.size || 0;
  });

  const totalUsedGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
  const totalQuotaGB = 2;
  const usagePercent = ((totalUsedGB / totalQuotaGB) * 100).toFixed(0);

  return (
    <div className="p-2 md:p-6 grid grid-cols-1 lg:grid-cols-7 gap-6">
      <div className="lg:col-span-4 space-y-10">
        <div className="bg-darkBlue text-mist py-6 px-6 rounded-xl shadow-md shadow-steelBlue flex flex-col sm:flex-row items-center sm:items-center gap-8 sm:gap-12">
          <div className="relative w-52 h-52 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="75"
                stroke="#485F88"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="75"
                stroke="#9DACCC"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="471"
                strokeDashoffset={`${471 - (471 * usagePercent) / 100}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-heading2 font-paragraph font-bold text-paleBlue">
                {usagePercent}% Used
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center h-full text-center sm:text-left">
            <h2 className="text-heading1 md:text-heading0 font-bold font-heading text-mist">
              Storage Used
            </h2>
            <p className="text-paragraph text-gray-400">
              {(totalQuotaGB - totalUsedGB).toFixed(2)} GB available
            </p>
            <p className="text-xs text-gray-500">Total: {totalQuotaGB} GB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 md:gap-8">
          {[
            {
              name: "Documents",
              route: "/documents",
              icon: (
                <i className="bi bi-file-earmark-text-fill rounded-full px-2 py-1 shadow-sm shadow-steelBlue" />
              ),
              count: categories.documents.length,
            },
            {
              name: "Images",
              route: "/images",
              icon: (
                <i className="bi bi-file-image-fill shadow-sm shadow-steelBlue rounded-full px-2 py-1" />
              ),
              count: categories.images.length,
            },
            {
              name: "Media",
              route: "/media",
              icon: (
                <i className="bi bi-file-play-fill shadow-sm shadow-steelBlue rounded-full px-2 py-1" />
              ),
              count: categories.media.length,
            },
            {
              name: "Others",
              route: "/others",
              icon: (
                <i className="bi bi-file-earmark-fill shadow-sm rounded-full px-2 py-1 shadow-steelBlue" />
              ),
              count: categories.others.length,
            },
          ].map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(cat.route)}
              className="bg-darkBlue text-mist p-4 rounded-xl shadow-md shadow-steelBlue flex items-center gap-4 cursor-pointer hover:bg-primary transition"
            >
              <div className="text-paleBlue text-3xl  md:text-4xl">
                {cat.icon}
              </div>
              <div>
                <p className="text-mist font-heading text-heading2 md:text-heading1 font-bold">
                  {cat.name}
                </p>
                <p className="text-paragraph text-gray-400">
                  {cat.count} file(s)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-darkBlue p-6 rounded-xl shadow-md shadow-steelBlue lg:col-span-3 h-fit min-h-[300px] lg:min-h-[500px]">
        <h2 className="text-mist font-heading text-heading2 md:text-heading1 font-bold mb-4">
          Recent Files
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-paleBlue" />
          </div>
        ) : files.length === 0 ? (
          <p className="text-gray-400">No files uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {files.slice(0, 5).map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onRefresh={fetchUserAndFiles}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
