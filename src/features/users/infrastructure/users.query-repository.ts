import { InjectModel } from "@nestjs/mongoose";
import { UserModel } from "../domain/users.entity";
import { HttpException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { UserViewDto } from "../dto/users.view-dto";
import { getPageInfo, QueryDto } from "../../../core/dto/pagination/user.query.dto";
import { EnumDirection } from "../../../core/dto/pagination/enum.direction";
import { UserDocument } from "../dto/user.type";
import { Paginator } from "../../../core/dto/pagination/paginator";


@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(UserModel.name) private UserModel: Model<UserModel>) {
  }
  async findUserById(userId: string) {
    const user = await this.UserModel.findOne({ id: new ObjectId(userId)}) ;
    if(!user) {
      throw new HttpException('user not found', 404);
    }
    return UserViewDto.mapToView(user);
  }
  async findAllUsers(dto: Partial<QueryDto>) {
    const { searchEmailTerm, searchLoginTerm, sortBy, sortDirection, pageNumber, pageSize } = getPageInfo(dto);

    const filters = {
      $or: [
        searchEmailTerm ? { email: { $regex: searchEmailTerm, $options: 'i' } } : {},
        searchLoginTerm ? { login: { $regex: searchLoginTerm, $options: 'i' } } : {}
      ].filter(Boolean) // Удаляет пустые фильтры
    };

    const user = await this.UserModel.find(filters)
      .sort({ [sortBy]: sortDirection === EnumDirection.asc ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

     user.map((el: UserDocument) => UserViewDto.mapToView(el));
    return Paginator.get({
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount: user.length,
      items: user,
    });
  }
}