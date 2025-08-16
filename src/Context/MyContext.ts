import { IncomingMessage, ServerResponse } from "http";
import { User } from '../entities/User'; 

export interface MyContext {
  req: IncomingMessage;
  res?: ServerResponse;
  user?: User; // The authenticated user
}