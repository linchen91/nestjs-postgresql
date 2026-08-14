import { Injectable, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

const PUBLIC_KEY = 'isPublic';

@Injectable()
export class AuthCheck extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
      super();
    }

    canActivate(contex: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            contex.getHandler(),
            contex.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(contex);
    }
}

