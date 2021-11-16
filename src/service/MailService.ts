import { APP_URL } from "@/config";
import { sendMail } from "@/helper/mail-helpers";
import { IUser } from "@/model/interfaces";
import AppService from "@/service/AppService";
import { Service } from "typedi";

@Service()
export default class MailService extends AppService {
  passwordForgot (options: {clearToken: string, user: IUser}): Promise<any>{
    const { clearToken, user } = options
    return sendMail({
      emailFilename: 'email/user_password_forgot.pug', payload: {
        emails: [user.email], emailSubject: 'Password reset link', variables: {
          passwordResetUrl: `${APP_URL}/password/reset/?token=${clearToken}`,
          passwordForgotUrl: `${APP_URL}/password/forgot`,
          user
        }
      }
    })
  }
}
