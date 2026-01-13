export class LoggedInUser {
  constructor(
    public name: string,
    public user_id: string,
    public role: string,
    private exp: Date,
  ) {}
}
