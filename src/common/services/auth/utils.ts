import bcrypt from 'bcrypt';

export class PasswordHash {
    private static saltRounds: number = 10;

    static hash(data: string): Promise<string> {
        return bcrypt.hash(data, this.saltRounds)
    }

    static compareHash(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash)
    }

}
