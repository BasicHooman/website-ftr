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
  created_at?: string;
}

const Article: React.FC = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleProps | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


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
          author_override,
          created_at,
          profiles!inner(
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
          //im choosing to ignore this error because i think its a necessary evil
          author: data.author_override || data.profiles?.[0]?.full_name || "Unknown",
          content: data.content,
          displayimg: data.image_url,
          created_at: data.created_at
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
          fontFamily: "Times New Roman",
        }}
      >
        <div className="w-3-4 bg-[#f5f1e9]">
          <div className="titlecont">
            <h3>{article.title}</h3>
          </div>

          <p className="titlecont" style={{ paddingBottom: "1.5rem" }}>
            <b>By:</b> {article.author}
          </p>

          <div className="flex flex-col items-center justify-center mb-2" style= {{paddingBottom: "1.5rem"}} >
            <img 
              src={article.displayimg} 
              //className="w-full max-w-[600px] max-h-[500px] object-contain outline-[#b30920] outline outline-3 rounded-lg"
              className="w-2/5 h-2/5 outline-[#b30920] outline outline-3 outline-round-lg" 
            />
            <p style= {{paddingBottom: "1.5rem"}}></p>
            <p  style={{
                    alignSelf: "flex-start",
                    paddingLeft: "13.5rem",
                      marginTop: "0.75rem",
                      marginBottom: "1.25rem",
                      fontStyle: "italic",
                      color: "#555",
                    }}
            >Published: {formatDate(article.created_at)}</p>
            <div className="article-content">
              <RenderContent content={article.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
