
import { Editor } from "@tiptap/react";

export const handleImageUpload = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("http://localhost:3001/upload", {
    method: "POST",
    body: form,
  });
  const { url } = await res.json();
  return url;
};

export const handleSubmit = async (
  editor: Editor | null,
  title: string,
  author: string,
  displayimg: string,
  genre: string,
  summary: string
) => {
  if (!editor) return;

  const content = editor.getJSON();

  const article = {
    title,
    author,
    displayimg,
    content,
    genre,
    summary,
  };

  try {
    const response = await fetch("http://localhost:3001/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.text();
      return { success: false, error: errorData };
    }
  } catch (err) {
    return { success: false, error: err };
  }
};
