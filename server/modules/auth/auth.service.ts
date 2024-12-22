import Jwt from "jsonwebtoken";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { LoginDTO, RegisterDTO } from "../../common/interface/auth.interface";
import SessionModel from "../../database/models/session.model";
import UserModel from "../../database/models/user.model";
import VerificationCodeModel from "../../database/models/verification.model";
import { BadRequestException } from "../../util/catch.errors";
import { thirtyDaysFromNow } from "../../util/date-time";
import { config } from "../../config/app.config";

export class AuthService {
  public async register(data: RegisterDTO) {
    const { name, email, password } = data;

    const existingUser = await UserModel.exists({ email });

    if (!existingUser) {
      throw new BadRequestException(
        "User already exists with this email",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    const userId = newUser._id;

    // Send verification email
    const verificationCode = await VerificationCodeModel.create({
      userId,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: thirtyDaysFromNow(),
    });

    // Send email with verification link
    return {
      user: newUser,
    };
  }

  public async login(data: LoginDTO) {
    const { email, password, userAgent } = data;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new BadRequestException(
        "Invalid email or password",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    // check if user is enabled 2FA and send 2FA code
    const session = await SessionModel.create({
      userId: user._id,
      userAgent,
    });

    const accessToken = Jwt.sign(
      {
        userId: user._id,
        sessionId: session._id,
      },
      config.JWT.JWT_SECRET,
      {
        audience: ["user"],
        expiresIn: config.JWT.JWT_EXPIRES_IN,
      }
    );
    const refreshToken = Jwt.sign(
      {
        userId: user._id,
        sessionId: session._id,
      },
      config.JWT.JWT_REFRESH_SECRET,
      {
        audience: ["user"],
        expiresIn: config.JWT.JWT_REFRESH_EXPIRES_IN,
      }
    );

    return {
      user,
      accessToken,
      refreshToken,
      mfaRequired: false,
    };
  }
}
