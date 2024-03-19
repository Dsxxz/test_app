import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostModel } from './models/posts.model';
import { ObjectId } from 'mongodb';
import { PostsModelDto } from './posts.model.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(PostModel.name) private postModel: Model<PostModel>,
  ) {}

  async findPostById(id: string): Promise<PostModel> {
    return this.postModel.findOne({ _id: new ObjectId(id) });
  }

  async findAllPosts(): Promise<PostModel[]> {
    return this.postModel.find();
  }

  async createPost(dto: PostsModelDto): Promise<PostModel> {
    const post = new this.postModel(dto);
    console.log(post);
    return post.save();
  }

  async updatePost(id: string, dto: Partial<PostsModelDto>) {
    const existingPost = await this.postModel.findById(id);

    if (!existingPost) {
      throw new Error('Blog not found');
    }

    existingPost.title = dto.title;
    existingPost.shortDescription = dto.shortDescription;
    existingPost.content = dto.content;

    return existingPost.save();
  }
}
