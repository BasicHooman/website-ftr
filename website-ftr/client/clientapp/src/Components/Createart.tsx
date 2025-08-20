import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import LinkOffIcon from "@mui/icons-material/LinkOff"; // or FontAwesome icon for "unlink"
import Headerandnav from "./Headerandnav";

const Createart = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [displayimg, setDisplayimg] = useState("");
  const [message, setMessage] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [genre, setGenre] = useState("");
  const [summary, setSummary] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Strike,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      FileHandler.configure({
        onDrop: async (editor, files, pos) => {
          const file = files[0];
          const url = await handleImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        },
        onPaste: async (editor, files) => {
          const file = files[0];
          const url = await handleImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        },
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
      }),
    ],
    content: "<p>Hello World!</p>",
  });

  const handleImageUpload = async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: form,
    });
    const { url } = await res.json();
    return url;
  };

  const onImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);

    const url = await handleImageUpload(file);
    editor.chain().focus().updateAttributes("image", { src: url }).run();
  };

  const handleSubmit = async () => {
    console.log({
      title,
      author,
      displayimg,
      content: editor.getJSON(),
      plainText: editor.getText(),
    });
    if (!editor) return;
    const content = editor.getJSON();

    const article = {
      title,
      author,
      displayimg,
      content, // this is JSON
      genre,
      summary,
    };

    try {
      const response = await fetch("http://localhost:5173/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Article submitted successfully!");
        console.log(data);
      } else {
        setMessage("Failed to submit article.");
        console.error(data);
      }
    } catch (err) {
      setMessage("Error submitting article.");
      console.error(err);
    }
  };

  if (!editor) {
    return null; // wait for editor to initialize
  }

  return (
    <>
      <title>Creative Corner</title>
      <div className="text-center">
        <Headerandnav />
      </div>

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
              <option value="creative">Creative Corner</option>
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
            const url = await handleImageUpload(file);
            setDisplayimg(url);
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
          rows={1}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="author d-flex justify-content-center align-items-center"
        />
      </div>
      <div style={{ position: "relative" }} className="containerr">
        <EditorContent style={{ position: "relative" }} editor={editor} />

        <FloatingMenu
          editor={editor}
          shouldShow={({ state }) => {
            // show only on empty paragraph
            const { $from } = state.selection;
            return (
              $from.parent.type.name === "paragraph" && state.selection.empty
            );
          }}
        >
          {/* more actions */}
        </FloatingMenu>

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
            className={`btn btn-sm  my-button ${
              editor.isActive("bold") ? "is-active" : ""
            }`}
          >
            <b className="text-white" style={{ fontSize: "" }}>
              B
            </b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm  my-button ${
              editor.isActive("italic") ? "is-active" : ""
            }`}
          >
            <i className="text-white">I</i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm my-button ${
              editor.isActive("underline") ? "is-active" : ""
            }`}
          >
            <u className="text-white">U</u>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={{ color: "#242422", fontSize: "1rem" }}
            className={`btn btn-sm  my-button ${
              editor.isActive("strike") ? "is-active" : ""
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
            className={`btn btn-sm my-button text-white ${
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }`}
          >
            T
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            style={{ color: "#242422", fontSize: ".8rem" }}
            className={`btn btn-sm my-button text-white ${
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
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
            className={`btn btn-sm my-button  text-white ${
              editor.isActive("link") ? "is-active" : ""
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
      <div className="containerr" style={{marginTop:"2rem"}}>
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
