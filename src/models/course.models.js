import { model, Schema } from "mongoose";

const courseSchema = new Schema({
  title: {
    type: "String",
    required: [true,'Title is required'],
    minlength : [8, 'Title must be atleast 8 character'],
    maxlength : [60, 'Title must be atmost 8 character'],
    trim: true,


  },
  description: {
    type: "String",
    required: [true,'Desciption is required'],
    minlength : [8, 'Desciption must be atleast 8 character'],
    maxlength : [60, 'Desciption must be atmost 8 character'],
    
  },
  category: {
    type: "String",
    required: [true,'category is required'],
    
  },
  thumbnail: {

    public_id: {
        type: "String",
        required: true
      },
      secure_url: {
        type: "String",
        required:  true
      },
  },
  lectures: [
    {
      title: "String",
      description: "String",
      lectures: {
        public_id: {
          type: "String",
          required: true

        },
        secure_url: {
          type: "String",
          required: true

        },
      },
    },
  ],
  numbersOfLectures : {
    type : Number,
    default : 0,
  },
  createdBy : {
    type: "String",
    required: true,
  }

},{
    timestamps : true
});


const Course = model('Course',courseSchema);

export default Course;
