export interface BaseReviewInterface {
    title: string,
    body: string,
    book_ref: string | number,
    user_ref: string | number,
}


export interface ReviewInterfaceFull extends BaseReviewInterface {
    id: string | number,
}
export type ReviewUpdateInterface = Partial<Omit<ReviewInterfaceFull, 'book_ref' | 'user_ref'>>;

export interface ReviewInterface extends ReviewInterfaceFull {
    created_at: Date,
    updated_at: Date
}