export interface CreateUserDto {
  login: string;
  password: string;
}

export const isCreateUserDto = (data: unknown): data is CreateUserDto => {
  return (
    data &&
    typeof data === 'object' &&
    'login' in data &&
    'password' in data &&
    !!data.login &&
    !!data.password
  );
};
