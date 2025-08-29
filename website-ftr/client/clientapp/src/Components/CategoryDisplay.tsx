import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export const CategoryDisplay = () => {
  const [articles, setArticles] = useState([]);
  const { categoryName } = useParams();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`http://localhost:3001/Articles/category/${categoryName}`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        } else {
          console.error('Failed to fetch articles');
        }
      } catch (error) {
        console.error('An error occurred while fetching articles:', error);
      }
    };

    fetchArticles();
  }, [categoryName]);

  return (
    <div className="container">
      <h2>{categoryName.replace(/-/g, ' ')}</h2>
      <div className="row">
        {articles.map(article => (
          <div className="col-md-4" key={article.id}>
            <div className="card mb-4 shadow-sm">
              <img src={article.displayimg} className="card-img-top" alt={article.title} />
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
    </div>
  );
};