import { Model, FilterQuery, UpdateQuery } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BaseRepository<T extends { _id: unknown }> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data as unknown as T);
  }

  async findById(id: string, includeDeleted = false): Promise<T | null> {
    const filter = { _id: id, ...(includeDeleted ? {} : { isDeleted: false }) } as unknown as FilterQuery<T>;
    return await this.model.findOne(filter);
  }

  async findOne(filter: FilterQuery<T>, includeDeleted = false): Promise<T | null> {
    const finalFilter = { ...filter, ...(includeDeleted ? {} : { isDeleted: false }) };
    return await this.model.findOne(finalFilter);
  }

  async find(filter: FilterQuery<T>, includeDeleted = false): Promise<T[]> {
    const finalFilter = { ...filter, ...(includeDeleted ? {} : { isDeleted: false }) };
    return await this.model.find(finalFilter).sort({ createdAt: -1 });
  }

  async findPaginated(filter: FilterQuery<T>, options: PaginationOptions = {}, includeDeleted = false): Promise<PaginatedResult<T>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;
    const sort = options.sort || { createdAt: -1 };

    const finalFilter = { ...filter, ...(includeDeleted ? {} : { isDeleted: false }) };

    const [data, total] = await Promise.all([
      this.model.find(finalFilter).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(finalFilter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(
      { _id: id, isDeleted: false } as unknown as FilterQuery<T>,
      { ...updateData, $inc: { version: 1 } },
      { new: true, runValidators: true }
    );
  }

  async softDelete(id: string, deletedByUserId?: string): Promise<T | null> {
    return await this.model.findOneAndUpdate(
      { _id: id, isDeleted: false } as unknown as FilterQuery<T>,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: deletedByUserId || null,
        },
      },
      { new: true }
    );
  }

  async findBySyncId(clientSyncId: string, userId: string): Promise<T | null> {
    return await this.model.findOne({ clientSyncId, userId } as unknown as FilterQuery<T>);
  }
}
