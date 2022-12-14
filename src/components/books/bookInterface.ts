export interface BaseBookInterface {
    title: string,
    image?: string,
    description?: string,
    release_date?: string,
}

export interface BookInterfaceMain extends BaseBookInterface {
    id: number | string
}

export interface BookInterface extends BookInterfaceMain {
    created_at: Date,
    updated_at: Date
}

