import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, BlogModel } from './models/blogs.model';
import { BlogCreateDto } from './models/blogs.model.dto';
import { BlogsViewModel } from './models/blogs.view.model';
import { ObjectId } from 'mongodb';
import { InputQueryDto } from '../pagination/input.query.dto';
import { EnumDirection } from '../pagination/enum.direction';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(BlogModel.name) private blogModel: Model<BlogDocument>,
  ) {}
  async findAll(): Promise<BlogsViewModel[] | null> {
    const foundBlogs = await this.blogModel.find();
    return foundBlogs
      ? foundBlogs.map((blog) => {
          return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
          };
        })
      : null;
  }

  async findOne(id: string): Promise<BlogsViewModel | null> {
    const foundBlog = await this.blogModel.findOne({ id });
    return foundBlog
      ? {
          id: foundBlog.id,
          name: foundBlog.name,
          description: foundBlog.description,
          websiteUrl: foundBlog.websiteUrl,
          createdAt: foundBlog.createdAt,
          isMembership: foundBlog.isMembership,
        }
      : null;
  }

  async createBlog(dto: BlogCreateDto): Promise<BlogsViewModel> {
    const createBlog = new this.blogModel(dto);
    createBlog.id = createBlog._id.toString();
    createBlog.createdAt = new Date().toISOString();
    createBlog.isMembership = false;
    await createBlog.save();
    return {
      id: createBlog.id,
      name: createBlog.name,
      description: createBlog.description,
      websiteUrl: createBlog.websiteUrl,
      createdAt: createBlog.createdAt,
      isMembership: createBlog.isMembership,
    };
  }
  async findBlogById(id: ObjectId): Promise<BlogDocument | null> {
    return this.blogModel.findOne({ _id: id });
  }

  async updateBlog(id: string, dto: Partial<BlogCreateDto>) {
    const existingBlog = await this.findBlogById(new ObjectId(id));

    if (!existingBlog) {
      throw new Error('Blog not found');
    }

    if (dto.name) existingBlog.name = dto.name;
    if (dto.description) existingBlog.description = dto.description;
    if (dto.websiteUrl) existingBlog.websiteUrl = dto.websiteUrl;
    await this.saveBlog(existingBlog);
  }
  async saveBlog(blog: BlogDocument) {
    await blog.save();
  }

  async findByQuery(dto: InputQueryDto): Promise<BlogDocument[]> {
    const sd = dto.sortDirection === EnumDirection.asc ? 1 : -1;
    const filter = dto.searchNameTerm
      ? { name: { $regex: dto.searchNameTerm, $options: 'i' } }
      : {};
    return this.blogModel
      .find(filter)
      .sort({ [dto.sortBy]: sd })
      .skip((dto.pageNumber - 1) * dto.pageSize)
      .limit(dto.pageSize)
      .lean();
  }

  async deleteBlog(id: ObjectId) {
    return this.blogModel.deleteOne({ _id: id });
  }

  async getTotalCount(searchNameTerm?: string) {
    const filter = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: 'i' } }
      : {};
    const blogs = await this.blogModel.find(filter);
    return blogs.length;
  }
}
