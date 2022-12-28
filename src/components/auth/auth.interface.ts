export interface CredentialsInterface  {
    email?: string,
    username?: string,
    id?: string,
    password: string
}

export enum userRoles {
    'user' = 'user',
    'admin' = 'admin',
    'root' = 'root'
} 