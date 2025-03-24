import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {
  }
  intercept(context: ExecutionContext, next: CallHandler):any{
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if(token){
      try{
        request.user = this.jwtService.decode(token);
      }
      catch (e){
        console.error(e);
      }
    }
    return next;
  }
}