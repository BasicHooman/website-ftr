import { useState, useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { JSONContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";


// reagan is DONE with messy code. D. O. N. E. DONE!
// please put all ftr imports here or i will explode
import FTRInputSmall from "../Stylesheets/FTRInputSmall.tsx";
import SummaryBox from "../Stylesheets/ArticleCreationStyles/SummaryBox.tsx";
import TitleInput from "../Stylesheets/ArticleCreationStyles/TitleInput.tsx";

import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { supabase } from "../lib/supabaseClient";

interface User {
  id: string;
  metadata?: {
    full_name?: string;
  };
  full_name?: string;
  admin?: boolean;
  editor?: boolean;
  author?: boolean;
  articlesSubmitted?: number;
}

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState<JSONContent | null>(null);
  const [authorOverride, setAuthorOverride] = useState("");

  const [displayimg, setDisplayimg] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [message, setMessage] = useState("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, full_name, admin, editor, author, articlesSubmitted")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          setCurrentUser(null);
        } else if (profile) {
          setCurrentUser({
            ...user, // Spread existing user properties
            id: profile.id,
            full_name: profile.full_name,
            admin: profile.admin,
            editor: profile.editor,
            author: profile.author,
            articlesSubmitted: profile.articlesSubmitted
          });
        } else {
          // User exists but no profile found, treat as unprivileged
          setCurrentUser({ ...user, id: user.id }); // Still set ID from user object
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoadingUser(false);
    };

    fetchUser();
  }, []);

  const isAuthor = currentUser?.author === true;
  const isEditor = currentUser?.editor === true;
  const isAdmin = currentUser?.admin === true;
  const articlesSubmitted = currentUser?.articlesSubmitted || 0;

  {/* top ten things we should NOT put in the console LMAO
  console.log("isAuthor:", isAuthor);
  console.log("isEditor:", isEditor);
  console.log("isAdmin:", isAdmin);
  console.log("articlesSubmitted:", articlesSubmitted);
  */}

  //const userState = 
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
    content: "<p>Start drafting your dream piece!</p>",
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

    if (!isAuthor && !isEditor && !isAdmin) {    
      if(!articlesSubmitted){
        setMessage("Error gathering your article count. Please try again later, and contact our technical team if this error persists.")
      }
      if (articlesSubmitted == 1) {
        setMessage("As a non-author, you can only post 1 article. We will inform you soon if your submitted article has been approved!");
        return;
      }
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

  return (
    // least vibecoded ftr code segment: 
    //ok in all seriousness a lot of this websites logic is legit but wtf is this
    // to mainsplain: it checks to see if the user data is still being fetched and until that is fetched it shows the loading thing
    // once tahts done it deals with the officer operators. easy peasy guys.
  <div className="bg-[#f5f1e9] w-3/4 items-center justify-center mx-auto mb-2" style={{ padding: "1rem" }}>
    <title>Creative Corner</title>
      <div className="mx-auto flex flex-col gap-6 items-center w-full max-w-[50rem] px-4">
        {/* ten million dollar idea: this sohould all be handled in a function that gets called and i make a react object that displays
        a persons credentials */}
        {isLoadingUser ? (
          <p className="text-center text-gray-600 mb-1">Loading user information...</p>
          ) : 
          (!(isAuthor || isEditor || isAdmin) &&
          (
            <div className="text-center mb-1">
              <p>
                Notice: As a non-author, you can only submit 1 article at a time. This policy is in place to prevent spam. However, if we like your submission, we will promote you to a full-time Author than can submit more articles. 
              </p>
            </div>
          )
        )}

        <div className="container-cont">
          
          <TitleInput
            text={title}
            placeholderText = "Article Title"
            onChangeCool = {(e) => setTitle(e.target.value)}
            className={"mb-4"}
          />

          <div className="flex flex-row flex-wrap items-center justify-center gap-4 w-full" style={{ minWidth: "50rem", margin: "0.5rem auto 1.5rem", boxSizing: "border-box" }}>
            {/* Thumbnail upload button */}
            <label htmlFor="thumbnail-upload" className="thumbnail" style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <div className="d-flex justify-content-center align-items-center">
                <div className="mx-1" style={{ paddingBottom: ".1rem" }}>
                  <ImageIcon fontSize="small" />
                </div>
                <div className="mx-1">Upload Thumbnail</div>
              </div>
            </label>

            <input
              id="thumbnail-upload"
              type="file"
              accept="image/png image/webp image/jpg image/jpeg"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setThumbnailName(file.name);
                const url = await uploadImageToSupabase(file);
                setDisplayimg(url);
              }}
            />

            {/* Author Override input */}
            <FTRInputSmall
              inputValue={authorOverride}
              placeholder="Author Override"
              onChange={(e) => setAuthorOverride(e.target.value)}
            />

            {/* Select Genre dropdown */}
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="thumbnail"
              style={{ padding: "0.25rem 0.5rem", fontSize: "1rem", height: "40px" }}
            >
              <option value="">-- Select Genre --</option>
              <option value="news">News and Features</option>
              <option value="opinion">Opinion and Editorial</option>
              <option value="resources">Resources and Education</option>
              <option value="action">Action and Advocacy</option>
              <option value="global">Global Voices</option>
            </select>
          </div>

          {/* Separate container for thumbnailName display if it exists so it doesn't break the row alignment */}
          {thumbnailName && (
            <div
              style={{
                minWidth: "50rem",
                margin: "-1rem auto 1.5rem",
                paddingLeft: "1rem",
                fontStyle: "italic",
                fontSize: "0.9rem",
                textAlign: "left"
              }}
            >
              Selected file: {thumbnailName}
            </div>
          )}
          
          <SummaryBox
            text={summary}
            onChange={(val) => setSummary(val)}
            placeholderText="Short summary of article (50–100 words)"
            numRows={4}
            className={"w-full mb-4"}
          />

          {/* Editor content begins (open at your own risk) */}
          <div className="containerr border border-black w-full" style={{ position: "relative" }}>
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
                fontFamily: "Times New Roman",
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
          
          {/* Submit button */}
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

export default CreateArticle;
