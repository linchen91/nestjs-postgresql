import { Injectable } from "@nestjs/common";
import { Repository, ObjectLiteral } from 'typeorm';
import { paginate, PaginatedResult } from './paginate';
import { PageQuery } from "./page.decorator";

export type PagingConfig<T> = {
  alias: string;
  search?: (keyof T | string)[];
  searchByParam?: Record<string, (keyof T | string)[]>;
  filters?: (keyof T | string)[];
  sort?: (keyof T | string)[];
  defaultSort?: { field: string; order: 'ASC' | 'DESC' };
  base?: any;
};

@Injectable()
export class PagingService {
  run<T extends ObjectLiteral>(
    repo: Repository<T>,
    query: PageQuery,
    cfg: PagingConfig<T>,
  ): Promise<PaginatedResult<T>> {
    let pickedkey: string | undefined;
    if (cfg.searchByParam) {
      pickedkey = Object.keys(cfg.searchByParam).find((k) => {
        const value = query[k];
        return value !== undefined && value !== null && String(value).trim() !== '';
      });
    }

    if (pickedkey) {
      query.q = String(query[pickedkey]).trim();
    }
    const searchFields = pickedkey ? cfg.searchByParam![pickedkey] : cfg.search;

    return paginate(repo, {
      alias: cfg.alias,
      query,
      searchFields,
      filterFields: cfg.filters,
      allowedSortFields: cfg.sort,
      defaultSort: cfg.defaultSort,
      base: cfg.base,
    });
  }
}
