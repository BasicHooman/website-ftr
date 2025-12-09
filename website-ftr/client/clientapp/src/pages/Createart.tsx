import { useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import LinkOffIcon from "@mui/icons-material/LinkOff"; // or FontAwesome icon for "unlink"
import { supabase } from "../lib/supabaseClient";


const Createart = () => {
  const [title, setTitle] = useState("");

  const [displayimg, setDisplayimg] = useState("");
  const [message, setMessage] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [genre, setGenre] = useState("");
  const [summary, setSummary] = useState("");

  const uploadImageToSupabase = async (file: File) => {
    const test = await supabase.storage
      .from("article-images")
      .upload(`test-${Date.now()}.txt`, new Blob(["hello"]));

    console.log("fekfekf",test);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error } = await supabase.storage
      .from("article-images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload failed:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("article-images")
      .getPublicUrl(filePath);

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
        onDrop: async (_editor: Editor, files: File[], _pos: number) => {
          const file = files[0];
          if(!file) return;
          const url = await uploadImageToSupabase(file);
          
          setDisplayimg(url || "");
        },

        onPaste: async (_editor: Editor, files: File[], _html: string) => {
          const file = files[0];
          if(!file) return;
          const url = await uploadImageToSupabase(file);
          setDisplayimg(url || "");
        },
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      }),
    ],
    content: "<p>Hello World!</p>",
  });

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);

    const url = await uploadImageToSupabase(file);
    editor.chain().focus().updateAttributes("image", { src: url }).run();
  };

  const handleSubmit = async () => {
    if (!editor) return;

    // Get logged in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to post an article.");
      return;
    }

    const author_id = user.id;

    // Editor content as JSON
    const contentJSON = editor.getJSON();

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          title,
          author_id,
          content: contentJSON,
          image_url: displayimg,
          genre,
          summary,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error submitting article:", error);
      setMessage("Failed to submit article.");
    } else {
      setMessage("Article submitted successfully!");
      console.log(data);
    }
  };

  if (!editor) {
    return null; // wait for editor to initialize
  }

  return (
    <>
      <title>Creative Corner</title>

      <div className="containerr cont">
        <div className="text-start">
          <label htmlFor="thumbnail-upload" className="thumbnail ">
            <div className="d-flex justify-content-center align-items-center">
              <div className="mx-1 " style={{ paddingBottom: ".1rem" }}>
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
              id="genre-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={{ padding: "0.25rem", fontSize: "1rem" }}
              className="thumbnail"
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
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setThumbnailName(file.name); // 👈 store file name
            const url = await uploadImageToSupabase(file);
            setDisplayimg(url || "");
          }}
          style={{ display: "none" }}
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
      <div style={{ position: "relative" }} className="containerr">
        <EditorContent style={{ position: "relative" }} editor={editor} />

        <BubbleMenu
          editor={editor}
          shouldShow={({ editor }) => editor.state.selection.content().size > 0}
          style={{
            fontSize: ".1rem",
            color: "#242422",
            padding: ".2rem .2rem 0rem .2rem",
            borderRadius: ".2rem",
            backgroundColor: "#242422",
            fontFamily: "Newsreader, serif",
          }}
          className={``}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm  my-button ${editor.isActive("bold") ? "is-active" : ""
              }`}
          >
            <b className="text-white" style={{ fontSize: "" }}>
              B
            </b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm  my-button ${editor.isActive("italic") ? "is-active" : ""
              }`}
          >
            <i className="text-white">I</i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm my-button ${editor.isActive("underline") ? "is-active" : ""
              }`}
          >
            <u className="text-white">U</u>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm  my-button ${editor.isActive("strike") ? "is-active" : ""
              }`}
          >
            <s className="text-white">S</s>
          </button>

          <span className="separator" />

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            style={{ color: "#242422", fontSize: "1.2rem" }}
            className={`btn btn-sm my-button text-white ${editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }`}
          >
            T
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            style={{ color: "#242422", fontSize: ".8rem" }}
            className={`btn btn-sm my-button text-white ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }`}
          >
            T
          </button>

          <span className="separator" />

          <button
            onClick={() => {
              const url = window.prompt("Enter the URL");
              if (url) {
                const formattedUrl = url.match(/^https?:\/\//)
                  ? url
                  : `https://${url}`;
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: formattedUrl })
                  .run();
              }
            }}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm my-button  text-white ${editor.isActive("link") ? "is-active" : ""
              }`}
          >
            <LinkIcon fontSize="small" />
          </button>

          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm my-button text-white`}
            disabled={!editor.isActive("link")}
          >
            <LinkOffIcon fontSize="small" />
          </button>

          <label
            style={{ color: "#242422", fontSize: "1rem", cursor: "pointer" }}
            className="btn btn-sm my-button text-white"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onImageChange}
            />
            <ImageIcon fontSize="small" />
          </label>

          {/* add more controls */}
        </BubbleMenu>
      </div>
      <div className="containerr" style={{ marginTop: "2rem" }}>
        <textarea
          placeholder="Short summary of article (50–100 words)"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="summary thumbnail d-flex justify-content-center align-items-center"
          style={{
            width: "30rem",
          }}
          rows={4}
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

export default Createart;
