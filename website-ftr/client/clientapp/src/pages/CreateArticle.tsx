import { useState } from "react";
import {supabase} from "../lib/supabaseClient";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import ImageIcon from "@mui/icons-material/Image";
import FTRButton from "../Stylesheets/FTRButton";
import TextInputWrapped from "../Stylesheets/TextInputWrapped";


const CreateArticle = () => {

    const [thumbnailName, setThumbnailName] = useState("");
    const [displayimg, setDisplayimg] = useState("");

    const editor = useEditor ({
        extensions: [
            StarterKit,
            Strike,
            Heading.configure({levels: [1,2,3]}),
            Link.configure({openOnClick: false}),
            Image.configure({allowBase64: true}),
            FileHandler.configure({
                onDrop: async (_editor: Editor, files: File[]) => {
                    const file = files[0];
                    if(!file) return;
                    const url = await uploadImageToSupabase(file);
                    setDisplayimg(url || "");
                },
                onPaste(_editor: Editor, files: File[]): void {
                    void (async () => {
                        const file = files[0];
                        if (!file) return;
                        const url = await uploadImageToSupabase(file);
                        setDisplayimg(url || "");
                    })();
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

    const uploadImageToSupabase = async (file: File): Promise<string> => {
        const fileExt = file.name.split(".'").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        const { error } = await supabase.storage
            .from("article-images")
            .upload(filePath, file, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

            if (error) {
                console.error("Image Upload Failed: ", error);
                throw error;
            }
            const {data} = supabase.storage 
                .from("article-images")
                .getPublicUrl(filePath);

            return data.publicUrl;
    }

    const handleSubmit = async () => {
        if (!editor) return;

        const {
            data: {user}
        } = await supabase.auth.getUser();

        if (!user){
            alert("You must be logged in AND have permission to post articles.");
            return;
        }
        const roles = user.app_metadata?.roles;

        const isAdmin = roles?.admin;
        const isEditor = roles?.editor;
        const isAuthor = roles?.author;

        if(!(isAdmin || isEditor || isAuthor)){
            alert("Your account does not have adequate permissions to submit articles.");
            return;
        }

        const author_id = user.id;

        const contentJSON = editor.getJSON();

        const {error} = await supabase 
            .from("articles")
            .insert([
                {
                    title,
                    author_id,
                    content: contentJSON,
                    image_url: displayimg.
                    genre,
                    summary,
                },
            ])
            .select()
            .single();
        if (error) {
            alert("Error submitting article.")
            console.error(error);
        }
        else{
            alert("Article submitted sucessfully!");
        }
    };

    if(!editor) {
        return null;
    }

    return (
        <>
            <title>Create Article</title>
            <div className="flex flex-col items-center justify-center" style={{fontFamily: "Times New Roman"}}>
                <div className="flex flex-col h-full w-3/4 bg-[#FF00A6FF]">
                    <h1>Create Article</h1>

                    <h2>INSERT TITLE</h2>
                    <h3>By: INSERT AUTHOR NAME</h3>

                    <div className="text-start">
                        <label htmlFor="thumbnail-upload" className="thumbnail ">
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="mx-1 " style={{ paddingBottom: ".1rem" }}>
                                    <ImageIcon fontSize="small" />
                                </div>
                                <div className="mx-1">Upload Thumbnail</div>
                            </div>         
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
                        </label>

                        <input
                            id="thumbnail-upload"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setThumbnailName(file.name); 
                                const url = await uploadImageToSupabase(file);
                                setDisplayimg(url || "");
                            }}
                            style={{ display: "none" }}
                        />
                    </div>
                    
                    {/* bubble menu stuff (open at your own risk) */}
                    <div style={{position: "relative"}} className="containerr">
                        <TextInputWrapped
                            editor = {editor}
                            onImageChange={onImageChange}
                        />
                    </div>

                </div>
                <div className="text-center" style={{marginTop: "2rem" }}>
                    <FTRButton
                        buttonText = "Submit Article"
                        onClick = {handleSubmit}
                    />
                </div>
            </div>
        </>
    );
}

export default CreateArticle;