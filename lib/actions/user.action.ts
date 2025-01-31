"use server"

interface UserData {
    email: string;
    password: string;
}

export async function getUserFromDb(email: string, password: string){
    console.log("Getting user from db");
}

export async function signOutUser() {
    console.log("Signing out user");
  
}
