import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';

export const getUserDetailsFromToken = async(token)=>{

    if(!token){
        return {
            message : "session out",
            logout : true,
        }
    }

    const decode = await jwt.verify(token,process.env.JWT_SECREAT_KEY)

    const user = await UserModel.findById(decode.id).select('-password')

    return user
}