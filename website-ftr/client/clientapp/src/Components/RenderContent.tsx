import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

interface RenderContentProps {
  content?: JSONContent;
}

const RenderContent: React.FC<RenderContentProps> = ({ content }) => {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Image],
    content: content, // Tiptap JSON from DB
  });

  if (!editor || !content) return null;

  return <EditorContent editor={editor} className="editor-display" />;
};

export default RenderContent;