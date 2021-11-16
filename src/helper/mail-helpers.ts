import pug from 'pug'
import {MailOptions} from "nodemailer/lib/smtp-transport";
import Validator from "@bcdbuddy/validator";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import * as nodeMailer from 'nodemailer'
import path from "path";
import {
  APP_NAME, APP_URL, DEBUG, IN_PRODUCTION, IN_TEST, MAIL_FROM, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME
} from "@/config";
import AppException from "../exception/AppException";
import ValidationException from "../exception/ValidationException";
import { ISender, } from "@/model/interfaces";
import _pick from 'lodash/pick'
import _isArray from 'lodash/isArray'

export function verifyTransporter (sender: ISender): Promise<boolean> {
  return new Promise((resolve, reject) => {
    console.log({sender})
    const transport: any = nodeMailer.createTransport({
        host: sender.host,
        port: sender.port,
        secure: sender.secured,
        auth: {
          user: sender.login,
          pass: sender.password,
        },
        logger: false,
        debug: process.env.NODE_ENV !== 'production',
      } as unknown as SMTPTransport,
      {
        from: `${sender.name} <${sender.login}>`,
      });
    transport.verify(function (error: any, success: any) {
      if (error) {
        return reject(error)
      }
      resolve(true)
    })
  })
}


/**
 * @param {object} options
 * @param {object} [options.payload]
 * @param {string[]} [options.payload.phones]
 * @param {string[]} [options.payload.emails]
 * @param {string} [options.payload.emailSubject]
 * @param {object} [options.payload.variables]
 * @param {string} [options.emailFilename]
 * @param {object} [options.sender]
 * @param {string} [options.sender.host]
 * @param {number} [options.sender.port]
 * @param {string} [options.sender.login]
 * @param {string} [options.sender.password]
 */
export function sendMail (options): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const defaultOptions = {
      sender: {
        host: MAIL_HOST,
        port: MAIL_PORT,
        name: APP_NAME,
        login: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
        secured: IN_PRODUCTION
      }
    }
    options = Object.assign({}, defaultOptions, options)
    try {
      const { payload, emailFilename, sender } = options
      const data: any = _pick(payload, ['variables', 'emails', 'emailSubject',
        'emailCCs', 'phones'])
      const rules = {
        phones: 'required_unless:emails',
        emails: 'required_unless:phones|array:email',
        emailSubject: 'required_with:emails'
      }

      const v = await Validator.make({
        data,
        rules,
      });
      if (v.fails()) {
        throw new ValidationException({ data: v.getErrors() })
      }
      let {variables={}} = payload
      variables = Object.assign({}, {
        APP_URL,
        APP_NAME,
      }, variables)
      if (!data.emailCCs) {
        data.emailCCs = []
      }
      data.emailCCs = _isArray(data.emailCCs) ? data.emailCCs : [data.emailCCs]

      try {
        // const emailTemplate = 'html'
        // const html = pug.render(emailTemplate, options)
        const filename = path.resolve(__dirname, `../../views/notification/${emailFilename}`)
        data.html = pug.renderFile(filename, {
          pretty: true,
          compileDebug: IN_PRODUCTION,
          ...variables
        })
      } catch (e) {
        throw new AppException({ message: 'Error while rendering template: ' + e.message })
      }
      if (IN_TEST) {
        DEBUG && console.log('[SendMail] %o', data)
        return resolve(data)
      }
      let transporter = getTransport(sender)
      let message: MailOptions = getMessage(data)
      // TODO: save notificaiton in DB
      // new Notification({
      //   message: '',
      //   data
      // })

      const info = await transporter.sendMail(message);
      // work only on test
      if (!IN_PRODUCTION) {
        console.log(nodeMailer.getTestMessageUrl(info));
      }
      // only needed when using pooled connections
      transporter.close();
      resolve(info)
    } catch (error) {
      reject(error)
    }
  })
}

export function getTransport (sender: ISender) {
  // Generate SMTP service account from ethereal.email
  // let account = await nodeMailer.createTestAccount();
  // let account = await nodeMailer.createTestAccount();

  // console.log('Credentials obtained, sending message...');
  // TODO:

  // NB! Store the account object values somewhere if you want
  // to re-use the same account for future mail deliveries

  // Create a SMTP transporter object
  return nodeMailer.createTransport(
    {
      host: sender.host,
      port: sender.port,
      secure: sender.secured,
      auth: {
        user: sender.login,
        pass: sender.password,
      },
      logger: DEBUG,
      debug: DEBUG,
      tls: {
        rejectUnauthorized: IN_PRODUCTION
      }
    } as unknown as SMTPTransport,
    {
      // default message fields

      // sender info
      from: `${sender.name} <${MAIL_FROM}>`,
    }
  );
}

/**
 *
 * @param {object} options
 * @param {string} [options.html]
 * @param {string} [options.text]
 * @param {string} [options.emailSubject]
 * @param {string[]} [options.emails]
 * @param {string[]} [options.emailCCs]
 * @param {object} [options.emailCCs]
 */
export function getMessage (options: any) {
  return {
    // Comma separated list of recipients
    to: options.emails.map((email: string) => `<${email}>`).join(','),
    subject: options.emailSubject,
    cc: options.emailCCs,
    text: options.text,
    html: options.html
    // An array of attachments
    // attachments: [
    //   // String attachment
    //   {
    //     filename: 'notes.txt',
    //     content: 'Some notes about this e-mail',
    //     contentType: 'text/plain' // optional, would be detected from the filename
    //   },
    //
    //   // Binary Buffer attachment
    //   {
    //     filename: 'image.png',
    //     content: Buffer.from(
    //       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
    //       '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
    //       'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
    //       'base64'
    //     ),
    //
    //     cid: 'note@example.com' // should be as unique as possible
    //   },
    //
    //   // File Stream attachment
    //   // {
    //   //   filename: 'nyan cat ✔.gif',
    //   //   path: __dirname + '/assets/nyan.gif',
    //   //   cid: 'nyan@example.com' // should be as unique as possible
    //   // }
    // ]
  };
}
