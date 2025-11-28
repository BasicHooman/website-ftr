
import { useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import LinkOffIcon from "@mui/icons-material/LinkOff"; // or FontAwesome icon for "unlink"
import { handleImageUpload, handleSubmit as apiHandleSubmit } from "../api";

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
      BubbleMenuExtension,
      Strike,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      FileHandler.configure({
        onDrop: async (editor: Editor, files: File[]) => {
          const file = files[0];
          const url = await handleImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        },
        onPaste: async (editor: Editor, files: File[]) => {
          const file = files[0];
          const url = await handleImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        },
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
      }),
    ],
   });

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);

    const url = await handleImageUpload(file);
    editor.chain().focus().updateAttributes("image", { src: url }).run();
  };

  const handleSubmit = async () => {
    // you need to make the entire form clear once this is done
    // an alert() woudla slo be nice but isnt necessary ig
    const result = await apiHandleSubmit(
      editor,
      title,
      author,
      displayimg,
      genre,
      summary
    );
    if (result) {
      if (result.success) {
        setMessage("Article submitted successfully!");
        console.log(result.data);
      } else {
        setMessage("Failed to submit article.");
        console.error(result.error);
      }
    }
  };

  if (!editor) {
    return null; // wait for editor to initialize
  }

  return (
    <div className="relative min-h-screen">
      <title>Create Article</title>
      {/* Background */}
      <div className="absolute left-1/8 right-7/8 w-3/4 h-full bg-[#A79877FF] -z-10"></div>

      {/* Content */}
      <div className="w-3/4 pt-8 ml-[12.5%] font-[times]">
        <h1 className="text-white text-3xl font-bold mb-6 pl-12">Create Article</h1>
        <div className=" w-full">
          <div className="containerr cont">
          <div className="text-start">
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
            <div style={{ padding: "1rem" }}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="write d-flex justify-content-center align-items-center"
              />
            </div>   
                       
            <div className="d-flex justify-content-center align-items-center">
              <label htmlFor="thumbnail-upload" className="thumbnail ">
                <div className="mx-1 " style={{ paddingBottom: ".1rem" }}>
                  <ImageIcon fontSize="small" />
                </div>
                <div className="mx-1">Upload Thumbnail</div>
              </label>             
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
          </div>
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setThumbnailName(file.name);
                const url = await handleImageUpload(file);
                setDisplayimg(url);
              }}
              style={{ display: "none" }}
            />
          </div>
          <div style={{ position: "relative" }} className="containerr">
            <EditorContent style={{ position: "relative" }} editor={editor} />

            <BubbleMenu
              editor={editor}
              shouldShow={({ editor }: { editor: Editor }) => editor.state.selection.content().size > 0}
              className="text-[.1rem] text-[#242422] px-[.2rem] pt-[.2rem] rounded-[.2rem] bg-[#242422] font-serif"
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
        </div>
      </div>
    </div>
  );
};

export default Createart;
