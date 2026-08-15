import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<{ statusCode: number }>();

    const { method, url, query, params, body } = request as any;

    this.logger.log(
      `--> ${method} ${url} | query=${JSON.stringify(query)} params=${JSON.stringify(params)} body=${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap((data: unknown) => {
        const time = Date.now() - now;
        const statusCode = response.statusCode;

        this.logger.log(
          `<-- ${method} ${url} | status=${statusCode} time=${time}ms result=${this.truncate(data)}`,
        );
      }),
      catchError((err: any) => {
        const time = Date.now() - now;
        const statusCode = err.status || 500;

        this.logger.error(
          `<x- ${method} ${url} | status=${statusCode} time=${time}ms error=${err.message}`,
        );
        throw err;
      }),
    );
  }

  private truncate(data: unknown): string {
    try {
      const json = JSON.stringify(data);
      if (json.length > 1000) {
        return json.substring(0, 1000) + '...(more)';
      }
      return json;
    } catch {
      return '{Cannot stringify result}';
    }
  }
}
