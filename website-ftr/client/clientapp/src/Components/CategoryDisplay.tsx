import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import type {ArticleLimited as Article} from "../types.ts";
import ArticlePreview from "../Stylesheets/ArticlePreview";
import "../styles/ArticlePreviewStyles.css";
import FTRButton from "../Stylesheets/FTRButton.tsx";

const PAGE_SIZE = 9;

const CategoryDisplay: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const { categoryName } = useParams<{ categoryName: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchArticles = useCallback(async (page: number) => {
    setLoading(true);

    if (!categoryName){
      navigate("/");
      return;
    }

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    // Query Supabase for this category
    const { data, error } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        summary,
        image_url,
        genre,
        author_override,
        profiles (
          full_name
        )
      `)
      .eq("genre", categoryName)
      .order("created_at", { ascending: false })
      .range(start, end);

    
    if (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
      return;
    }

    if(!data){
      setArticles([]);
      setLoading(false);
      return;
    }

    const formatted: Article[] = data.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      displayimg: a.image_url,
      author: a.author_override || a.profiles?.full_name || "Unknown",
      genre: a.genre,
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
    setLoading(false);
    },
    [categoryName]
  );

  // Load on mount & when category name changes
  useEffect(() => {
    fetchArticles(1);
  }, [fetchArticles]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchArticles(newPage);
  };

  const categoryLabels: { [key: string]: string } = {
    news: "News and Features",
    opinion: "Opinion and Editorial",
    resources: "Resources and Education",
    action: "Action and Advocacy",
    global: "Global Voices",
    creative: "Creative Corner",
  };


  if (loading) return <p>Loading...</p>;

  return (
    <>
      <title>For The Record</title>        
      <h2 className="mx-6" style={{fontFamily: "Times New Roman", paddingLeft: "10rem"}}
      
      >{categoryName ? categoryLabels[categoryName] || categoryName : "Articles"}</h2>

      <div className=" d-flex justify-content-center" style={{fontFamily: "Times New Roman"}}>
        <div>
          <div className="article-grid-container">
            {articles.map((article) => (
              <ArticlePreview key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
        {/* PAGINATION */}
        <div className="d-flex justify-content-center mx-2">
          <FTRButton
            buttonText = "Previous"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex-fill"
          />

          <FTRButton
            buttonText = "Next"
            onClick = {() => handlePageChange(currentPage + 1)}
            disabled = {currentPage === totalPages}
            className="flex-fill"
            style= {{width: "115%"}}
          />
        </div>
    </>
  );
};

export default CategoryDisplay;
