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
      conseillers: {
        Row: {
          adresse: string | null
          commission: number | null
          created_at: string
          date_embauche: string | null
          date_naissance: string | null
          email: string
          formation: string | null
          id: string
          langues: string[] | null
          nationalite: string | null
          nom: string
          numero_cin: string | null
          prenom: string
          salaire: number | null
          specialisations: string[] | null
          telephone: string
          updated_at: string
          user_id: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          commission?: number | null
          created_at?: string
          date_embauche?: string | null
          date_naissance?: string | null
          email: string
          formation?: string | null
          id?: string
          langues?: string[] | null
          nationalite?: string | null
          nom: string
          numero_cin?: string | null
          prenom: string
          salaire?: number | null
          specialisations?: string[] | null
          telephone: string
          updated_at?: string
          user_id: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          commission?: number | null
          created_at?: string
          date_embauche?: string | null
          date_naissance?: string | null
          email?: string
          formation?: string | null
          id?: string
          langues?: string[] | null
          nationalite?: string | null
          nom?: string
          numero_cin?: string | null
          prenom?: string
          salaire?: number | null
          specialisations?: string[] | null
          telephone?: string
          updated_at?: string
          user_id?: string
          ville?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          command: Database["public"]["Enums"]["command_type"]
          created_at: string
          description: string | null
          id: string
          name: string
          permission_level: Database["public"]["Enums"]["permission_level"]
        }
        Insert: {
          command: Database["public"]["Enums"]["command_type"]
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
        }
        Update: {
          command?: Database["public"]["Enums"]["command_type"]
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property_media: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          mime_type: string
          property_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          mime_type: string
          property_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          mime_type?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_conseillers: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          conseiller_id: string
          id: string
          task_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          conseiller_id: string
          id?: string
          task_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          conseiller_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_conseillers_conseiller_id_fkey"
            columns: ["conseiller_id"]
            isOneToOne: false
            referencedRelation: "conseillers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_conseillers_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_types: {
        Row: {
          category: Database["public"]["Enums"]["task_category"]
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["task_category"]
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["task_category"]
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          auto_goal: boolean | null
          category: Database["public"]["Enums"]["task_category"]
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          owner_id: string | null
          previous_owner_id: string | null
          progress: number | null
          property_id: string | null
          score: number | null
          sla_hours: number | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          auto_goal?: boolean | null
          category?: Database["public"]["Enums"]["task_category"]
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string | null
          previous_owner_id?: string | null
          progress?: number | null
          property_id?: string | null
          score?: number | null
          sla_hours?: number | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          auto_goal?: boolean | null
          category?: Database["public"]["Enums"]["task_category"]
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string | null
          previous_owner_id?: string | null
          progress?: number | null
          property_id?: string | null
          score?: number | null
          sla_hours?: number | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_performance: {
        Row: {
          created_at: string
          id: string
          score_contrats: number | null
          score_prospection: number | null
          score_visites: number | null
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          score_contrats?: number | null
          score_prospection?: number | null
          score_visites?: number | null
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          score_contrats?: number | null
          score_prospection?: number | null
          score_visites?: number | null
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_property: {
        Args: { p_user_id: string; p_metadata: Json }
        Returns: string
      }
      create_property_media: {
        Args: {
          p_property_id: string
          p_file_name: string
          p_file_path: string
          p_file_type: string
          p_file_size: number
          p_mime_type: string
        }
        Returns: string
      }
      get_user_roles: {
        Args: { user_uuid: string }
        Returns: {
          role_name: string
        }[]
      }
      user_has_permission: {
        Args: {
          user_uuid: string
          command_name: Database["public"]["Enums"]["command_type"]
        }
        Returns: boolean
      }
      user_has_role: {
        Args: { user_uuid: string; role_name: string }
        Returns: boolean
      }
    }
    Enums: {
      command_type:
        | "CREATE_USER"
        | "EDIT_USER"
        | "VIEW_USER"
        | "DELETE_USER"
        | "CREATE_CONSEILLER"
        | "EDIT_CONSEILLER"
        | "VIEW_CONSEILLER"
        | "DELETE_CONSEILLER"
        | "CREATE_PROPERTY"
        | "EDIT_PROPERTY"
        | "VIEW_PROPERTY"
        | "DELETE_PROPERTY"
        | "CREATE_TASK"
        | "EDIT_TASK"
        | "VIEW_TASK"
        | "DELETE_TASK"
        | "VIEW_REPORTS"
        | "MANAGE_ROLES"
        | "MANAGE_PERMISSIONS"
      permission_level: "GLOBAL" | "ACCOUNT" | "OWN"
      task_category: "URGENT" | "IMPORTANT" | "NORMAL" | "AUTO_GOAL"
      task_status:
        | "EN_FILE"
        | "ASSIGNEE"
        | "EN_COURS"
        | "TERMINEE"
        | "EN_RETARD"
        | "REAFFECTEE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      command_type: [
        "CREATE_USER",
        "EDIT_USER",
        "VIEW_USER",
        "DELETE_USER",
        "CREATE_CONSEILLER",
        "EDIT_CONSEILLER",
        "VIEW_CONSEILLER",
        "DELETE_CONSEILLER",
        "CREATE_PROPERTY",
        "EDIT_PROPERTY",
        "VIEW_PROPERTY",
        "DELETE_PROPERTY",
        "CREATE_TASK",
        "EDIT_TASK",
        "VIEW_TASK",
        "DELETE_TASK",
        "VIEW_REPORTS",
        "MANAGE_ROLES",
        "MANAGE_PERMISSIONS",
      ],
      permission_level: ["GLOBAL", "ACCOUNT", "OWN"],
      task_category: ["URGENT", "IMPORTANT", "NORMAL", "AUTO_GOAL"],
      task_status: [
        "EN_FILE",
        "ASSIGNEE",
        "EN_COURS",
        "TERMINEE",
        "EN_RETARD",
        "REAFFECTEE",
      ],
    },
  },
} as const
