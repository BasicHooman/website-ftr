import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const RenderContent = ({ content }) => {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Image],
    content: content, // Tiptap JSON from DB
  });

  if (!editor) return null;

  return <EditorContent editor={editor} className="editor-display" />;
};

export default RenderContent;
