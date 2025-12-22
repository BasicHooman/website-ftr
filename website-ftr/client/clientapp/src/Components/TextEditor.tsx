import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {BubbleMenu} from "@tiptap/react/menus";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { supabase } from "../lib/supabaseClient";
import type {JSONContent} from "@tiptap/react";
import "../styles/EditorStyles.css";

interface TextEditorProps {
  initialContent?: JSONContent;
  onChange: (content: JSONContent) => void;
  fillerText: string;
}

const TextEditor = ({ initialContent, onChange, fillerText }: TextEditorProps) => {
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("article-images")
      .upload(`editor/${fileName}`, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("article-images")
      .getPublicUrl(`editor/${fileName}`);

    return data.publicUrl;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Strike,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      FileHandler.configure({
        allowedMimeTypes: ["image/*"],
        onDrop: async (_editor, files) => {
          const file = files[0];
          if (!file) return;
          const url = await uploadImageToSupabase(file);
          editor?.chain().focus().setImage({ src: url }).run();
        },
        onPaste: async (_editor, files) => {
          const file = files[0];
          if (!file) return;
          const url = await uploadImageToSupabase(file);
          editor?.chain().focus().setImage({ src: url }).run();
        },
      }),
    ],
    content: initialContent || `<p>${fillerText}</p>`,
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div>
        <div className="bg-[#00C8FFFF] editor-wrapper" style={{fontFamily: "Times New Roman"}}>
            <div className="editor-surface">
               <EditorContent 
                    className="editor-content"
                    editor={editor}
                />
            </div>
        </div>

      <BubbleMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>S</s>
        </button>

        <button
          onClick={() => {
            const url = window.prompt("URL");
            if (!url) return;
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({
                href: url.startsWith("http") ? url : `https://${url}`,
              })
              .run();
          }}
        >
          <LinkIcon fontSize="small" />
        </button>

        <button onClick={() => editor.chain().focus().unsetLink().run()}>
          <LinkOffIcon fontSize="small" />
        </button>

        <label>
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImageToSupabase(file);
              editor.chain().focus().setImage({ src: url }).run();
            }}
          />
          <ImageIcon fontSize="small" />
        </label>
      </BubbleMenu>
    </div>
  );
};

export default TextEditor;
