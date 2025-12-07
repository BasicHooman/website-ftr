import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

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

    // Step 1: Fetch paginated articles + author username
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

    // Step 2: Transform result for UI
    const formatted = data.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      displayimg: a.image_url,
      author: a.profiles?.[0]?.username ?? "Unknown",
    }));

    setArticles(formatted);

    // Step 3: Count total articles for pagination
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
        <div>
          <div className="left1">
            <h2 style={{ fontSize: "2.5rem" }}>Trending</h2>
          </div>
          <div className="d-flex flex-wrap mb-5" style={{ width: "830px" }}>
            {articles.map((article) => (
              <div className="d-flex flex-wrap mx-auto news margin-top mx-5">
                <div
                  key={article.id}
                  className="articleitem p-2"
                  onClick={() => nav(`/articles/${article.id}`)}
                >
                  <div className="displaycont " style={{ width: "350px" }}>
                    <h3>{article.title}</h3>
                  </div>
                  <p className="displaycont" style={{ width: "350px" }}>
                    <b>Author:</b> {article.author}
                  </p>
                  <p
                    className="displaycont"
                    style={{ paddingBottom: "1.5rem", width: "330px" }}
                  >
                    {article.summary}
                  </p>
                </div>
                <div className="my-3">
                  <img
                    src={article.displayimg}
                    width="462.675"
                    height="308.4375"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="left">
          <div>
            <h2 style={{ fontSize: "2.5rem" }}>Recent Uploads</h2>
          </div>
          <div className="d-flex flex-wrap mb-5" style={{ width: "500px" }}>
            {articles.map((article) => (
              <div className="d-flex flex-wrap mx-auto news margin-top mx-5">
                <div
                  key={article.id}
                  className="articleitem p-2"
                  onClick={() => nav(`/articles/${article.id}`)}
                >
                  <div className="my-2">
                    <img
                      src={article.displayimg}
                      width="462.675"
                      height="308.4375"
                    />
                  </div>
                  <div className="displaycont">
                    <h3>{article.title}</h3>
                  </div>
                  <p className="displaycont" style={{ width: "350px" }}>
                    <b>Author:</b> {article.author}
                  </p>
                  <p className="displaycont" style={{ width: "350px" }}>
                    {article.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
    </>
  );
};

export default HomePage;
