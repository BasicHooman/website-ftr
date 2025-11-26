import ArticleBox from "../Stylesheets/ArticleBox.tsx";
{/*import Article from "./Article.tsx"; */}
{/*import type { JSONContent } from "@tiptap/react"; */}
import {Link} from "react-router-dom";
import { useState } from "react";

interface TestingStyles {
  fun: string;

};

export const TestingStyles : React.FC<TestingStyles> = () => {
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/debug/seed-articles", {
        method: "POST",
      });
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch {
      setMessage("An error occurred.");
    }
  };

  const handleClear = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/debug/seed-articles", {
        method: "DELETE",
      });
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch {
      setMessage("An error occurred.");
    }
  };
  {/*
  const sampleTiptapContent: JSONContent = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "This is a Test Heading",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "This is a bold paragraph. ",
          },
          {
            type: "text",
            text: "And this is a regular sentence.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is another paragraph.",
          },
        ],
      },
    ],
  };
    */}
  return (
    <div className="flex flex-col items-center justify-center">
      <title></title>

      <div className="my-4 p-4 border rounded">
        <h3 className="text-center mb-2">Database Seeding</h3>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary mx-2" onClick={handleSeed}>Seed Articles</button>
          <button className="btn btn-danger mx-2" onClick={handleClear}>Clear Seeded Articles</button>
        </div>
        {message && <p className="mt-3 text-center">{message}</p>}
      </div>

      <ArticleBox
        articleName = {"GAY LOSER"}
        subtitle={"lesbian"}
        authorName = {"moke wob"}
        articleText={"the fitness gram pacer test is a "}
        articleDate={"5/7/2024"}

      />

      <Link className="nav-link" to="/create">
        Create Article
      </Link>


      {/* <Article
        id = {6741}
        title = "WOKIE SLOWFLAKE"
        author = "loser"
        displayimg = {reagan_picture}
        content={sampleTiptapContent}
      /> */}
   </div>
  );
};

export default TestingStyles;