# Cirro - File Manager (React + Supabase)

Cirro is a modern file manager built with **React**, **TailwindCSS**, and **Supabase**. It allows users to authenticate, upload, preview, download, and manage their files with a clean, responsive, and minimal UI.

---

## Features

- User authentication (login/signup)  
- Upload files
- Preview for images, PDFs, and videos  
- Download, copy link, view details, and delete options  
- File type icons (e.g. PDF, DOCX, ZIP)  
- Real-time tab sync via `BroadcastChannel`  
- Fullscreen preview modal  
- Mobile responsive design  
- Built with modular React components 

---

## Tech Stack

| Tool        | Purpose                     |
|-------------|-----------------------------|
| **React**   | Frontend framework (SPA)     |
| **Supabase**| Auth + File storage + RLS DB |
| **Tailwind**| Utility-first styling        |
| **Vercel**  | Deployment                   |

---

## Live Demo

**[View the App](https://storage-app-gilt.vercel.app/)**  
*(Optimized for desktop and mobile)*

---

## Clone the repo

```bash
git clone https://github.com/your-username/storage-app.git
cd storage-app
npm install
