
export class NotFound extends Error {
    readonly statusCode: number = 404
    constructor (msg='') {
        super(msg)
    }
}

export class NotAuthorized extends Error {
    readonly statusCode: number = 401
    constructor (msg='Not Authorized') {
        super(msg)
    }
}

export class UnporcessableEntity extends Error {
    readonly statusCode: number = 422
    constructor (msg='') {
        super(msg)
    }
}

export class Forbidden extends Error {
    readonly statusCode: number = 403
    constructor (msg='Forbidden') {
        super(msg)
    }
}