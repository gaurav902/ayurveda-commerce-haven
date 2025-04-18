export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string
          created_at: string | null
          id: string
          is_default: boolean | null
          pincode: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          pincode: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          pincode?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string | null
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          updated_at: string | null
        }
        Insert: {
          cart_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          cart_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      checkup_applications: {
        Row: {
          age: number
          allergies: string
          birthmarks: string | null
          blood_group: string
          created_at: string
          current_medications: string | null
          email: string
          full_name: string
          gender: string
          hair_problem: string
          id: string
          medical_conditions: string
          phone: string
          previous_treatments: string | null
          report_url: string | null
          selfie_urls: string[]
          skin_problem: string
          status: string
          updated_at: string
          user_id: string
          want_consultation: boolean | null
        }
        Insert: {
          age: number
          allergies: string
          birthmarks?: string | null
          blood_group: string
          created_at?: string
          current_medications?: string | null
          email: string
          full_name: string
          gender: string
          hair_problem: string
          id?: string
          medical_conditions: string
          phone: string
          previous_treatments?: string | null
          report_url?: string | null
          selfie_urls: string[]
          skin_problem: string
          status?: string
          updated_at?: string
          user_id: string
          want_consultation?: boolean | null
        }
        Update: {
          age?: number
          allergies?: string
          birthmarks?: string | null
          blood_group?: string
          created_at?: string
          current_medications?: string | null
          email?: string
          full_name?: string
          gender?: string
          hair_problem?: string
          id?: string
          medical_conditions?: string
          phone?: string
          previous_treatments?: string | null
          report_url?: string | null
          selfie_urls?: string[]
          skin_problem?: string
          status?: string
          updated_at?: string
          user_id?: string
          want_consultation?: boolean | null
        }
        Relationships: []
      }
      checkup_chat_messages: {
        Row: {
          application_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
          sender_type: string
          updated_at: string
        }
        Insert: {
          application_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
          sender_type: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          sender_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkup_chat_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "checkup_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          discount_percentage: number
          expires_at: string | null
          id: string
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          discount_percentage: number
          expires_at?: string | null
          id?: string
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          discount_percentage?: number
          expires_at?: string | null
          id?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          created_at: string
          email: string
          full_name: string
          hospital: string | null
          id: string
          license_number: string
          license_url: string | null
          phone: string
          specialization: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          hospital?: string | null
          id: string
          license_number: string
          license_url?: string | null
          phone: string
          specialization: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          hospital?: string | null
          id?: string
          license_number?: string
          license_url?: string | null
          phone?: string
          specialization?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      kit_recommendations: {
        Row: {
          additional_notes: string | null
          application_id: string
          created_at: string
          diagnosis: string
          id: string
          products: Json
          require_followup: boolean | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          application_id: string
          created_at?: string
          diagnosis: string
          id?: string
          products: Json
          require_followup?: boolean | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          application_id?: string
          created_at?: string
          diagnosis?: string
          id?: string
          products?: Json
          require_followup?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kit_recommendations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "checkup_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          receive_notifications: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          receive_notifications?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          receive_notifications?: boolean | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          product_name: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_id: string | null
          created_at: string | null
          discount_amount: number
          id: string
          order_notes: string | null
          payment_method: string
          payment_status: string
          shipping_address: string
          shipping_city: string
          shipping_phone: string
          shipping_pincode: string
          shipping_state: string
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string | null
          discount_amount?: number
          id?: string
          order_notes?: string | null
          payment_method: string
          payment_status?: string
          shipping_address: string
          shipping_city: string
          shipping_phone: string
          shipping_pincode: string
          shipping_state: string
          status?: string
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_id?: string | null
          created_at?: string | null
          discount_amount?: number
          id?: string
          order_notes?: string | null
          payment_method?: string
          payment_status?: string
          shipping_address?: string
          shipping_city?: string
          shipping_phone?: string
          shipping_pincode?: string
          shipping_state?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_number: string
          card_type: string
          cardholder_name: string
          created_at: string | null
          expiry_month: string
          expiry_year: string
          id: string
          is_default: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_number: string
          card_type: string
          cardholder_name: string
          created_at?: string | null
          expiry_month: string
          expiry_year: string
          id?: string
          is_default?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_number?: string
          card_type?: string
          cardholder_name?: string
          created_at?: string | null
          expiry_month?: string
          expiry_year?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
