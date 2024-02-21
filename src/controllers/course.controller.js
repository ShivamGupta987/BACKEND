import Course from "../models/course.models.js";
import AppError from "../utils/error.utils.js";

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      sucess: true,
      message: "All Courses",
      courses,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid id course not found", 400));
    }

    res.status(200).json({
      success: true,
      message: "lectures found successfully",
      lectures: course.lectures,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

export { getAllCourses, getLecturesByCourseId };
