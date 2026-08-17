export class CreateUserDto {
  account: string;
  pwd: string;
  email?: string;
  name?: string;
  roleid?: string;
  isactive?: string;
}
