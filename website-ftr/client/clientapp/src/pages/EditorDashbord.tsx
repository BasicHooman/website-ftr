import React from "react";
import ArticlePreview from "../Stylesheets/ArticlePreview.tsx";
import FTRButton from "../Stylesheets/FTRButton.tsx";
import "../styles/ArticlePreviewStyles.css";
import {useState, useEffect} from "react";
import { supabase } from "../lib/supabaseClient";
import type {ArticleLimited as Article} from "../types.ts";


const PAGE_SIZE = 9;

const EditorDashboard: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchArticles = async (page: number) => {
        setLoading(true);

        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE - 1;

        const { data, error } = await supabase
        .from("proposed_articles")
        .select(
            `
            id,
            title,
            summary,
            image_url,
            genre,
            author_override,
            isApproved,
            profiles!inner(
            full_name
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

        if (!data) {
        setArticles([]);
        setLoading(false);
        return;
        }

        const formatted: Article[] = data.map((a) => ({
        id: a.id,
        title: a.title,
        summary: a.summary,
        displayimg: a.image_url,
        author: a.author_override || a.profiles?.[0]?.full_name || "Unknown",
        genre: a.genre,
        }));

        setArticles(formatted);

        const { count } = await supabase
        .from("proposed_articles")
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
        <div className="bg-[#F47171] justify-center items-center text-center"> 
            <title>Editor Dashboard</title>
            <div className="titlecont">
                <h3 style={{fontFamily: "Times New Roman", color: "black"}}>Editor Dashboard</h3>
            </div>

            <div className="d-flex justify-content-center">
                <div>
                    <div className="editor-article-grid-container">
                    {articles.map((article) => (
                        <ArticlePreview key={article.id} article={article} basePath = "/proposed-articles"/>
                    ))}
                    </div>
                </div>
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-center mx-2">
                <FTRButton
                    buttonText="Previous"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex-fill"
                />

                <FTRButton
                    buttonText="Next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex-fill"
                    style={{ width: "115%" }}
                />
            </div>
        </div>
    );
};

export default EditorDashboard;