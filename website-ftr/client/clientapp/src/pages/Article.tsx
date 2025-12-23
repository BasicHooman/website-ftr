import React, { useEffect, useState } from "react";
import RenderContent from "../Components/RenderContent";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import type { JSONContent } from "@tiptap/react";

interface ArticleProps {
  id: number;
  title: string;
  author: string;
  content?: JSONContent;
  displayimg?: string;
}

const Article: React.FC = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      // Fetch article + join to profiles to get author username
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          content,
          image_url,
          profiles (
            username,
            full_name
          )
        `)
        .eq("id", Number(id))
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setArticle({
          id: data.id,
          title: data.title,
          author: data.profiles?.[0].username ?? data.profiles?.[0].full_name ?? "Unknown",
          content: data.content,
          displayimg: data.image_url,
        });
      }

      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <div>
      <div
        key={article.id}
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
        }}
      >
        <div className="titlecont">
          <h3>{article.title}</h3>
        </div>

        <p className="titlecont" style={{ paddingBottom: "1.5rem" }}>
          <b>Author:</b> {article.author}
        </p>

        <div className="article-content">
          <RenderContent content={article.content} />
        </div>
      </div>
    </div>
  );
};

export default Article;
