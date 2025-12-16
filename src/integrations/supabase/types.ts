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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bien_media: {
        Row: {
          bien_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          mime_type: string
        }
        Insert: {
          bien_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          mime_type: string
        }
        Update: {
          bien_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          mime_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bien_media_bien_id_fkey"
            columns: ["bien_id"]
            isOneToOne: false
            referencedRelation: "biens"
            referencedColumns: ["id"]
          },
        ]
      }
      bien_shares: {
        Row: {
          bien_id: string
          created_at: string
          id: string
          shared_by_user_id: string
          shared_with_user_id: string
        }
        Insert: {
          bien_id: string
          created_at?: string
          id?: string
          shared_by_user_id: string
          shared_with_user_id: string
        }
        Update: {
          bien_id?: string
          created_at?: string
          id?: string
          shared_by_user_id?: string
          shared_with_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bien_shares_bien_id_fkey"
            columns: ["bien_id"]
            isOneToOne: false
            referencedRelation: "biens"
            referencedColumns: ["id"]
          },
        ]
      }
      biens: {
        Row: {
          adresse: string
          annee_construction: number | null
          ascenseur: boolean | null
          charges_mensuelles: number | null
          chauffage: boolean | null
          climatisation: boolean | null
          code_postal: string | null
          created_at: string
          description: string | null
          id: string
          jardin: boolean | null
          meuble: boolean | null
          nombre_chambres: number | null
          nombre_etages: number | null
          nombre_salles_bain: number | null
          parking: boolean | null
          piscine: boolean | null
          prix_location: number | null
          prix_vente: number | null
          proprietaire_id: string | null
          quartier: string | null
          status: Database["public"]["Enums"]["bien_status"]
          surface_habitable: number | null
          surface_terrain: number | null
          titre: string
          type: Database["public"]["Enums"]["bien_type"]
          type_bien: string | null
          updated_at: string
          ville: string
        }
        Insert: {
          adresse: string
          annee_construction?: number | null
          ascenseur?: boolean | null
          charges_mensuelles?: number | null
          chauffage?: boolean | null
          climatisation?: boolean | null
          code_postal?: string | null
          created_at?: string
          description?: string | null
          id?: string
          jardin?: boolean | null
          meuble?: boolean | null
          nombre_chambres?: number | null
          nombre_etages?: number | null
          nombre_salles_bain?: number | null
          parking?: boolean | null
          piscine?: boolean | null
          prix_location?: number | null
          prix_vente?: number | null
          proprietaire_id?: string | null
          quartier?: string | null
          status?: Database["public"]["Enums"]["bien_status"]
          surface_habitable?: number | null
          surface_terrain?: number | null
          titre: string
          type: Database["public"]["Enums"]["bien_type"]
          type_bien?: string | null
          updated_at?: string
          ville: string
        }
        Update: {
          adresse?: string
          annee_construction?: number | null
          ascenseur?: boolean | null
          charges_mensuelles?: number | null
          chauffage?: boolean | null
          climatisation?: boolean | null
          code_postal?: string | null
          created_at?: string
          description?: string | null
          id?: string
          jardin?: boolean | null
          meuble?: boolean | null
          nombre_chambres?: number | null
          nombre_etages?: number | null
          nombre_salles_bain?: number | null
          parking?: boolean | null
          piscine?: boolean | null
          prix_location?: number | null
          prix_vente?: number | null
          proprietaire_id?: string | null
          quartier?: string | null
          status?: Database["public"]["Enums"]["bien_status"]
          surface_habitable?: number | null
          surface_terrain?: number | null
          titre?: string
          type?: Database["public"]["Enums"]["bien_type"]
          type_bien?: string | null
          updated_at?: string
          ville?: string
        }
        Relationships: [
          {
            foreignKeyName: "biens_proprietaire_id_fkey"
            columns: ["proprietaire_id"]
            isOneToOne: false
            referencedRelation: "proprietaires"
            referencedColumns: ["id"]
          },
        ]
      }
      conditions_proprietaire: {
        Row: {
          bien_id: string | null
          commission_negociable: boolean | null
          conditions_speciales: string | null
          created_at: string
          delai_location: number | null
          delai_vente: number | null
          exclusivite_requise: boolean | null
          horaires_visite: string | null
          id: string
          prix_maximum: number | null
          prix_minimum: number | null
          proprietaire_id: string
          updated_at: string
          visite_accompagnee: boolean | null
        }
        Insert: {
          bien_id?: string | null
          commission_negociable?: boolean | null
          conditions_speciales?: string | null
          created_at?: string
          delai_location?: number | null
          delai_vente?: number | null
          exclusivite_requise?: boolean | null
          horaires_visite?: string | null
          id?: string
          prix_maximum?: number | null
          prix_minimum?: number | null
          proprietaire_id: string
          updated_at?: string
          visite_accompagnee?: boolean | null
        }
        Update: {
          bien_id?: string | null
          commission_negociable?: boolean | null
          conditions_speciales?: string | null
          created_at?: string
          delai_location?: number | null
          delai_vente?: number | null
          exclusivite_requise?: boolean | null
          horaires_visite?: string | null
          id?: string
          prix_maximum?: number | null
          prix_minimum?: number | null
          proprietaire_id?: string
          updated_at?: string
          visite_accompagnee?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "conditions_proprietaire_bien_id_fkey"
            columns: ["bien_id"]
            isOneToOne: false
            referencedRelation: "biens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conditions_proprietaire_proprietaire_id_fkey"
            columns: ["proprietaire_id"]
            isOneToOne: false
            referencedRelation: "proprietaires"
            referencedColumns: ["id"]
          },
        ]
      }
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
      demandes: {
        Row: {
          adresse_complete: string | null
          budget: number | null
          client_nom_complet: string
          created_at: string
          description: string | null
          email: string
          id: string
          latitude: number | null
          longitude: number | null
          status: string | null
          superficie: number | null
          telephone: string | null
          type_bien: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adresse_complete?: string | null
          budget?: number | null
          client_nom_complet: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          status?: string | null
          superficie?: number | null
          telephone?: string | null
          type_bien?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adresse_complete?: string | null
          budget?: number | null
          client_nom_complet?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          status?: string | null
          superficie?: number | null
          telephone?: string | null
          type_bien?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interactions_proprietaire: {
        Row: {
          conseiller_id: string
          created_at: string
          date_interaction: string
          description: string
          id: string
          proprietaire_id: string
          type_interaction: string
        }
        Insert: {
          conseiller_id: string
          created_at?: string
          date_interaction: string
          description: string
          id?: string
          proprietaire_id: string
          type_interaction: string
        }
        Update: {
          conseiller_id?: string
          created_at?: string
          date_interaction?: string
          description?: string
          id?: string
          proprietaire_id?: string
          type_interaction?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_proprietaire_proprietaire_id_fkey"
            columns: ["proprietaire_id"]
            isOneToOne: false
            referencedRelation: "proprietaires"
            referencedColumns: ["id"]
          },
        ]
      }
      mandats: {
        Row: {
          bien_id: string
          commission_fixe: number | null
          commission_pourcentage: number
          conditions_particulieres: string | null
          created_at: string
          created_by: string
          date_debut: string
          date_fin: string
          document_url: string | null
          id: string
          prix_mandat: number | null
          proprietaire_id: string
          status: Database["public"]["Enums"]["mandat_status"]
          type: Database["public"]["Enums"]["mandat_type"]
          updated_at: string
        }
        Insert: {
          bien_id: string
          commission_fixe?: number | null
          commission_pourcentage: number
          conditions_particulieres?: string | null
          created_at?: string
          created_by: string
          date_debut: string
          date_fin: string
          document_url?: string | null
          id?: string
          prix_mandat?: number | null
          proprietaire_id: string
          status?: Database["public"]["Enums"]["mandat_status"]
          type: Database["public"]["Enums"]["mandat_type"]
          updated_at?: string
        }
        Update: {
          bien_id?: string
          commission_fixe?: number | null
          commission_pourcentage?: number
          conditions_particulieres?: string | null
          created_at?: string
          created_by?: string
          date_debut?: string
          date_fin?: string
          document_url?: string | null
          id?: string
          prix_mandat?: number | null
          proprietaire_id?: string
          status?: Database["public"]["Enums"]["mandat_status"]
          type?: Database["public"]["Enums"]["mandat_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mandats_bien_id_fkey"
            columns: ["bien_id"]
            isOneToOne: false
            referencedRelation: "biens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mandats_proprietaire_id_fkey"
            columns: ["proprietaire_id"]
            isOneToOne: false
            referencedRelation: "proprietaires"
            referencedColumns: ["id"]
          },
        ]
      }
      mubawab_scrapping: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          price: string | null
          show_elements: string | null
          thumbnail: string | null
          title: string | null
          url_link: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          price?: string | null
          show_elements?: string | null
          thumbnail?: string | null
          title?: string | null
          url_link?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          price?: string | null
          show_elements?: string | null
          thumbnail?: string | null
          title?: string | null
          url_link?: string | null
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
      proprietaires: {
        Row: {
          adresse: string | null
          cin: string | null
          code_postal: string | null
          created_at: string
          created_by: string
          date_naissance: string | null
          email: string | null
          ice: string | null
          id: string
          nom: string
          notes: string | null
          pays: string | null
          prenom: string | null
          raison_sociale: string | null
          telephone: string
          type: Database["public"]["Enums"]["proprietaire_type"]
          updated_at: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          cin?: string | null
          code_postal?: string | null
          created_at?: string
          created_by: string
          date_naissance?: string | null
          email?: string | null
          ice?: string | null
          id?: string
          nom: string
          notes?: string | null
          pays?: string | null
          prenom?: string | null
          raison_sociale?: string | null
          telephone: string
          type?: Database["public"]["Enums"]["proprietaire_type"]
          updated_at?: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          cin?: string | null
          code_postal?: string | null
          created_at?: string
          created_by?: string
          date_naissance?: string | null
          email?: string | null
          ice?: string | null
          id?: string
          nom?: string
          notes?: string | null
          pays?: string | null
          prenom?: string | null
          raison_sociale?: string | null
          telephone?: string
          type?: Database["public"]["Enums"]["proprietaire_type"]
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
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
      scraping: {
        Row: {
          created_at: string
          date: string
          id: string
          metadata: Json | null
          origin: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          metadata?: Json | null
          origin: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metadata?: Json | null
          origin?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      scraping_images: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          id: string
          image_path: string
          image_url: string | null
          metadata: Json | null
          mime_type: string | null
          scraping_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          id?: string
          image_path: string
          image_url?: string | null
          metadata?: Json | null
          mime_type?: string | null
          scraping_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          id?: string
          image_path?: string
          image_url?: string | null
          metadata?: Json | null
          mime_type?: string | null
          scraping_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraping_images_scraping_id_fkey"
            columns: ["scraping_id"]
            isOneToOne: false
            referencedRelation: "scraping"
            referencedColumns: ["id"]
          },
        ]
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
      create_bien_media: {
        Args: {
          p_bien_id: string
          p_file_name: string
          p_file_path: string
          p_file_size: number
          p_file_type: string
          p_mime_type: string
        }
        Returns: string
      }
      create_property: {
        Args: { p_metadata: Json; p_user_id: string }
        Returns: string
      }
      create_property_media: {
        Args: {
          p_file_name: string
          p_file_path: string
          p_file_size: number
          p_file_type: string
          p_mime_type: string
          p_property_id: string
        }
        Returns: string
      }
      get_user_roles: {
        Args: { user_uuid: string }
        Returns: {
          role_name: string
        }[]
      }
      mask_phone_number: {
        Args: { phone_number: string; proprietaire_created_by: string }
        Returns: string
      }
      user_has_permission: {
        Args: {
          command_name: Database["public"]["Enums"]["command_type"]
          user_uuid: string
        }
        Returns: boolean
      }
      user_has_role: {
        Args: { role_name: string; user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      bien_status: "DISPONIBLE" | "RESERVE" | "VENDU" | "LOUE" | "RETIRE"
      bien_type: "VENTE" | "LOCATION" | "VENTE_LOCATION"
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
      mandat_status: "ACTIF" | "EXPIRE" | "RESILIE" | "SUSPENDU"
      mandat_type: "SIMPLE" | "EXCLUSIF" | "SEMI_EXCLUSIF"
      permission_level: "GLOBAL" | "ACCOUNT" | "OWN"
      proprietaire_type: "PARTICULIER" | "PROMOTEUR" | "FONCIERE"
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
      bien_status: ["DISPONIBLE", "RESERVE", "VENDU", "LOUE", "RETIRE"],
      bien_type: ["VENTE", "LOCATION", "VENTE_LOCATION"],
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
      mandat_status: ["ACTIF", "EXPIRE", "RESILIE", "SUSPENDU"],
      mandat_type: ["SIMPLE", "EXCLUSIF", "SEMI_EXCLUSIF"],
      permission_level: ["GLOBAL", "ACCOUNT", "OWN"],
      proprietaire_type: ["PARTICULIER", "PROMOTEUR", "FONCIERE"],
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
