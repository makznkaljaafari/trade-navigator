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
      customers: {
        Row: {
          balance: number
          category: string | null
          city: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          category?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          category?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          date: string
          id: string
          notes: string | null
          trip_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          date?: string
          id?: string
          notes?: string | null
          trip_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          date?: string
          id?: string
          notes?: string | null
          trip_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          id: string
          movement_type: string
          notes: string | null
          product_id: string | null
          quantity: number
          reference_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          movement_type: string
          notes?: string | null
          product_id?: string | null
          quantity: number
          reference_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          movement_type?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          reference_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          date: string
          id: string
          invoice_id: string
          notes: string | null
          payment_method: string
          payment_type: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          date?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_method?: string
          payment_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          date?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_method?: string
          payment_type?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          min_stock: number
          name: string
          notes: string | null
          oem_number: string | null
          purchase_price: number
          quantity_purchased: number
          quantity_sold: number
          rating: number | null
          sale_price: number
          size: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          min_stock?: number
          name: string
          notes?: string | null
          oem_number?: string | null
          purchase_price?: number
          quantity_purchased?: number
          quantity_sold?: number
          rating?: number | null
          sale_price?: number
          size?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          min_stock?: number
          name?: string
          notes?: string | null
          oem_number?: string | null
          purchase_price?: number
          quantity_purchased?: number
          quantity_sold?: number
          rating?: number | null
          sale_price?: number
          size?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchase_invoices: {
        Row: {
          created_at: string
          currency: string
          date: string
          id: string
          invoice_number: string | null
          notes: string | null
          paid_amount: number
          supplier_id: string | null
          trip_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          date?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_amount?: number
          supplier_id?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          date?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_amount?: number
          supplier_id?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_invoices_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_items: {
        Row: {
          brand: string | null
          id: string
          invoice_id: string
          notes: string | null
          oem_number: string | null
          product_id: string | null
          product_name: string
          purchase_price: number
          quantity: number
          sale_price: number
          size: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          oem_number?: string | null
          product_id?: string | null
          product_name: string
          purchase_price?: number
          quantity?: number
          sale_price?: number
          size?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          oem_number?: string | null
          product_id?: string | null
          product_name?: string
          purchase_price?: number
          quantity?: number
          sale_price?: number
          size?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "purchase_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_items: {
        Row: {
          brand: string | null
          id: string
          notes: string | null
          oem_number: string | null
          product_name: string
          purchase_price: number
          quantity: number
          quotation_id: string
          size: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          id?: string
          notes?: string | null
          oem_number?: string | null
          product_name: string
          purchase_price?: number
          quantity?: number
          quotation_id: string
          size?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          id?: string
          notes?: string | null
          oem_number?: string | null
          product_name?: string
          purchase_price?: number
          quantity?: number
          quotation_id?: string
          size?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          supplier_id: string | null
          trip_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          supplier_id?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          supplier_id?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_invoices: {
        Row: {
          created_at: string
          currency: string
          customer_id: string | null
          customer_name: string | null
          date: string
          id: string
          invoice_number: string | null
          notes: string | null
          paid_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_name?: string | null
          date?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_name?: string | null
          date?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_items: {
        Row: {
          brand: string | null
          id: string
          invoice_id: string
          notes: string | null
          oem_number: string | null
          product_id: string | null
          product_name: string
          quantity: number
          sale_price: number
          size: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          oem_number?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          sale_price?: number
          size?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          oem_number?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          sale_price?: number
          size?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          company_address: string | null
          company_email: string | null
          company_logo_url: string | null
          company_name: string | null
          company_phone: string | null
          default_currency: string
          low_stock_threshold: number
          rate_cny_sar: number
          rate_cny_usd: number
          rate_usd_sar: number
          updated_at: string
          user_id: string
        }
        Insert: {
          company_address?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_phone?: string | null
          default_currency?: string
          low_stock_threshold?: number
          rate_cny_sar?: number
          rate_cny_usd?: number
          rate_usd_sar?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          company_address?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_phone?: string | null
          default_currency?: string
          low_stock_threshold?: number
          rate_cny_sar?: number
          rate_cny_usd?: number
          rate_usd_sar?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          arrival_port: string | null
          cartons_count: number
          created_at: string
          departure_port: string | null
          expected_arrival_date: string | null
          id: string
          notes: string | null
          purchase_invoice_id: string | null
          ship_date: string | null
          shipment_number: string
          shipping_company: string | null
          shipping_cost: number
          shipping_type: string
          status: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          arrival_port?: string | null
          cartons_count?: number
          created_at?: string
          departure_port?: string | null
          expected_arrival_date?: string | null
          id?: string
          notes?: string | null
          purchase_invoice_id?: string | null
          ship_date?: string | null
          shipment_number: string
          shipping_company?: string | null
          shipping_cost?: number
          shipping_type?: string
          status?: string
          updated_at?: string
          user_id: string
          weight?: number
        }
        Update: {
          arrival_port?: string | null
          cartons_count?: number
          created_at?: string
          departure_port?: string | null
          expected_arrival_date?: string | null
          id?: string
          notes?: string | null
          purchase_invoice_id?: string | null
          ship_date?: string | null
          shipment_number?: string
          shipping_company?: string | null
          shipping_cost?: number
          shipping_type?: string
          status?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "shipments_purchase_invoice_id_fkey"
            columns: ["purchase_invoice_id"]
            isOneToOne: false
            referencedRelation: "purchase_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          city: string | null
          company_name: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          product_category: string | null
          rating: number | null
          trip_id: string | null
          updated_at: string
          user_id: string
          wechat_or_whatsapp: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          product_category?: string | null
          rating?: number | null
          trip_id?: string | null
          updated_at?: string
          user_id: string
          wechat_or_whatsapp?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          product_category?: string | null
          rating?: number | null
          trip_id?: string | null
          updated_at?: string
          user_id?: string
          wechat_or_whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          end_date: string | null
          id: string
          name: string
          notes: string | null
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
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
