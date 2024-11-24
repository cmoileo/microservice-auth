import { HttpException, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  public async create(createProfileDto: CreateProfileDto, userEmail: string) {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
      relations: ['profile'],
    });
    if (!user) {
      return new HttpException('User not found', 404);
    }
    if (user.profile) {
      return new HttpException('Profile already exists', 400);
    }
    const profile = new Profile();
    profile.firstName = createProfileDto.firstName;
    profile.lastName = createProfileDto.lastName;
    profile.age = createProfileDto.age;
    profile.phoneNumber = createProfileDto.phoneNumber;
    user.profile = profile;
    console.log(user);
    await this.userRepository.save(user);
    return await this.profileRepository.save(profile);
  }

  public async findOne(id: string) {
    const profile = await this.profileRepository.findOne({
      where: { id },
    });
    if (!profile) {
      return new HttpException('Profile not found', 404);
    }
    return profile;
  }

  public async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOne({
      where: { id },
    });
    if (!profile) {
      return new HttpException('Profile not found', 404);
    }
    if (updateProfileDto.firstName) {
      profile.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName) {
      profile.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.age) {
      profile.age = updateProfileDto.age;
    }
    if (updateProfileDto.phoneNumber) {
      profile.phoneNumber = updateProfileDto.phoneNumber;
    }
    return this.profileRepository.save(profile);
  }

  public async remove(id: string): Promise<DeleteResult | HttpException> {
    const profile = await this.profileRepository.findOne({
      where: { id },
    });
    if (!profile) {
      return new HttpException('Profile not found', 404);
    }
    await this.profileRepository.delete(profile);
  }

  public async findAll() {
    return await this.profileRepository.find();
  }
}
