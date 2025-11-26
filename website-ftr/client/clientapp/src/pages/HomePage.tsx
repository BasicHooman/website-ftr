import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// this really shouldnt be here LOL
// like no. absoltely not.
// really should be declared int he article file? i would surely hope
type Article = {
  id: number; // or `number` if your backend returns a number
  title: string;
  author: string;
  displayimg: string;
  summary:string;
};

const HomePage : React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const nav = useNavigate();

  const fetchArticles = async (page: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/articles?page=${page}`);
      const data = await response.json();
      setArticles(data.articles);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const handlePageChange = (newPage: number) => {
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
                  onClick={() => {
                    nav(`/articles/${article.id}`);
                  }}
                >
                  <div className="displaycont " style={{ width: "350px"}}>
                    <h3>{article.title}</h3>
                  </div>
                  <p
                    className="displaycont"
                    style={{width: "350px" }}
                  >
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
          <div className="">
            <h2 style={{ fontSize: "2.5rem" }}>Recent Uploads</h2>
          </div>
          <div className="d-flex flex-wrap mb-5" style={{ width: "500px" }}>
            {articles.map((article) => (
              <div className="d-flex flex-wrap mx-auto news margin-top mx-5">
                <div
                  key={article.id}
                  className="articleitem p-2"
                  onClick={() => {
                    nav(`/articles/${article.id}`);
                  }}
                >
                  <div className="my-2">
                    <img
                      src={article.displayimg}
                      width="462.675"
                      height="308.4375"
                    />
                  </div>
                  <div className="displaycont ">
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
