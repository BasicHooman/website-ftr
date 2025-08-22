import React, { useEffect, useState } from "react";
import RenderContent from "./RenderContent";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


type Article = {
  id: number;
  title: string;
  author: string;
  displayimg: string;
  summary:string;
};

export const CategoryDisplay = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  let nav = useNavigate();
  
    useEffect(() => {
      const fetchArticles = async () => {
        try {
          const response = await fetch(`http://localhost:5173/article/${category}`);
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
      <div>CategoryDisplay SHE HOPES!</div>
      <p>To be Quite Honest I have no way to run this and also I don't know anything about anything so if this actually works consider it an act of god or whatever.</p>

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
    </>
    
  )
}
