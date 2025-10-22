import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Define an interface for the article object
interface Article {
  id: number;
  title: string;
  displayimg: string;
  summary: string;
}

export const CategoryDisplay = () => {
  // Use the Article interface to type the state
  const [articles, setArticles] = useState<Article[]>([]);
  const { categoryName } = useParams<{ categoryName: string }>();

  useEffect(() => {
    const fetchArticles = async () => {
      if (categoryName) { // Ensure categoryName is not undefined
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
      }
    };

    fetchArticles();
  }, [categoryName]);

  return (
    <div className="container">
      {/* Add a check to ensure categoryName is not undefined before using it */}
      <h2>{categoryName ? categoryName.replace(/-/g, ' ') : 'Articles'}</h2>
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