import { UsersService } from "./users.service";
import { ObjectId } from "mongodb";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersRepository } from "../infrastructure/users.repository";
import { InputUserDto } from "../api/input-dto/input-user-dto";
import { CreateAuthLoginDto } from "../../auth/dto/create-auth-login-dto";

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  const mockUser = {
    id: new ObjectId().toString(),
    login: 'testLogin',
    email: 'test@example.com',
    createdAt: new Date(),
  };

  const mockUsersRepository = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    findUserById: jest.fn().mockResolvedValue(mockUser),
    deleteUserById: jest.fn().mockResolvedValue(true),
    findByQuery: jest.fn().mockResolvedValue([mockUser]),
    getTotalCount: jest.fn().mockResolvedValue(1),
    findOne: jest.fn().mockResolvedValue(mockUser),
    updateConfirmationIsConfirmed: jest.fn().mockResolvedValue(true),
    checkUserPassword: jest.fn().mockResolvedValue(true),
    findUserByCode: jest.fn().mockResolvedValue(mockUser),
    registrateConfirmCode: jest.fn().mockResolvedValue('123456'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createDto: InputUserDto = {
        login: 'newUser',
        email: 'new@example.com',
        password: 'passwordTest'
        // другие поля по мере необходимости
      };

      const user = await service.createUser(createDto);
      expect(user).toEqual(mockUser);
      expect(usersRepository.createUser).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findUserById', () => {
    it('should find user by ID', async () => {
      const userId = mockUser.id;

      const user = await service.findUserById(userId);
      expect(user).toEqual({
        id: mockUser.id,
        login: mockUser.login,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      });
      expect(usersRepository.findUserById).toHaveBeenCalledWith(new ObjectId(userId));
    });

    it('should return null if user not found', async () => {
      const userId = new ObjectId().toString();
      const user = await service.findUserById(userId);
      expect(user).toBeNull();
    });
  });

  describe('deleteUserById', () => {
    it('should delete user by ID', async () => {
      const userId = mockUser.id;

      const result = await service.deleteUserById(userId);
      expect(result).toBe(true);
      expect(usersRepository.deleteUserById).toHaveBeenCalledWith(userId);
    });
  });


  describe('loginUser', () => {
    it('should return user if login is successful', async () => {
      const loginDto: CreateAuthLoginDto = { loginOrEmail: mockUser.login, password: 'password' };

      const user = await service.loginUser(loginDto);
      expect(user).toEqual(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith(loginDto.loginOrEmail);
    });

    it('should return false if user not found', async () => {
      const loginDto: CreateAuthLoginDto = { loginOrEmail: 'wrongLogin', password: 'password' };

      const result = await service.loginUser(loginDto);
      expect(result).toBe(false);
    });

    it('should return false if password is incorrect', async () => {
      const loginDto: CreateAuthLoginDto = { loginOrEmail: mockUser.login, password: 'wrongPassword' };

      const result = await service.loginUser(loginDto);
      expect(result).toBe(false);
    });
  });

  describe('registrateConfirmCode', () => {
    it('should generate and register a confirmation code', async () => {
      const id = new ObjectId();

      const code = await service.registrateConfirmCode(id);
      expect(code).toHaveLength(6);
      expect(usersRepository.registrateConfirmCode).toHaveBeenCalledWith(mockUser, expect.any(String));
    });

    it('should throw an error if user not found', async () => {
      const id = new ObjectId();

      await expect(service.registrateConfirmCode(id)).rejects.toThrow('something went wrong while confirmation user');
    });
  });
});