import React, { useEffect, useState } from "react";
import RenderContent from "../Components/RenderContent";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import type { JSONContent } from "@tiptap/react";
import type { User } from "@supabase/supabase-js";
import FTRButton from "../Stylesheets/FTRButton.tsx";

interface UserWithProfile extends User {
  full_name?: string;
  admin?: boolean;
  editor?: boolean;
  author?: boolean;
  articlesSubmitted?: number;
}

interface ArticleProps {
  id: number;
  title: string;
  author_id?: string | null;
  author: string;
  content?: JSONContent;
  displayimg?: string;
  created_at?: string;
  genre?: string;
  summary?: string;
}

const ProposedArticle: React.FC = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<UserWithProfile | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          setCurrentUser(null);
        } else if (profile) {
          const metadataRoles = (user.app_metadata?.roles || {}) as Record<string, boolean>;
          //const isAdmin = profile.admin === true || profile.role === "admin" || metadataRoles.admin === true;
          //const isEditor = profile.editor === true || profile.role === "editor" || metadataRoles.editor === true;
          //const isAuthor = profile.author === true || profile.role === "author" || metadataRoles.author === true;

          setCurrentUser({
            ...user,
            id: profile.id,
            full_name: profile.full_name,
            admin: profile.admin === true || profile.role === "admin" || metadataRoles.admin === true,
            editor: profile.editor === true || profile.role === "editor" || metadataRoles.editor === true,
            author: profile.author === true || profile.role === "author" || metadataRoles.author === true,
          });
        } else {
          const metadataRoles = (user.app_metadata?.roles || {}) as Record<string, boolean>;
          setCurrentUser({
            ...user,
            admin: metadataRoles.admin === true,
            editor: metadataRoles.editor === true,
            author: metadataRoles.author === true,
          });
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, []);

  const isEditor = currentUser?.editor === true;
  const isAdmin = currentUser?.admin === true;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const submitToMain = async () => {
    if (!article) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      setMessage("You must be logged in to approve an article.");
      return;
    }

    if (!isEditor && !isAdmin) {
      setMessage("You must be an editor or an admin to approve an article.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      setMessage("No profile found for this user.");
      return;
    }

    const { error: insertError } = await supabase.from("articles").insert({
      title: article.title,
      author_id: article.author_id || profile.id,
      author_override: article.author,
      content: article.content,
      image_url: article.displayimg,
      genre: article.genre,
      summary: article.summary,
    });

    if (insertError) {
      console.error("Error approving article:", insertError);
      setMessage(`Failed to approve article: ${insertError.message}`);
      return;
    }

    // Delete from proposed_articles table after successful publication
    const { error: deleteError } = await supabase
      .from("proposed_articles")
      .delete()
      .eq("id", article.id);

    if (deleteError) {
      console.error("Error removing proposed article:", deleteError);
      setMessage(`Article published, but failed to remove from proposed list: ${deleteError.message}`);
      return;
    }

    setMessage("Article approved and published successfully!");
  };

  const rejectArticle = async () => {
    if (!article) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      setMessage("You must be logged in to decline an article.");
      return;
    }

    if (!isEditor && !isAdmin) {
      setMessage("You must be an editor or an admin to decline an article.");
      return;
    }

    const { error } = await supabase.from("proposed_articles").delete().eq("id", article.id);
    if (error) {
      console.error("Error rejecting article:", error);
      setMessage(`Failed to reject article: ${error.message}`);
      return;
    }

    setMessage("Article rejected successfully!");
  }

  useEffect(() => {
    const fetchArticle = async () => {
      // Fetch article + join to profiles to get author username
      const { data, error } = await supabase
        .from("proposed_articles")
        .select(`
          id,
          title,
          content,
          image_url,
          author_override,
          author_id,
          genre,
          summary,
          created_at,
          profiles(
            full_name
          )
        `)
        .eq("id", Number(id))
        .maybeSingle();

      if (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const profileObj = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
        setArticle({
          id: data.id,
          title: data.title,
          author: data.author_override || profileObj?.full_name || "Unknown",
          author_id: data.author_id,
          content: data.content,
          displayimg: data.image_url,
          genre: data.genre,
          summary: data.summary,
          created_at: data.created_at
        });
      }

      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <div>
      <div
        key={article.id}
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          fontFamily: "Times New Roman",
        }}
      >
        <div className="w-3-4 bg-[#F47171]">
          <div className="titlecont">
            <h3>{article.title}</h3>
          </div>

          <p className="titlecont" style={{ paddingBottom: "1.5rem" }}>
            <b>By:</b> {article.author}
          </p>

          <div className="flex flex-col items-center justify-center mb-2" style= {{paddingBottom: "1.5rem"}} >
            <img 
              src={article.displayimg} 
              //className="w-full max-w-[600px] max-h-[500px] object-contain outline-[#b30920] outline outline-3 rounded-lg"
              className="w-2/5 h-2/5 outline-[#b30920] outline outline-3 outline-round-lg" 
            />
            <p style= {{paddingBottom: "1.5rem"}}></p>
            <p  style={{
                    alignSelf: "flex-start",
                    paddingLeft: "30rem",
                      marginTop: "0.75rem",
                      marginBottom: "1.25rem",
                      fontStyle: "italic",
                      color: "#555",
                    }}
            >Published: {formatDate(article.created_at)}</p>
            <div className="article-content">
              <RenderContent content={article.content} />
            </div>
            <div className="text-center" style={{ marginTop: "2rem" }}>
              <p>What would you like do with this article?</p>
              {message && <p>{message}</p>}
            </div>
            <div className="d-flex justify-content-center mx-2">
              <FTRButton
                buttonText="Approve Article"
                onClick = {submitToMain}
                className="flex-fill"
              />

              <FTRButton
                buttonText="Reject Article"
                onClick = {rejectArticle}
                className = "flex-fill"
                style={{width: "115%"}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposedArticle;
