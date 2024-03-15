import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, BlogModel } from './models/blogs.model';
import { ObjectId } from 'mongodb';
import { BlogCreateDto } from './models/blogs.model.dto';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(BlogModel.name) private blogModel: Model<BlogDocument>,
  ) {}
  async findAll() {
    return this.blogModel.find({});
  }

  async findOne(id: string) {
    return this.blogModel.findOne({ _id: new ObjectId(id) });
  }

  async createBlog(dto: BlogCreateDto) {
    const createBlog = new this.blogModel(dto);
    return createBlog.save();
  }

  async updateBlog(id: string, dto: Partial<BlogCreateDto>) {
    const existingBlog = await this.blogModel.findById(id);

    if (!existingBlog) {
      throw new Error('Blog not found');
    }

    existingBlog.name = dto.name;
    existingBlog.description = dto.description;
    existingBlog.websiteUrl = dto.websiteUrl;

    return existingBlog.save();
  }
}
