export interface User {
    id: string
    username: string
    avatar?: string
}
  
export interface AuthState {
    user: User | null
    isLoading: boolean
}
  
  