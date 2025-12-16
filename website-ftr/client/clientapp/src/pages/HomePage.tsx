import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import FTRButton from "../Stylesheets/FTRButton.tsx";

type Article = {
  id: number;
  title: string;
  author: string;
  displayimg: string;
  summary: string;
};

const PAGE_SIZE = 10;

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const nav = useNavigate();

  const fetchArticles = async (page: number) => {
    setLoading(true);

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        summary,
        image_url,
        profiles!articles_author_id_fkey (
          username
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

    const formatted = data.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      displayimg: a.image_url,
      author: a.profiles?.[0]?.username ?? "Unknown",
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

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <title>For The Record</title>

      <div className="d-flex justify-content-center">
        {/* TRENDING */}
        <div>
          <div className="left1">
            <h2 style={{ fontSize: "2.1rem" }}>Trending</h2>
          </div>

          <div className="d-flex flex-wrap mb-5" style={{ width: "560px" }}>
            {articles.map((article) => (
              <div
                key={article.id}
                className="d-flex mx-auto news margin-top mx-5"
                style={{ flexWrap: "nowrap", alignItems: "flex-start" }}
              >
                <div
                  className="articleitem p-2"
                  onClick={() => nav(`/articles/${article.id}`)}
                >
                  <div className="displaycont" style={{ width: "235px" }}>
                    <h3>{article.title}</h3>
                  </div>

                  <p className="displaycont" style={{ width: "235px" }}>
                    <b>Author:</b> {article.author}
                  </p>

                  <p
                    className="displaycont"
                    style={{ paddingBottom: "1.2rem", width: "220px" }}
                  >
                    {article.summary}
                  </p>
                </div>

                <div className="my-3">
                  <img
                    src={article.displayimg}
                    width="310"
                    height="207"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT UPLOADS */}
        <div className="left">
          <div>
            <h2 style={{ fontSize: "2.1rem" }}>Recent Uploads</h2>
          </div>

          <div className="d-flex flex-wrap mb-5" style={{ width: "340px" }}>
            {articles.map((article) => (
              <div
                key={article.id}
                className="d-flex flex-wrap mx-auto news margin-top mx-5"
              >
                <div
                  className="articleitem p-2"
                  onClick={() => nav(`/articles/${article.id}`)}
                >
                  <div className="my-2">
                    <img
                      src={article.displayimg}
                      width="310"
                      height="207"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="displaycont">
                    <h3>{article.title}</h3>
                  </div>

                  <p className="displaycont" style={{ width: "235px" }}>
                    <b>Author:</b> {article.author}
                  </p>

                  <p className="displaycont" style={{ width: "235px" }}>
                    {article.summary}
                  </p>
                </div>
              </div>
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

export default HomePage;
