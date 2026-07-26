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

export const createBaseRepository = <T extends { _id: unknown }>(model: Model<T>) => {
  return {
    create: async (data: Partial<T>): Promise<T> => {
      return await model.create(data as unknown as T);
    },

    findById: async (id: string, includeDeleted = false): Promise<T | null> => {
      const filter = { _id: id, ...(includeDeleted ? {} : { isDeleted: false }) } as unknown as FilterQuery<T>;
      return await model.findOne(filter);
    },

    findOne: async (filter: FilterQuery<T>, includeDeleted = false): Promise<T | null> => {
      const finalFilter = { ...filter, ...(includeDeleted ? {} : { isDeleted: false }) };
      return await model.findOne(finalFilter);
    },

    find: async (filter: FilterQuery<T>, includeDeleted = false): Promise<T[]> => {
      const finalFilter = { ...filter, ...(includeDeleted ? {} : { isDeleted: false }) };
      return await model.find(finalFilter).sort({ createdAt: -1 });
    },

    findPaginated: async (filter: FilterQuery<T>, options: PaginationOptions = {}, includeDeleted = false): Promise<PaginatedResult<T>> => {
      const page = Math.max(1, options.page || 1);
      const limit = Math.max(1, Math.min(100, options.limit || 20));
      const skip = (page - 1) * limit;
      const sort = options.sort || { createdAt: -1 };

      const finalFilter = { ...filter, ...(includeDeleted ? {} : { isDeleted: false }) };

      const [data, total] = await Promise.all([
        model.find(finalFilter).sort(sort).skip(skip).limit(limit),
        model.countDocuments(finalFilter),
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    },

    update: async (id: string, updateData: UpdateQuery<T>): Promise<T | null> => {
      return await model.findOneAndUpdate(
        { _id: id, isDeleted: false } as unknown as FilterQuery<T>,
        { ...updateData, $inc: { version: 1 } },
        { new: true, runValidators: true }
      );
    },

    softDelete: async (id: string, deletedByUserId?: string): Promise<T | null> => {
      return await model.findOneAndUpdate(
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
    },

    findBySyncId: async (clientSyncId: string, userId: string): Promise<T | null> => {
      return await model.findOne({ clientSyncId, userId } as unknown as FilterQuery<T>);
    },
  };
};
