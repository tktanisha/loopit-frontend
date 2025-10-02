export interface JwtPayload {


  user_id: number;
  role: string;
  iat:Date;
  exp:Date;

}
//if want to access the user from anywhere from the angular appplication than create the user class and constructir and  in user service create the subject and on recieving the response emit the user from subject which can now access from anywhere