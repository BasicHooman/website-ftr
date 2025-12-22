import { useState } from "react";
import {supabase} from "../lib/supabaseClient";
import type {JSONContent} from "@tiptap/react";

import ImageIcon from "@mui/icons-material/Image";

import FTRButton from "../Stylesheets/FTRButton";
import TextEditor from "../Components/TextEditor";
import FTRInputSmall from "../Stylesheets/FTRInputSmall";
import CoolDropdown from "../Stylesheets/CoolDropdown";

const CreateArticle = () => {

    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");

    const [summary, setSummary] = useState<JSONContent | null>(null);
    const [content, setContent] = useState<JSONContent | null>(null);
    
    const [thumbnailName, setThumbnailName] = useState("");
    const [displayimg, setDisplayimg] = useState("");


    const TABLE_NAME = "articles";
    const CONTENT_COLUMN = "content";
    const SUMMARY_COLUMN = "summary";


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
        //if (!editor) return;

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

        const {error} = await supabase.from(TABLE_NAME).insert(
            {
                title,
                author_id,
                [CONTENT_COLUMN]: content,
                image_url: displayimg,
                genre: genre,
                [SUMMARY_COLUMN]: summary,
            });
        if (error) {
            alert("Error submitting article.")
            console.error(error);
        }
        else{
            alert("Article submitted sucessfully!");
        }
    };

    return (
        <div>
            <title>Create Article</title>
            <div className="flex flex-col items-center justify-center mb-2" style={{fontFamily: "Times New Roman"}}>
                <div className="flex flex-col h-full w-3/4 bg-[#f5f1e9]">
                    <h1>Create Article</h1>

                    <FTRInputSmall
                        placeholder="Article Title"
                        inputValue={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <CoolDropdown
                        selectedValue={genre}
                        options = {[
                            {value: "news", label: "News and Features"},
                            {value: "opinion", label: "Opinion and Editorial"},
                            {value: "resources", label: "Resources and Education"},
                            {value: "action", label: "Action and Advocacy"},
                            {value: "global", label: "Global Voices"}
                        ]}
                        onChange={(e) => setGenre(e.target.value)}
                        dropdownLabelTitle="Select Genre"
                        className="mb-2"
                    />

                    {/* image upload shenanagins */}
                    <div className="text-start mb-2">
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
                    
                    <div style={{position: "relative"}} className="containerr">
                        <TextEditor 
                            onChange={setSummary}
                            fillerText="Article Summary..."
                        />
                        <TextEditor 
                            onChange={setContent}
                            fillerText="Article Content..."
                        />
                    </div>

                    <div className="d-flex justify-content-center">
                        <FTRButton
                            buttonText = "Submit Article"
                            onClick = {handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateArticle;