import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import {
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    try {
      const createdDocument = new this.model({
        ...document,
        _id: new Types.ObjectId(),
      });

      const user = (
        await createdDocument.save()
      ).toJSON() as unknown as TDocument;

      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    populateUser: boolean = false,
  ): Promise<TDocument> {
    let query = this.model.findOne(filterQuery);

    if (populateUser) {
      query = query.populate('messages.user');
    }

    const document = await query.exec();
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    updateQuery: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(
      filterQuery,
      updateQuery,
      {
        new: true,
      },
    );

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  // async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
  //   const users = await this.model.find(filterQuery).lean<TDocument[]>();
  //   return users;
  // }

  async find(
    filterQuery: FilterQuery<TDocument>,
    populateFields?: string[],
  ): Promise<TDocument[]> {
    const query = this.model.find(filterQuery);

    if (populateFields && populateFields.length > 0) {
      populateFields.forEach((field) => {
        query.populate(field);
      });
    }

    query.populate({
      path: 'lastestMessage',
      populate: { path: 'user' },
    });

    return await query.lean<TDocument[]>();
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>();
  }
}
