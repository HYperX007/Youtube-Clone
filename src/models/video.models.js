import mongoose, {Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFile : {
            type : String,
            require: true,
        },

        thumbnail : {
            type : String,
            require: true,
        },

        owner : {
            type : Schema.Types.ObjectId,
            ref : "User",
            require: true,
        },

        title : {
            type : String,
            require: true,
        },

        description : {
            type : String,
            require: true,
        },

        duration : {
            type : Number,
            require: true,
        },

        views : {
            type : Number,
            default : 0
        },

        isPublished : {
            type : Boolean,
            default : true
        },


    }, 
    {
        timestamps: true
    }
)


videoSchema.plugin(aggregatePaginate);



export const Video = mongoose.models("Video", videoSchema );