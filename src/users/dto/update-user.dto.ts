export interface UpdateUserDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}

export const isUpdateUserDto = (data: unknown): data is UpdateUserDto => {
  return (
    data &&
    typeof data === 'object' &&
    'oldPassword' in data &&
    'newPassword' in data &&
    !!data.oldPassword &&
    !!data.newPassword
  );
};
