
export class NotFound extends Error {
    readonly statusCode: number = 500
    constructor (msg: string) {
        super(msg)
    }
}