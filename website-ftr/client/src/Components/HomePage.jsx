import React, { useEffect, useState } from "react";
import RenderContent from "./RenderContent";
import { useNavigate } from "react-router-dom";
import Headerandnav from "./Headerandnav";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  let nav = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:5173/article");
        const data = await response.json();
        setArticles(data);
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
    <>
      <div className="text-center">
        <Headerandnav />
      </div>
      <h2>Trending</h2>
      <div className="d-flex">
        {articles.map((article) => (
          <div
            className="d-flex flex-wrap rounded-3 m-5"
            style={{ border: "1px solid black" }}
          >
            <div
              key={article.id}
              className="articleitem p-2 "
              onClick={() => {
                nav(`/articles/${article.id}`);
              }}
            >
              <div className="displaycont flexlimit">
                <h3>{article.title}</h3>
              </div>
              <p className="displaycont" style={{ paddingBottom: "1.5rem" }}>
                <b>Author:</b> {article.author}
              </p>
            </div>
            <div>
              <img src={article.displayimg} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HomePage;
