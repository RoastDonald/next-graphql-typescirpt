import { UserDto } from 'src/DTO/UserDto';

export const validateSignUp = (body: UserDto) => {
  if (!body.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }
  if (body.username.length <= 4) {
    return [
      {
        field: 'username',
        message: 'username should be greater than 4',
      },
    ];
  }
  if (body.username.includes('@')) {
    return [
      {
        field: 'password',
        message: 'cannot include @ sign',
      },
    ];
  }
  if (body.password.length <= 4) {
    return [
      {
        field: 'password',
        message: 'password should be greater than 4',
      },
    ];
  }
  return null;
};
