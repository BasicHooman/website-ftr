import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { JSONContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";

import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import LinkOffIcon from "@mui/icons-material/LinkOff";

import { supabase } from "../lib/supabaseClient";

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState<JSONContent | null>(null);
  const [authorOverride, setAuthorOverride] = useState("");

  const [displayimg, setDisplayimg] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [message, setMessage] = useState("");

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const name = `${crypto.randomUUID()}.${ext}`;
    const path = `thumbnails/${name}`;

    const { error } = await supabase.storage
      .from("article-images")
      .upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("article-images")
      .getPublicUrl(path);

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
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
        onDrop: async (editor, files, pos) => {
          const file = files[0];
          if (!file) return;
          const url = await uploadImageToSupabase(file);
          editor
            .chain()
            .focus()
            .insertContentAt(pos, {
              type: "image",
              attrs: { src: url },
            })
            .run();
        },
        onPaste: async (editor, files) => {
          const file = files[0];
          if (!file) return;
          const url = await uploadImageToSupabase(file);
          editor.chain().focus().setImage({ src: url }).run();
        },
      }),
    ],
    content: "<p>Hello World!</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
  });

  const onInlineImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
    };
    reader.readAsDataURL(file);

    const url = await uploadImageToSupabase(file);
    editor
      .chain()
      .focus()
      .updateAttributes("image", { src: url })
      .run();
  };

  const handleSubmit = async () => {
    if (!editor) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to post an article.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      setMessage("No profile found for this user.");
      return;
    }
    if (!profile.full_name) {
      setMessage("Profile is missing a full name.");
      return;
    }

    const { error } = await supabase.from("articles").insert({
      title,
      author_id: profile.id,
      author_override: profile.full_name,
      content,
      image_url: displayimg,
      genre,
      summary,
    });

    if (error) {
      setMessage("Failed to submit article.");
      return;
    }

    setMessage("Article submitted successfully!");
  };

  if (!editor) return null;

  return (
    <>
      <title>Creative Corner</title>

      <div className="containerr cont">
        <div className="text-start">
          <label htmlFor="thumbnail-upload" className="thumbnail">
            <div className="d-flex justify-content-center align-items-center">
              <div className="mx-1" style={{ paddingBottom: ".1rem" }}>
                <ImageIcon fontSize="small" />
              </div>
              <div className="mx-1">Upload Thumbnail</div>
            </div>
          </label>

          {thumbnailName && (
            <div
              style={{
                marginTop: "0.5rem",
                fontStyle: "italic",
                fontSize: "0.9rem",
              }}
            >
              Selected file: {thumbnailName}
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="thumbnail"
              style={{ padding: "0.25rem", fontSize: "1rem" }}
            >
              <option value="">-- Select Genre --</option>
              <option value="news">News and Features</option>
              <option value="opinion">Opinion and Editorial</option>
              <option value="resources">Resources and Education</option>
              <option value="action">Action and Advocacy</option>
              <option value="global">Global Voices</option>
            </select>
          </div>
        </div>

        <input
          id="thumbnail-upload"
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setThumbnailName(file.name);
            const url = await uploadImageToSupabase(file);
            setDisplayimg(url);
          }}
        />
      </div>

      <div style={{ padding: "1rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="write d-flex justify-content-center align-items-center"
        />
      </div>

      <div className="containerr" style={{ position: "relative" }}>
        <EditorContent editor={editor} />

        <BubbleMenu
          editor={editor}
          shouldShow={({ editor }) =>
            editor.state.selection.content().size > 0
          }
          style={{
            fontSize: ".1rem",
            padding: ".2rem",
            borderRadius: ".2rem",
            backgroundColor: "#242422",
            fontFamily: "Newsreader, serif",
          }}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="btn btn-sm my-button text-white"
          >
            <b>B</b>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="btn btn-sm my-button text-white"
          >
            <i>I</i>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="btn btn-sm my-button text-white"
          >
            <s>S</s>
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className="btn btn-sm my-button text-white"
          >
            T
          </button>

          <button
            onClick={() => {
              const url = window.prompt("Enter the URL");
              if (!url) return;
              editor
                .chain()
                .focus()
                .setLink({
                  href: url.match(/^https?:\/\//) ? url : `https://${url}`,
                })
                .run();
            }}
            className="btn btn-sm my-button text-white"
          >
            <LinkIcon fontSize="small" />
          </button>

          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="btn btn-sm my-button text-white"
          >
            <LinkOffIcon fontSize="small" />
          </button>

          <label className="btn btn-sm my-button text-white">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onInlineImageUpload}
            />
            <ImageIcon fontSize="small" />
          </label>
        </BubbleMenu>
      </div>

      <div className="containerr" style={{ marginTop: "2rem" }}>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          placeholder="Short summary of article (50–100 words)"
          className="summary thumbnail"
          style={{ width: "30rem" }}
        />
      </div>

      <div className="text-center" style={{ marginTop: "2rem" }}>
        <button className="thumbnail bottom" onClick={handleSubmit}>
          Submit Article
        </button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default CreateArticle;
