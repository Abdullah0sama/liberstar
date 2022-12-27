export abstract class HttpError extends Error {
    abstract statusCode: number
}

export class NotFound extends HttpError {
    readonly statusCode: number = 404
    constructor (msg='') {
        super(msg)
    }
}

export class NotAuthorized extends HttpError {
    readonly statusCode: number = 401
    constructor (msg='Not Authorized') {
        super(msg)
    }
}

export class UnporcessableEntity extends HttpError {
    readonly statusCode: number = 422
    constructor (msg='') {
        super(msg)
    }
}

export class Forbidden extends HttpError {
    readonly statusCode: number = 403
    constructor (msg='Forbidden') {
        super(msg)
    }
}