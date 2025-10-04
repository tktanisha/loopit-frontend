
export class LoggedInUser {
 
  constructor(
   public name:string,
   public user_id:number,
   public role: string,
   private exp:Date,
  ){}


}


