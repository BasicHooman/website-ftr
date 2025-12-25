import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import FTRButton from "../Stylesheets/FTRButton.tsx";
import ArticlePreview from "../Stylesheets/ArticlePreview.tsx";
import type {ArticleLimited as Article} from "../types.ts";
import "../styles/ArticlePreviewStyles.css";

const PAGE_SIZE = 9;

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async (page: number) => {
    setLoading(true);

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    {/*
    const {data, error} = await supabase 
      .from("articles")
      .select("id, title, summary, image_url, genre")
      .order("created_at", {ascending: false})
      .range(start, end);
    */}
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        summary,
        image_url,
        genre,
        profiles:profiles!articles_author_id_fkey (
          full_name
        )
      `
      )
      .order("created_at", { ascending: false })
      .range(start, end);
    
    if (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
      return;
    }

    if (!data) {
      setArticles([]);
      setLoading(false);
      return;
    }

    const formatted: Article[] = data.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      displayimg: a.image_url,
      author: a.profiles && a.profiles.length > 0 ? a.profiles[0].full_name : "Unknown",
      genre: a.genre,
    }));

    setArticles(formatted);

    const { count } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (count) {
      setTotalPages(Math.ceil(count / PAGE_SIZE));
    }

    setCurrentPage(page);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchArticles(newPage);
  };

  // eventually replace this with something a little fancier if you're
  // dying for something to do
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <title>For The Record</title>

      <div className="d-flex justify-content-center">
        <div>
          <div className="article-grid-container">
            {articles.map((article) => (
              <ArticlePreview key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* RECENT UPLOADS 
        I commented this out bc we don't have the tracking metrics to make this a thing right now
        <div className="left">
          <div>
            <h2 style={{ fontSize: "2.1rem" }}>Recent Uploads</h2>
          </div>

          <div className="d-flex flex-wrap mb-5" style={{ width: "340px" }}>
            {articles.map((article) => (
              <ArticlePreview key={article.id} article={article} />
            ))}
          </div>
        </div>
        */}
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

export default HomePage;
