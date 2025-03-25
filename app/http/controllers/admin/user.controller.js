const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/user");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { ProjectModel } = require("../../../models/project");
const { ProposalModel } = require("../../../models/proposal");

class UserController extends Controller {
  // ADMIN ROUTES :
  async getAllUsers(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 20;
    const skip = (page - 1) * limit;
    const { search } = req.query;
    const searchTerm = new RegExp(search, "ig");
    // const databaseQuery = {};
    // if (search) databaseQuery["$text"] = { $search: search };
    const users = await UserModel.find({
      $or: [
        { name: searchTerm },
        { email: searchTerm },
        { phoneNumber: searchTerm },
      ],
    })
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1,
      });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        users,
      },
    });
  }
  async userProfile(req, res) {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { otp: 0 });
    const createdProjects = await ProjectModel.find({ owner: userId });
    const completedProjects = await ProjectModel.find({ freelancer: userId });
    const proposals = await ProposalModel.find({ user: userId });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
        createdProjects,
        completedProjects,
        proposals,
      },
    });
  }
  async verifyUser(req, res) {
    const { userId } = req.params;
    let { status } = req.body;
    status = Number(status);
    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $set: { status } }
    );

    if (updateResult.modifiedCount === 0)
      throw createHttpError.InternalServerError("User status was not updated");

    let message = "The user's status has been confirmed";
    if (status === 0) message = "The user status has been changed to rejected";
    if (status === 1)
      message = "The user status has been changed to pending approval";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
}

module.exports = {
  UserController: new UserController(),
};
