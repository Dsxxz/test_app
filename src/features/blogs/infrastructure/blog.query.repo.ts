import { Injectable } from '@nestjs/common';
import { InputQueryDto } from '../../../core/dto/pagination/input.query.dto';
import { BlogModel } from '../domain/blogs.entity';
import { EnumDirection } from '../../../core/dto/pagination/enum.direction';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from '../dto/blog.type';

@Injectable()
export class BlogQueryRepo {
  constructor(
    @InjectModel(BlogModel.name) private blogModel: Model<BlogDocument>,
  ) {}
  async findByQuery(dto: InputQueryDto): Promise<BlogDocument[]> {
    //Todo: change the input data processing;
    const sd = dto.sortDirection === EnumDirection.asc ? 1 : -1;
    const filter = dto.searchNameTerm
      ? { name: { $regex: dto.searchNameTerm, $options: 'i' } }
      : {};
    //TODO: separate the pagination method;
    return this.blogModel
      .find(filter)
      .sort({ [dto.sortBy]: sd })
      .skip((dto.pageNumber - 1) * dto.pageSize)
      .limit(dto.pageSize)
      .lean();
  }
}
