import React, { useEffect, useState } from "react";
import RenderContent from "./RenderContent";
import { useParams } from "react-router-dom";

const Article = () => {
  let { id } = useParams();
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`http://localhost:3001/article/${id}`);
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Loading...</p>;

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
