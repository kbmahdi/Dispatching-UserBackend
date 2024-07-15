import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(username: string, password: string, email: string, role: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword, email, role });
    return user.save();
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findOne(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async updateRole(username: string, newRole: string): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { username },
      { role: newRole },
      { new: true }
    ).lean().exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean().exec();
  }

  async deleteUser(username: string): Promise<User | null> {
    return this.userModel.findOneAndDelete({ username }).lean().exec();
  }

  async changePassword(username: string, newPassword: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userModel.findOneAndUpdate(
      { username },
      { password: hashedPassword },
      { new: true }
    ).lean().exec();
  }
}
