import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel } from '../domain/blogs.entity';
import { BlogCreateDto } from '../api/input-dto/blogs.model.dto';
import { BlogsViewModel } from '../api/view-dto/blogs.view.model';
import { ObjectId } from 'mongodb';
import { ConvertBlogToViewModel } from '../application/helpers/convertBlogToViewModel';
import { BlogDocument } from '../dto/blog.type';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(BlogModel.name) private blogModel: Model<BlogDocument>,
  ) {}
  async findAll(): Promise<BlogsViewModel[] | null> {
    const foundBlogs = await this.blogModel.find();
    return foundBlogs
      ? foundBlogs.map((blog) => {
          return ConvertBlogToViewModel(blog);
        })
      : null;
  }

  async findOne(id: ObjectId): Promise<BlogsViewModel | null> {
    const foundBlog = await this.blogModel.findOne({ _id: id });
    return foundBlog ? ConvertBlogToViewModel(foundBlog) : null;
  }

  async createBlog(dto: BlogCreateDto): Promise<BlogsViewModel> {
    const createBlog = new this.blogModel(dto);
    createBlog.id = createBlog._id.toString();
    createBlog.createdAt = new Date().toISOString();
    createBlog.isMembership = false;
    await createBlog.save();
    return ConvertBlogToViewModel(createBlog);
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
