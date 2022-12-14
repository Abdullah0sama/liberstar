export interface BaseUserInterface {
    name: string,
    dob: string | Date,
    username: string,
    bio?: string,
    image?: string,
}

export interface UserInterfaceFull extends BaseUserInterface {
    id: string | number
}

export interface UserInterface extends BaseUserInterface {
    created_at: Date,
    updated_at: Date
}