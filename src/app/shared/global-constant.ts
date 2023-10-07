export class GlobalConstants{
//message
public static genericError:string = "Somthing went wrong, please try again..";

public static unauthorizedMessage : string = "You are not authorize to access this page..";

public static productExistError: string = "Product already exists..";

public static productAdded: string = "Product added successfully..";


//regex
public static nameRegex:string = "[a-zA-Z0-9 ]*";

public static contactNumberRegex:string = "^[e0-9]{11,14}$";

public static emailRegex:string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

public static passwordRegex:string = "[A-Za-z\d@#$%^&+=!_]{8,20}";

//Variables

public static error : string = "error";

}