export type CreateUserType = {
  email: string;
  login: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode?: string;
    isConfirmed: boolean;
    expirationDate: Date;
  };
  userPasswordHash: string;
  userPasswordSalt: string;
};
