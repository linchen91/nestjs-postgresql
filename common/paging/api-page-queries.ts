import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

type QueryDef = {
  name: string;
  type?: any;
  example?: any;
  enum?: any[];
  required?: boolean;
  description?: string;
};

export function ApiPagingQueries(options?: {
  search?: QueryDef[];
  filters?: QueryDef[];
}) {
  const base: QueryDef[] = [
    {
      name: 'page',
      type: Number,
      example: 1,
      description: 'page (start from 1)',
    },
    {
      name: 'pageSize',
      type: Number,
      example: 20,
      description: 'page size',
    },
    {
      name: 'sort',
      type: String,
      example: 'name',
      description: 'sort',
    },
    {
      name: 'order',
      enum: ['ASC', 'DESC'],
      example: 'ASC',
      description: 'sort direction',
    },
  ];

  const all = [
    ...base,
    ...(options?.search ?? []),
    ...(options?.filters ?? []),
  ];

  return applyDecorators(
    ...all.map((q) =>
      ApiQuery({
        name: q.name,
        required: q.required ?? false,
        type: q.type,
        enum: q.enum,
        example: q.example,
        description: q.description,
      }),
    ),
  );
}
