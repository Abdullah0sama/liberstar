export interface BaseBookInterface {
    title: string,
    image?: string,
    description?: string,
    release_date?: string,
}

export interface BookInterfaceFull extends BaseBookInterface {
    id: number | string
}

export interface BookInterface extends BookInterfaceFull {
    created_at: Date,
    updated_at: Date
}

