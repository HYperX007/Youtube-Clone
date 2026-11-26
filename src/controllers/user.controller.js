import { asyncHandler } from "../utils/aysncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"



const userRegister = asyncHandler( async (req, res) => {

    //taking req from the frontend
    const {fullName, email, username, password} = req.body;

    //checking if all the fields are filled or not
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All field must be filled")
    }

    //checking for existing user
    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    })
    if(existedUser){
        throw new ApiError(409, "Email or Username already exists")
    }

    //checking for avtar and coverImage
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath 
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required")
    }

    //uploading the avatar and coverImage to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar image is required")
    }

    //creating a user object and sending it to the db
    const user = await User.create({
        email, 
        avatar: avatar.url,
        fullName,
        coverImage: coverImage?.url||"",
        password,
        username: username.toLowerCase()
    }) 

    const createdUser = await User.findOne( user._id ).select(
        "-password -refreshToken"
    )

    //checking if the user is created
    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }

    //returning response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export {
    userRegister
}