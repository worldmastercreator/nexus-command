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
      reseller_applications: {
        Row: {
          applicant_name: string
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          interview_scheduled_at: string | null
          kyc_status: string
          notes: string | null
          phone: string | null
          reviewer_id: string | null
          state: string | null
          status: string
          territory_requested: string | null
          updated_at: string
        }
        Insert: {
          applicant_name: string
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          interview_scheduled_at?: string | null
          kyc_status?: string
          notes?: string | null
          phone?: string | null
          reviewer_id?: string | null
          state?: string | null
          status?: string
          territory_requested?: string | null
          updated_at?: string
        }
        Update: {
          applicant_name?: string
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          interview_scheduled_at?: string | null
          kyc_status?: string
          notes?: string | null
          phone?: string | null
          reviewer_id?: string | null
          state?: string | null
          status?: string
          territory_requested?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reseller_attendance: {
        Row: {
          created_at: string
          date: string
          employee_id: string
          hours: number
          id: string
          reseller_id: string
          status: string
        }
        Insert: {
          created_at?: string
          date?: string
          employee_id: string
          hours?: number
          id?: string
          reseller_id: string
          status?: string
        }
        Update: {
          created_at?: string
          date?: string
          employee_id?: string
          hours?: number
          id?: string
          reseller_id?: string
          status?: string
        }
        Relationships: []
      }
      reseller_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          meta: Json | null
          reseller_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          meta?: Json | null
          reseller_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          meta?: Json | null
          reseller_id?: string | null
        }
        Relationships: []
      }
      reseller_commissions: {
        Row: {
          amount: number
          created_at: string
          earned_at: string
          id: string
          reseller_id: string
          source: string
          status: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          earned_at?: string
          id?: string
          reseller_id: string
          source: string
          status?: string
          type?: string
        }
        Update: {
          amount?: number
          created_at?: string
          earned_at?: string
          id?: string
          reseller_id?: string
          source?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      reseller_customers: {
        Row: {
          created_at: string
          customer_name: string
          email: string | null
          health_score: number
          id: string
          mrr: number
          plan: string | null
          reseller_id: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          email?: string | null
          health_score?: number
          id?: string
          mrr?: number
          plan?: string | null
          reseller_id: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          email?: string | null
          health_score?: number
          id?: string
          mrr?: number
          plan?: string | null
          reseller_id?: string
          status?: string
        }
        Relationships: []
      }
      reseller_documents: {
        Row: {
          created_at: string
          doc_type: string
          id: string
          name: string
          reseller_id: string
          status: string
          url: string | null
        }
        Insert: {
          created_at?: string
          doc_type: string
          id?: string
          name: string
          reseller_id: string
          status?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          doc_type?: string
          id?: string
          name?: string
          reseller_id?: string
          status?: string
          url?: string | null
        }
        Relationships: []
      }
      reseller_employees: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          reseller_id: string
          role: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          reseller_id: string
          role?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          reseller_id?: string
          role?: string | null
          status?: string
        }
        Relationships: []
      }
      reseller_leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          industry: string | null
          name: string
          phone: string | null
          protected_until: string | null
          registered_deal: boolean
          reseller_id: string | null
          source: string | null
          status: string
          territory: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          name: string
          phone?: string | null
          protected_until?: string | null
          registered_deal?: boolean
          reseller_id?: string | null
          source?: string | null
          status?: string
          territory?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          name?: string
          phone?: string | null
          protected_until?: string | null
          registered_deal?: boolean
          reseller_id?: string | null
          source?: string | null
          status?: string
          territory?: string | null
        }
        Relationships: []
      }
      reseller_licenses: {
        Row: {
          approval_stage: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          customer_name: string
          expires_at: string | null
          id: string
          license_key: string | null
          product: string
          reseller_id: string
        }
        Insert: {
          approval_stage?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          customer_name: string
          expires_at?: string | null
          id?: string
          license_key?: string | null
          product: string
          reseller_id: string
        }
        Update: {
          approval_stage?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          customer_name?: string
          expires_at?: string | null
          id?: string
          license_key?: string | null
          product?: string
          reseller_id?: string
        }
        Relationships: []
      }
      reseller_orders: {
        Row: {
          amount: number
          created_at: string
          customer_name: string
          id: string
          product: string
          reseller_id: string
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          customer_name: string
          id?: string
          product: string
          reseller_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_name?: string
          id?: string
          product?: string
          reseller_id?: string
          status?: string
        }
        Relationships: []
      }
      reseller_payroll: {
        Row: {
          created_at: string
          employee_id: string
          gross: number
          id: string
          net: number
          period: string
          reseller_id: string
          status: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          gross?: number
          id?: string
          net?: number
          period: string
          reseller_id: string
          status?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          gross?: number
          id?: string
          net?: number
          period?: string
          reseller_id?: string
          status?: string
        }
        Relationships: []
      }
      reseller_performance: {
        Row: {
          activity_score: number
          created_at: string
          growth_score: number
          health_score: number
          id: string
          period: string
          reseller_id: string
          revenue_score: number
          total_score: number
        }
        Insert: {
          activity_score?: number
          created_at?: string
          growth_score?: number
          health_score?: number
          id?: string
          period?: string
          reseller_id: string
          revenue_score?: number
          total_score?: number
        }
        Update: {
          activity_score?: number
          created_at?: string
          growth_score?: number
          health_score?: number
          id?: string
          period?: string
          reseller_id?: string
          revenue_score?: number
          total_score?: number
        }
        Relationships: []
      }
      reseller_renewals: {
        Row: {
          amount: number
          created_at: string
          customer_name: string
          due_date: string
          id: string
          product: string | null
          reseller_id: string
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          customer_name: string
          due_date: string
          id?: string
          product?: string | null
          reseller_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_name?: string
          due_date?: string
          id?: string
          product?: string | null
          reseller_id?: string
          status?: string
        }
        Relationships: []
      }
      reseller_territories: {
        Row: {
          assigned: number
          capacity: number
          city: string | null
          country: string
          created_at: string
          district: string | null
          id: string
          industry: string | null
          reseller_id: string | null
          state: string | null
          status: string
        }
        Insert: {
          assigned?: number
          capacity?: number
          city?: string | null
          country: string
          created_at?: string
          district?: string | null
          id?: string
          industry?: string | null
          reseller_id?: string | null
          state?: string | null
          status?: string
        }
        Update: {
          assigned?: number
          capacity?: number
          city?: string | null
          country?: string
          created_at?: string
          district?: string | null
          id?: string
          industry?: string | null
          reseller_id?: string | null
          state?: string | null
          status?: string
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
      is_boss: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "boss" | "admin" | "reseller_manager" | "reseller" | "user"
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
      app_role: ["boss", "admin", "reseller_manager", "reseller", "user"],
    },
  },
} as const
