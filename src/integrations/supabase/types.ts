export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          created_at: string
          id: string
          language: string
          message: string
          mode: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          message: string
          mode: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          message?: string
          mode?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      ebook_chapters: {
        Row: {
          chapter_number: number
          content: string | null
          created_at: string
          ebook_id: string
          id: string
          title: string
        }
        Insert: {
          chapter_number: number
          content?: string | null
          created_at?: string
          ebook_id: string
          id?: string
          title: string
        }
        Update: {
          chapter_number?: number
          content?: string | null
          created_at?: string
          ebook_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ebook_chapters_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      ebooks: {
        Row: {
          author: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          file_type: string | null
          file_url: string | null
          grade_level: string | null
          id: string
          language: string | null
          mode: string
          stream: string | null
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          language?: string | null
          mode: string
          stream?: string | null
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          language?: string | null
          mode?: string
          stream?: string | null
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_analytics: {
        Row: {
          activity_type: string
          created_at: string
          duration_seconds: number | null
          id: string
          metadata: Json | null
          mode: string
          subject: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          mode: string
          subject?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          mode?: string
          subject?: string | null
          user_id?: string
        }
        Relationships: []
      }
      legal_cases: {
        Row: {
          arguments_defense: string | null
          arguments_prosecution: string | null
          case_date: string | null
          case_name: string
          case_type: string
          citation: string
          court: string
          created_at: string
          facts: string | null
          id: string
          judgment: string | null
          legal_sections: string[] | null
          related_acts: string[] | null
          summary: string | null
          video_url: string | null
          year: number
        }
        Insert: {
          arguments_defense?: string | null
          arguments_prosecution?: string | null
          case_date?: string | null
          case_name: string
          case_type: string
          citation: string
          court: string
          created_at?: string
          facts?: string | null
          id?: string
          judgment?: string | null
          legal_sections?: string[] | null
          related_acts?: string[] | null
          summary?: string | null
          video_url?: string | null
          year: number
        }
        Update: {
          arguments_defense?: string | null
          arguments_prosecution?: string | null
          case_date?: string | null
          case_name?: string
          case_type?: string
          citation?: string
          court?: string
          created_at?: string
          facts?: string | null
          id?: string
          judgment?: string | null
          legal_sections?: string[] | null
          related_acts?: string[] | null
          summary?: string | null
          video_url?: string | null
          year?: number
        }
        Relationships: []
      }
      mock_court_sessions: {
        Row: {
          case_id: string | null
          completed_at: string | null
          feedback: string | null
          id: string
          recording_url: string | null
          role: string
          score: number | null
          session_data: Json | null
          started_at: string
          user_id: string
          verdict: string | null
        }
        Insert: {
          case_id?: string | null
          completed_at?: string | null
          feedback?: string | null
          id?: string
          recording_url?: string | null
          role: string
          score?: number | null
          session_data?: Json | null
          started_at?: string
          user_id: string
          verdict?: string | null
        }
        Update: {
          case_id?: string | null
          completed_at?: string | null
          feedback?: string | null
          id?: string
          recording_url?: string | null
          role?: string
          score?: number | null
          session_data?: Json | null
          started_at?: string
          user_id?: string
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_court_sessions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "legal_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_mode: string | null
          email: string | null
          full_name: string | null
          id: string
          preferred_language: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_mode?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          preferred_language?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_mode?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          preferred_language?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          created_at: string
          id: string
          mode: string
          quiz_data: Json | null
          score: number
          subject: string
          time_taken_seconds: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mode: string
          quiz_data?: Json | null
          score: number
          subject: string
          time_taken_seconds?: number | null
          total_questions: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mode?: string
          quiz_data?: Json | null
          score?: number
          subject?: string
          time_taken_seconds?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          current_chapter_id: string | null
          current_page: number | null
          ebook_id: string
          id: string
          last_read_at: string
          progress_percentage: number | null
          total_pages: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          current_chapter_id?: string | null
          current_page?: number | null
          ebook_id: string
          id?: string
          last_read_at?: string
          progress_percentage?: number | null
          total_pages?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          current_chapter_id?: string | null
          current_page?: number | null
          ebook_id?: string
          id?: string
          last_read_at?: string
          progress_percentage?: number | null
          total_pages?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_current_chapter_id_fkey"
            columns: ["current_chapter_id"]
            isOneToOne: false
            referencedRelation: "ebook_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bookmarks: {
        Row: {
          chapter_id: string | null
          created_at: string
          ebook_id: string
          id: string
          note: string | null
          page_number: number | null
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          ebook_id: string
          id?: string
          note?: string | null
          page_number?: number | null
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          ebook_id?: string
          id?: string
          note?: string | null
          page_number?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "ebook_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_highlights: {
        Row: {
          chapter_id: string | null
          color: string | null
          created_at: string
          ebook_id: string
          highlighted_text: string
          id: string
          note: string | null
          page_number: number | null
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          color?: string | null
          created_at?: string
          ebook_id: string
          highlighted_text: string
          id?: string
          note?: string | null
          page_number?: number | null
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          color?: string | null
          created_at?: string
          ebook_id?: string
          highlighted_text?: string
          id?: string
          note?: string | null
          page_number?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_highlights_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "ebook_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_highlights_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_modes: {
        Row: {
          created_at: string
          grade_level: string | null
          id: string
          mode: string
          preferred_language: string | null
          stream: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          grade_level?: string | null
          id?: string
          mode: string
          preferred_language?: string | null
          stream?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          grade_level?: string | null
          id?: string
          mode?: string
          preferred_language?: string | null
          stream?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
