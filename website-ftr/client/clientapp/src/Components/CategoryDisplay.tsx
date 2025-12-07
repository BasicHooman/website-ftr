import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface Article {
  id: number;
  title: string;
  summary: string;
  displayimg: string;
}

const PAGE_SIZE = 9; // 3x3 grid like your Bootstrap cards

const CategoryDisplay: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const { categoryName } = useParams<{ categoryName: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch paginated, category-filtered articles
  const fetchArticles = async (page: number) => {
    if (!categoryName) return;

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    // Query Supabase for this category
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, summary, image_url")
      .eq("genre", categoryName)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Error fetching articles:", error);
      return;
    }

    // Transform to your UI format
    const formatted = (data || []).map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      displayimg: a.image_url,
    }));

    setArticles(formatted);

    // Count total rows for pagination
    const { count } = await supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("genre", categoryName);

    if (count !== null) {
      setTotalPages(Math.ceil(count / PAGE_SIZE));
    }

    setCurrentPage(page);
  };

  // Load on mount & when category name changes
  useEffect(() => {
    fetchArticles(1);
  }, [categoryName]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchArticles(newPage);
  };

  return (
    <div className="container">
      <h2>{categoryName ? categoryName.replace(/-/g, " ") : "Articles"}</h2>

      <div className="row">
        {articles.map((article) => (
          <div className="col-md-4" key={article.id}>
            <div className="card mb-4 shadow-sm">
              <img
                src={article.displayimg}
                className="card-img-top"
                alt={article.title}
              />
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/articles/${article.id}`}>{article.title}</Link>
                </h5>
                <p className="card-text">{article.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary mx-1"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-primary mx-1"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryDisplay;
