import db from '../db/db.js';
import regAuth from '../Services/regAuth.service.js';
export async  function registerUser(req,res){

    try{
        const result = regAuth(req.body);
        if(!result.valid){
            res.status(400).json({ error: result.error });
            return;
        }
        const{nationalID,firstName,lastName,email,phoneNo,DateOfBirth} = result.data;
        const existing = await db.sql`SELECT id FROM customers WHERE nationalID = ${nationalID}`;
        if(existing.length > 0){
            res.status(400).json({ error: "User with this National ID already exists" });
            return;
        }
        const insertQuery = `
          INSERT INTO users (national_id, first_name, last_name, email, phone_no, date_of_birth)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, national_id, first_name, last_name, email, phone_no, date_of_birth
        `;
        const values = [nationalID, firstName, lastName, email, phoneNo, DateOfBirth];
        const inserted = await db.sql(insertQuery, values);
        res.status(201).json({ message: "User registered successfully", user: inserted  [0] });

    }catch(err){
        console.error("Registration Error:", err);      
        res.status(500).json({ error: err.message });
    }

    
}