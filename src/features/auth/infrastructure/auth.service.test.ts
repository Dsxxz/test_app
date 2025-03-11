import { RegistrationUserDTO } from "../dto/registration-user-DTO";
import {  UnauthorizedException } from "@nestjs/common";
import { MailAdapter } from "../../../infrastructure/mail.adapter";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../users/application/users.service";
import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import bcrypt from "bcrypt";

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let mailService: MailAdapter;
  let jwtService: JwtService;

  const mockUser = {
    id: 'userId',
    login: 'testUser',
    email: 'test@example.com',
    userPasswordHash: bcrypt.hashSync('password', 10), // пример хешированного пароля
    createdAt: new Date(),
  };

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue(mockUser),
    createUser: jest.fn().mockResolvedValue(mockUser),
    registrateConfirmCode: jest.fn().mockResolvedValue('confirmationCode'),
    updateConfirmationIsConfirmed: jest.fn().mockResolvedValue(true),
    deleteUserById: jest.fn().mockResolvedValue(true),
  };

  const mockJwtService = {
    sign: jest.fn().mockImplementation((payload, options) => {
      return options.expiresIn === '24h'
        ? 'refreshToken'
        : 'accessToken';
    }),
  };

  const mockMailService = {
    sendConfirmCode: jest.fn().mockResolvedValue(true),
    emailResending: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailAdapter, useValue: mockMailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailAdapter>(MailAdapter);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validate', () => {
    it('should return user details if credentials are valid', async () => {
      const payload = { username: 'testUser', password: 'password' };
      const user = await authService.validate(payload);
      expect(user).toBeDefined();
      expect(user.login).toEqual(mockUser.login);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockUsersService.findOne = jest.fn().mockResolvedValue(null);
      const payload = { username: 'unknownUser', password: 'password' };
      await expect(authService.validate(payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const payload = { username: 'testUser', password: 'wrongPassword' };
      await expect(authService.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('loginUser', () => {
    it('should return access and refresh tokens', async () => {
      const result = await authService.loginUser(mockUser);
      expect(result).toEqual({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
      });
    });
  });



  describe('registrateUsingEmail', () => {
    it('should update confirmation status', async () => {
      const code = 'someCode';
      const result = await authService.registrateUsingEmail(code);
      expect(result).toBe(true);
      expect(mockUsersService.updateConfirmationIsConfirmed).toHaveBeenCalledWith(code);
    });
  });

  describe('registrate', () => {
    it('should create user and send confirmation email', async () => {
      const registrationDTO: RegistrationUserDTO = {
        login: 'newUser',
        email: 'new@example.com',
        password: 'newPassword',
      };

      const result = await authService.registrate(registrationDTO);
      console.log(result);
      expect(result).toBe(true);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(registrationDTO);
      expect(mockMailService.sendConfirmCode).toHaveBeenCalledWith(mockUser.email, 'confirmationCode');
    });
  });
});