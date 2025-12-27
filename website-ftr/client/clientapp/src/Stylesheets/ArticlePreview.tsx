import type { ArticleLimited } from "../types.ts";
import { useNavigate } from "react-router-dom";

interface ArticlePreviewProps {
  article: ArticleLimited;
}

const ArticlePreview = ({ article }: ArticlePreviewProps) => {
  const nav = useNavigate();

  return (
    <div className="article-card" onClick={() => nav(`/articles/${article.id}`)}>
      <div className="d-flex justify-content-between align-items-start">
        
        {/* Text Section */}
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            {article.title}
          </h3>
          <p className="mb-1" style={{ fontSize: "0.9rem" }}>
            <b>Author:</b> {article.author}
          </p>
          <p style={{ 
            fontSize: "0.9rem", 
            color: "#555",
            display: "-webkit-box",
            WebkitLineClamp: 3, // Limits summary to 3 lines
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {article.summary}
          </p>
        </div>

        {/* Image Section */}
        <div style={{ flexShrink: 0 }}>
          <img
            src={article.displayimg}
            alt={article.title}
            className="preview-image"
          />
        </div>

      </div>
    </div>
  );
};

export default ArticlePreview;