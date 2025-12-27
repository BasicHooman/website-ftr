import type {User as SupabaseUser} from "@supabase/supabase-js";

export interface AppUser extends SupabaseUser {
    app_metadata: SupabaseUser["app_metadata"] & {
        roles?: {
            admin: boolean;
            editor: boolean;
            author: boolean;
        };
    };
    user_metadata: SupabaseUser["user_metadata"] & {
        full_name?: string;
    };
}

export interface ArticleLimited {
    id: number;
    title: string;
    author: string;
    displayimg: string;
    genre: string;
    summary: string;
    profiles?: string;
    created_at?: string;
}