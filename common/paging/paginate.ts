import { Brackets, Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PageQuery } from './page.decorator';

export type PaginatedResult<T> = {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type PaginateOptions<T extends ObjectLiteral> = {
  alias: string;
  query: PageQuery;
  searchFields?: (keyof T | string)[];
  filterFields?: (keyof T | string)[];
  allowedSortFields?: (keyof T | string)[];
  defaultSort?: { field: string; order: 'ASC' | 'DESC' };
  base?: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>;
};

export async function paginate<T extends ObjectLiteral>(
  repo: Repository<T>,
  opt: PaginateOptions<T>,
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, Number(opt.query.page ?? 1));
  const pageSize = Math.min(200, Math.max(1, Number(opt.query.pageSize ?? 20)));
  const skip = (page - 1) * pageSize;

  let qb = repo.createQueryBuilder(opt.alias);
  if (opt.base) qb = opt.base(qb);

  const q = (opt.query.q ?? '').trim();
  if (q && opt.searchFields?.length) {
    qb.andWhere(
      new Brackets((x) => {
        opt.searchFields?.forEach((f, idx) => {
          const col = `${opt.alias}.${String(f)}`;
          x.andWhere(`${col} LIKE :kw${idx}`, { [`kw${idx}`]: `%${q}%` });
        });
      }),
    );
  }

  if (opt.filterFields?.length) {
    for (const f of opt.filterFields) {
      const key = String(f);
      const val = opt.query[key];
      if (val === undefined || val === null || val === '') continue;
      qb.andWhere(`${opt.alias}.${key} = :${key}`, { [key]: val });
    }
  }

  const order = String(
    opt.query.order ?? opt.defaultSort?.order ?? 'ASC',
  ).toUpperCase() as 'ASC' | 'DESC';

  let sortField = opt.query.sort
    ? String(opt.query.sort)
    : opt.defaultSort?.field;

  if (sortField) {
    if (opt.allowedSortFields?.length) {
      const ok = opt.allowedSortFields.map(String).includes(sortField);
      if (!ok) sortField = opt.defaultSort?.field ?? undefined;
    }
    if (sortField) qb.orderBy(`${opt.alias}.${sortField}`, order);
  }

  qb.skip(skip).take(pageSize);
  const [rows, total] = await qb.getManyAndCount();
  return { rows, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
