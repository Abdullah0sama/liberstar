import pino from 'pino';
import { NotAuthorized, NotFound } from '../../common/Errors';
import { generateToken } from '../../common/services/auth/auth';
import { PasswordHash } from '../../common/services/auth/utils';
import { UserRepository } from '../users/userRepository';
import { CredentialsInterface } from './auth.interface';


export class AuthService {
    userRepository: UserRepository;
    logger: pino.Logger
    constructor(logger: pino.Logger) {
        this.logger = logger
        this.userRepository = new UserRepository(logger)
    }
    async passwordAuthentication (cred: CredentialsInterface) {
        try {
            const { password: sentPassword, ...identifiers } = cred;
            const { password, ...userData } = await this.userRepository.getUserWithPassword(identifiers, {
                select: ['username', 'id', 'email', 'password', 'role']
            })
            
            const isPasswordCorrect = await PasswordHash.compareHash(sentPassword, password);
            if(!isPasswordCorrect) {
                throw new NotAuthorized('Wrong identifier or password');
            }
            const token = await generateToken(userData, {
                expiresIn: '5m'
            })
            return token
            } catch(err: unknown) {
                if (err instanceof NotFound) throw new NotAuthorized('Wrong identifier or password');
                throw err;
            }
    }
}