"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-2xl border-2 border-slate-100" />
});

export default function RichTextEditor({ value, onChange, placeholder }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "link",
  ];

  return (
    <div className="rich-text-editor @container">
      <QuillEditor
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        className="bg-white rounded-2xl overflow-hidden border-2 border-slate-50 focus-within:border-green-500 transition-all text-sm font-medium"
      />
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          background: #f8fafc;
          border-bottom: 2px solid #f1f5f9 !important;
          padding: 12px 16px !important;
          border-radius: 16px 16px 0 0;
        }
        .ql-container.ql-snow {
          border: none !important;
          min-height: 250px;
          font-family: inherit !important;
          font-size: 14px !important;
        }
        .ql-editor {
          padding: 20px !important;
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8 !important;
          font-style: normal !important;
          font-weight: 600 !important;
          left: 20px !important;
        }
      `}</style>
    </div>
  );
}
