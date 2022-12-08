export interface BaseBookInterface {
    title: string,
    image?: string,
    description?: string,
    release_date?: Date,
}

export interface BookInterface extends BaseBookInterface {
    id: string, 
    created_at: Date,
    updated_at: Date
}

