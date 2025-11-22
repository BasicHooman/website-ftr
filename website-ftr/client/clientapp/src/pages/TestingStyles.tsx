import reagan_picture from "../assets/officer-pictures/rms.jpeg";
import ArticleBox from "../Stylesheets/ArticleBox.tsx";
import Article from "./Article.tsx";
import type React from "react";
import type { JSONContent } from "@tiptap/react";

interface TestingStyles {
  fun: string;

};

export const TestingStyles : React.FC<TestingStyles> = () => {
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

  return (
    <div className="flex flex-col items-center justify-center">
    <title></title>
      <ArticleBox
        articleName = {"GAY LOSER"}
        subtitle={"lesbian"}
        authorName = {"moke wob"}
        articleText={"the fitness gram pacer test is a "}
        articleDate={"5/7/2024"}

      />

      <Article
        id = {6741}
        title = "WOKIE SLOWFLAKE"
        author = "loser"
        displayimg = {reagan_picture}
        content={sampleTiptapContent}
      />
   </div>
  );
};

export default TestingStyles;