
export class User {
 
  constructor(
   public name:string,
   public user_id:number,
   public role: string,
   private exp:Date,
  ){}


}


