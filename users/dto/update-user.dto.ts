export class UpdateUserDto {
  account: string;
  pwd: string;
  email?: string;
  name?: string;
  roleid?: string;
  isactive?: string;
}
