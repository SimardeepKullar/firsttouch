
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "holidays": {
                  Row: {
                    "active": boolean,"holiday_date": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"holiday_date": string,"name": string
                  }
                  Update: {
                    "active"?: boolean,"holiday_date"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"job_errors": {
                  Row: {
                    "created_at": string,"detail": string | null,"id": number,"source": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"detail"?: string | null,"id"?: never,"source": string
                  }
                  Update: {
                    "created_at"?: string,"detail"?: string | null,"id"?: never,"source"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "active": boolean,"created_at": string,"email": string,"full_name": string,"id": string,"plays": boolean,"position": Database["public"]['Enums']["position"],"role": Database["public"]['Enums']["user_role"],"stars": number
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"created_at"?: string,"email": string,"full_name": string,"id": string,"plays"?: boolean,"position"?: Database["public"]['Enums']["position"],"role"?: Database["public"]['Enums']["user_role"],"stars"?: number
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string,"email"?: string,"full_name"?: string,"id"?: string,"plays"?: boolean,"position"?: Database["public"]['Enums']["position"],"role"?: Database["public"]['Enums']["user_role"],"stars"?: number
                  }
                  Relationships: [
                    
                  ]
                },"push_subscriptions": {
                  Row: {
                    "auth": string,"created_at": string,"endpoint": string,"id": string,"p256dh": string,"player_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "auth": string,"created_at"?: string,"endpoint": string,"id"?: string,"p256dh": string,"player_id": string
                  }
                  Update: {
                    "auth"?: string,"created_at"?: string,"endpoint"?: string,"id"?: string,"p256dh"?: string,"player_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "push_subscriptions_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "player_directory"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "push_subscriptions_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"rsvps": {
                  Row: {
                    "going": boolean,"morning_of": boolean,"player_id": string,"responded_at": string,"run_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "going": boolean,"morning_of"?: boolean,"player_id": string,"responded_at"?: string,"run_id": string
                  }
                  Update: {
                    "going"?: boolean,"morning_of"?: boolean,"player_id"?: string,"responded_at"?: string,"run_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "rsvps_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "player_directory"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "rsvps_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "rsvps_run_id_fkey"
      columns: ["run_id"]
isOneToOne: false
      referencedRelation: "runs"
      referencedColumns: ["id"]
    }
                  ]
                },"runs": {
                  Row: {
                    "id": string,"location": string,"published_at": string | null,"run_date": string,"season_id": string,"start_time": string,"status": Database["public"]['Enums']["run_status"],"team_count_override": number | null,"run_lock_at": string | null
                  }
                  ComputedFields: "run_lock_at"
                  Insert: {
                    "id"?: string,"location": string,"published_at"?: string | null,"run_date": string,"season_id": string,"start_time": string,"status"?: Database["public"]['Enums']["run_status"],"team_count_override"?: number | null
                  }
                  Update: {
                    "id"?: string,"location"?: string,"published_at"?: string | null,"run_date"?: string,"season_id"?: string,"start_time"?: string,"status"?: Database["public"]['Enums']["run_status"],"team_count_override"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "runs_season_id_fkey"
      columns: ["season_id"]
isOneToOne: false
      referencedRelation: "seasons"
      referencedColumns: ["id"]
    }
                  ]
                },"season_passes": {
                  Row: {
                    "amount_cents": number | null,"marked_at": string | null,"marked_by": string | null,"method": string | null,"paid": boolean,"player_id": string,"season_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_cents"?: number | null,"marked_at"?: string | null,"marked_by"?: string | null,"method"?: string | null,"paid"?: boolean,"player_id": string,"season_id": string
                  }
                  Update: {
                    "amount_cents"?: number | null,"marked_at"?: string | null,"marked_by"?: string | null,"method"?: string | null,"paid"?: boolean,"player_id"?: string,"season_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "season_passes_marked_by_fkey"
      columns: ["marked_by"]
isOneToOne: false
      referencedRelation: "player_directory"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "season_passes_marked_by_fkey"
      columns: ["marked_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "season_passes_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "player_directory"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "season_passes_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "season_passes_season_id_fkey"
      columns: ["season_id"]
isOneToOne: false
      referencedRelation: "seasons"
      referencedColumns: ["id"]
    }
                  ]
                },"seasons": {
                  Row: {
                    "default_location": string,"default_start_time": string,"ends_on": string | null,"id": string,"is_current": boolean,"name": string,"pass_price_cents": number,"starts_on": string | null,"type": Database["public"]['Enums']["season_type"]
                  }
                  ComputedFields: never
                  Insert: {
                    "default_location": string,"default_start_time": string,"ends_on"?: string | null,"id"?: string,"is_current"?: boolean,"name": string,"pass_price_cents"?: number,"starts_on"?: string | null,"type": Database["public"]['Enums']["season_type"]
                  }
                  Update: {
                    "default_location"?: string,"default_start_time"?: string,"ends_on"?: string | null,"id"?: string,"is_current"?: boolean,"name"?: string,"pass_price_cents"?: number,"starts_on"?: string | null,"type"?: Database["public"]['Enums']["season_type"]
                  }
                  Relationships: [
                    
                  ]
                },"team_assignments": {
                  Row: {
                    "player_id": string,"run_id": string,"slot": number,"team": Database["public"]['Enums']["team_color"]
                  }
                  ComputedFields: never
                  Insert: {
                    "player_id": string,"run_id": string,"slot": number,"team": Database["public"]['Enums']["team_color"]
                  }
                  Update: {
                    "player_id"?: string,"run_id"?: string,"slot"?: number,"team"?: Database["public"]['Enums']["team_color"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "team_assignments_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "player_directory"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "team_assignments_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "team_assignments_run_id_fkey"
      columns: ["run_id"]
isOneToOne: false
      referencedRelation: "runs"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "player_directory": {
                  Row: {
                    "full_name": string,"id": string,"is_me": boolean | null,"plays": boolean,"position": Database["public"]['Enums']["position"]
                  }
                  ComputedFields: never
                  Insert: {
                           "full_name"?: string | null,"id"?: string | null,"is_me"?: never,"plays"?: boolean | null,"position"?: Database["public"]['Enums']["position"] | null
                         }
                        Update: {
                           "full_name"?: string | null,"id"?: string | null,"is_me"?: never,"plays"?: boolean | null,"position"?: Database["public"]['Enums']["position"] | null
                         }
                        Relationships: [
                    
                  ]
                },"run_roster": {
                  Row: {
                    "flag_morning_of": boolean,"flag_unpaid": boolean | null,"full_name": string,"player_id": string,"position": Database["public"]['Enums']["position"],"responded_at": string,"run_id": string,"stars": number | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "rsvps_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "player_directory"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "rsvps_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "rsvps_run_id_fkey"
      columns: ["run_id"]
isOneToOne: false
      referencedRelation: "runs"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "delete_my_account":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"fill_holidays":
{ Args: { "y": number }; Returns: undefined
                           },
"generate_season_runs":
{ Args: { "season_id": string }; Returns: number
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"my_plays":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"nth_monday":
{ Args: { "m": number,"n": number,"y": number }; Returns: string
                           },
"ontario_monday_holidays":
{ Args: { "y": number }; Returns: {
              "holiday_date": string,"name": string
            }[]
                           },
"run_lock_at":
{ Args: { "r": Omit<Database["public"]['Tables']["runs"]['Row'], Database["public"]['Tables']["runs"]['ComputedFields']> }; Returns: string
                           },
"set_holiday_active":
{ Args: { "active": boolean,"holiday_date": string }; Returns: undefined
                           },
"update_my_name":
{ Args: { "new_name": string }; Returns: undefined
                           }
          }
          Enums: {
            "position": "attack"|"defend","run_status": "open"|"locked"|"published"|"cancelled","season_type": "indoor"|"outdoor","team_color": "blue"|"yellow"|"red","user_role": "player"|"admin"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "position": ["attack", "defend"],"run_status": ["open", "locked", "published", "cancelled"],"season_type": ["indoor", "outdoor"],"team_color": ["blue", "yellow", "red"],"user_role": ["player", "admin"]
          }
        }
} as const
