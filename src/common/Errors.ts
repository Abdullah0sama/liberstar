
export class NotFound extends Error {
    readonly statusCode: number = 404
    constructor (msg: string) {
        super(msg)
    }
}

export class NotAuthorized extends Error {
    readonly statusCode: number = 401
    constructor (msg: string) {
        super(msg)
    }
}