import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';

export const registerUser = async (request,response)=>{
    try {
        const { name, email , password, profile_pic } = request.body;

        const checkEmail = await UserModel.findOne({ email });

        if(checkEmail){
            return response.status(400).json({
                message : "User with this email already exists",
                error : true,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password,salt)

        const payload = {
            name,
            email,
            profile_pic,
            password : hashpassword
        }

        const user = new UserModel(payload)
        const userSave = await user.save()

        const { password: _, ...userData } = userSave.toObject();
        return response.status(201).json({
            message : "User created successfully",
            data : userData,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

export const checkEmail = async (request, response) => {
  try {
    const { email } = request.body;

    const checkEmail = await UserMod.findOne({ email }).select('-password');

    if (!checkEmail) {
      return response.status(400).json({
        message: 'user not exit',
        error: true,
      });
    }

    return response.status(200).json({
      message: 'email verify',
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const checkPassword = async (request, response) => {
  try {
    const { password, userId } = request.body;

    const user = await UserModel.findById(userId);

    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return response.status(400).json({
        message: 'Please check password',
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECREAT_KEY, {
      expiresIn: '1d',
    });

    const cookieOptions = {
      http: true,
      secure: true,
    };

    return response.cookie('token', token, cookieOptions).status(200).json({
      message: 'Login successfully',
      token: token,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const userDetails = async (request, response) => {
  try {
    const token = request.cookies.token || '';

    const user = await getUserDetailsFromToken(token);

    return response.status(200).json({
      message: 'user details',
      data: user,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const logout = async (request, response) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return response.cookie('token', '', cookieOptions).status(200).json({
      message: 'session out',
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const updateUserDetails = async (request, response) => {
  try {
    const token = request.cookies.token || '';

    const user = await getUserDetailsFromToken(token);

    const { name, profile_pic } = request.body;

    const updateUser = await UserModel.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );

    const userInfomation = await UserModel.findById(user._id);

    return response.json({
      message: 'user update successfully',
      data: userInfomation,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const searchUser = async (request, response) => {
  try {
    const { search } = request.body;

    const query = new RegExp(search, 'i', 'g');

    const user = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select('-password');

    return response.json({
      message: 'all user',
      data: user,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
