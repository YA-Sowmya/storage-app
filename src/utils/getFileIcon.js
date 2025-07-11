export function getFileIcon(extension = "") {
  const ext = extension.toLowerCase();

  const iconMap = {
    pdf: { icon: "bi-file-earmark-pdf" },
    doc: { icon: "bi-file-earmark-word" },
    docx: { icon: "bi-file-earmark-word" },
    xls: { icon: "bi-file-earmark-excel" },
    xlsx: { icon: "bi-file-earmark-excel" },
    ppt: { icon: "bi-file-earmark-ppt" },
    jpg: { icon: "bi-file-earmark-image" },
    jpeg: { icon: "bi-file-earmark-image" },
    png: { icon: "bi-file-earmark-image" },
    gif: { icon: "bi-file-earmark-image" },
    mp4: { icon: "bi-file-earmark-play" },
    mp3: { icon: "bi-file-earmark-music" },
    zip: { icon: "bi-file-earmark-zip" },
    js: { icon: "bi-filetype-js" },
    html: { icon: "bi-filetype-html" },
    css: { icon: "bi-filetype-css" },
    txt: { icon: "bi-file-earmark-text" },
  };

  const fallback = {
    icon: "bi-file-earmark",
    color: "text-paleBlue",
  };
  const fileData = iconMap[ext] || fallback;

  return <i className={`bi ${fileData.icon} text-xl ${fileData.color}`}></i>;
}
