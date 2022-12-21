export interface BaseBookInterface {
    title: string,
    image?: string,
    description?: string,
    release_date?: string,
    author: string
}

export interface BookInterfaceFull extends BaseBookInterface {
    id: number | string
}

export interface BookInterface extends BookInterfaceFull {
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