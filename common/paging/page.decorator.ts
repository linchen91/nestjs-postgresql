import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type PageQuery = {
  page: number;
  pageSize: number;
  q?: string;
  sort?: string;
  order?: 'ASC' | 'DESC' | 'asc' | 'desc';
  [key: string]: any;
};

export const Page = createParamDecorator((_, ctx: ExecutionContext): PageQuery => {
  const req = ctx.switchToHttp().getRequest();
  const query = req.query ?? {};
  
  const page = query.page ? parseInt(String(query.page), 10) : 1;
  const pageSize = query.pageSize ? parseInt(String(query.pageSize), 10) : 20;

  return {
    ...query,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? Math.min(200, pageSize) : 20,
    q: query.q?.toString(),
    sort: query.sort?.toString(),
    order: (query.order ?? 'ASC').toString() as any,
  };
});