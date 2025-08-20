import React, { useEffect, useState } from "react";
import RenderContent from "./RenderContent";
import { useParams } from "react-router-dom";

type Article = {
  id: number;
  title: string;
  author: string;
  content: Record<string, any>;
  displayimg: string;
};

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5173/article/${id}`);
        const data: Article = await response.json();
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
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
