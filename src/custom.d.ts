
declare namespace Express {
   export interface Request {
      auth?: import('./common/services/auth/auth').authPayloadInterface,
   }
} 