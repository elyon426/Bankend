import db from '../db/db.js';
//For phone number regex we aint sure which format ;+254 or 254 or 07 or 01 but we will check ;this might be a source of errror
export default function regAuth(data){
    const {nationalID,firstName,lastName,email,phoneNo,DateOfBirth} = data;

    if(!nationalID || !firstName || !lastName || !email || !phoneNo || !DateOfBirth){
        return "All the fileds are required";
    }   
    const idRegex = /^[0-9]{7}$/;
    if(!idRegex.test(nationalID)){
        return "Invalid National ID";
    }
    const nameRegex = /^[a-zA-Z]+$/;
    if(!nameRegex.test(firstName) || !nameRegex.test(lastName)){
        return "Invalid Name";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    
    const phoneRegex = /^[0-9]{10}$/;
    if(!emailRegex.test(email) && !phoneRegex.test(phoneNo)){
        return "Invalid Email or Phone Number";
    }
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if(!dobRegex.test(DateOfBirth)){
        return "Invalid Date of Birth";
    }
    const dob = new Date(DateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();    
    if(age < 18) {
        return "You must be at least 18 years old to register";
    }
    if(lastName === firstName){
        return "First Name and Last Name cannot be the same";
    }

    return {
    valid: true,
    data: {
      nationalID,
      firstName,
      lastName,
      email,
      phoneNo,
      DateOfBirth,
    },
  };
    


} 