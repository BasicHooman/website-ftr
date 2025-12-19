import {BubbleMenu} from "@tiptap/react/menus";
import {EditorContent, Editor} from "@tiptap/react";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff"; // or FontAwesome icon for "unlink"
import ImageIcon from "@mui/icons-material/Image";

interface TextInputWrappedProps {
    editor: Editor;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>)=> Promise<void>;
}

const TextInputWrapped = ({editor, onImageChange} : TextInputWrappedProps) => {

    return (
        <>
            <EditorContent style={{position: "relative"}} editor={editor} />
            <BubbleMenu
                editor={editor}
                shouldShow={({editor}) => editor.state.selection.content().size > 0}
                style={{
                    fontSize: ".1rem",
                    color: "#242424",
                    padding: ".2rem .2rem 0rem .2rem",
                    borderRadius: ".2rem",
                    backgroundColor: "#242424",
                    fontFamily: "Times New Roman"
                }}
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
            </BubbleMenu>
        </>
    );
};

export default TextInputWrapped;