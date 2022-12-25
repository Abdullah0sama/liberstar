export interface BaseUserInterface {
    name: string,
    dob: string | Date,
    username: string,
    bio?: string,
    image?: string,
    email: string,
    password: string
}


export interface UserInterfaceFull extends BaseUserInterface {
    id: string | number
}

export interface UserInterface extends BaseUserInterface {
    created_at: Date,
    updated_at: Date
}

export interface ListInterface {
    select?: string | string[],
    order_by?: 'asc'| 'desc',
    sort_by?: string,
    limit?: number,
    offset?: number
}

export interface GetInterface {
    select?: string | string[]
}

export enum userIdentifiers {
    username = 'useranme',
    id = 'id',
    email = 'email'
}