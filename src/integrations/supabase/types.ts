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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      mod_affiliates: {
        Row: {
          clicks: number
          commission: number
          conversions: number
          created_at: string
          handle: string
          id: string
          tier: string
        }
        Insert: {
          clicks?: number
          commission?: number
          conversions?: number
          created_at?: string
          handle: string
          id?: string
          tier?: string
        }
        Update: {
          clicks?: number
          commission?: number
          conversions?: number
          created_at?: string
          handle?: string
          id?: string
          tier?: string
        }
        Relationships: []
      }
      mod_authors: {
        Row: {
          created_at: string
          handle: string
          id: string
          items: number
          name: string
          revenue: number
          status: string
        }
        Insert: {
          created_at?: string
          handle: string
          id?: string
          items?: number
          name: string
          revenue?: number
          status?: string
        }
        Update: {
          created_at?: string
          handle?: string
          id?: string
          items?: number
          name?: string
          revenue?: number
          status?: string
        }
        Relationships: []
      }
      mod_books: {
        Row: {
          author: string
          created_at: string
          id: string
          isbn: string
          revenue: number
          sales: number
          status: string
          title: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          isbn: string
          revenue?: number
          sales?: number
          status?: string
          title: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          isbn?: string
          revenue?: number
          sales?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      mod_customers: {
        Row: {
          created_at: string
          email: string
          id: string
          ltv: number
          name: string
          plan: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ltv?: number
          name: string
          plan?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ltv?: number
          name?: string
          plan?: string
          status?: string
        }
        Relationships: []
      }
      mod_franchises: {
        Row: {
          created_at: string
          id: string
          locations: number
          name: string
          region: string
          revenue: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          locations?: number
          name: string
          region: string
          revenue?: number
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          locations?: number
          name?: string
          region?: string
          revenue?: number
          status?: string
        }
        Relationships: []
      }
      mod_influencers: {
        Row: {
          created_at: string
          deals: number
          engagement: number
          followers: number
          handle: string
          id: string
          platform: string
        }
        Insert: {
          created_at?: string
          deals?: number
          engagement?: number
          followers?: number
          handle: string
          id?: string
          platform: string
        }
        Update: {
          created_at?: string
          deals?: number
          engagement?: number
          followers?: number
          handle?: string
          id?: string
          platform?: string
        }
        Relationships: []
      }
      mod_licenses: {
        Row: {
          created_at: string
          customer: string
          expires_at: string
          id: string
          license_key: string
          product: string
          status: string
        }
        Insert: {
          created_at?: string
          customer: string
          expires_at?: string
          id?: string
          license_key: string
          product: string
          status?: string
        }
        Update: {
          created_at?: string
          customer?: string
          expires_at?: string
          id?: string
          license_key?: string
          product?: string
          status?: string
        }
        Relationships: []
      }
      mod_marketplace: {
        Row: {
          author: string
          category: string
          created_at: string
          id: string
          price: number
          revenue: number
          sales: number
          status: string
          title: string
        }
        Insert: {
          author: string
          category: string
          created_at?: string
          id?: string
          price?: number
          revenue?: number
          sales?: number
          status?: string
          title: string
        }
        Update: {
          author?: string
          category?: string
          created_at?: string
          id?: string
          price?: number
          revenue?: number
          sales?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      mod_orders: {
        Row: {
          amount: number
          created_at: string
          customer: string
          id: string
          order_no: string
          product: string
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          customer: string
          id?: string
          order_no: string
          product: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer?: string
          id?: string
          order_no?: string
          product?: string
          status?: string
        }
        Relationships: []
      }
      mod_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          method: string
          status: string
          txn_no: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          method: string
          status?: string
          txn_no: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          method?: string
          status?: string
          txn_no?: string
        }
        Relationships: []
      }
      mod_products: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          price: number
          refs: number
          sku: string
          status: string
          units: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          price?: number
          refs?: number
          sku: string
          status?: string
          units?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          price?: number
          refs?: number
          sku?: string
          status?: string
          units?: number
        }
        Relationships: []
      }
      mod_resellers: {
        Row: {
          commission: number
          created_at: string
          id: string
          name: string
          sales: number
          status: string
          tier: string
        }
        Insert: {
          commission?: number
          created_at?: string
          id?: string
          name: string
          sales?: number
          status?: string
          tier?: string
        }
        Update: {
          commission?: number
          created_at?: string
          id?: string
          name?: string
          sales?: number
          status?: string
          tier?: string
        }
        Relationships: []
      }
      mod_subscriptions: {
        Row: {
          created_at: string
          customer: string
          id: string
          mrr: number
          plan: string
          renewed_at: string
          status: string
        }
        Insert: {
          created_at?: string
          customer: string
          id?: string
          mrr?: number
          plan: string
          renewed_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          customer?: string
          id?: string
          mrr?: number
          plan?: string
          renewed_at?: string
          status?: string
        }
        Relationships: []
      }
      mod_tenants: {
        Row: {
          created_at: string
          id: string
          mrr: number
          plan: string
          seats: number
          slug: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          mrr?: number
          plan?: string
          seats?: number
          slug: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          mrr?: number
          plan?: string
          seats?: number
          slug?: string
          status?: string
        }
        Relationships: []
      }
      mod_white_label_brands: {
        Row: {
          created_at: string
          domain: string
          id: string
          name: string
          plan: string
          status: string
          tenants: number
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          name: string
          plan?: string
          status?: string
          tenants?: number
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          name?: string
          plan?: string
          status?: string
          tenants?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
