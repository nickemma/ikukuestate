export const verifyEmailTemplate = (
  url: string,
  brandColor: string = "#fc766a"
) => ({
  subject: "Just One More Step to Get Started!",
  text: `Please verify your email address by clicking the following link: ${url}`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-weight:bold; font-size: 24px; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .header img { max-width: 40px; margin-bottom: 10px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 24px; color: #333333; }
      .content p { font-size: 16px; color: #666666; margin: 10px 0 20px; }
      .button { display: inline-block; padding: 15px 25px; font-size: 16px; font-weight: bold;  background-color: ${brandColor}; color: #fff!important; border-radius: 5px; text-decoration: none; margin-top: 20px; }
      .footer { font-size: 14px; color: #999999; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">Ikuku's Property</div>
        <div class="content">
          <h1>Confirm Your Email Address</h1>
          <p>Thank you for signing up! Please verify your email address to activate your account.</p>
          <p>Click the link below to complete your verification</p>
          <a href="${url}" class="button">Confirm account</a>
          <p>If you didn't sign up for this account, please ignore this email or contact our support team.
          </p>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
          <p>Thank you, <br/> Ikuku property Team</p>
        </div>
      </div>
    </body></html>
  `,
});

export const passwordResetTemplate = (
  url: string,
  brandColor: string = "#fc766a"
) => ({
  subject: "Reset Your Password",
  text: `To reset your password, please click the following link: ${url}`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-size: 24px;  font-weight:bold; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .header img { max-width: 40px; margin-bottom: 10px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 24px; color: #333333; }
      .content p { font-size: 16px; color: #666666; margin: 10px 0 20px; }
      .button { display: inline-block; padding: 15px 25px; font-size: 16px; font-weight: bold; background-color: ${brandColor};  color: #fff !important; border-radius: 5px; text-decoration: none; margin-top: 20px; }
      .footer { font-size: 14px; color: #999999; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">Ikuku's Property</div>
        <div class="content">
          <h1>Reset Your Password</h1>
          <p>We received a request to reset the password for your Ikuku's property account. 
          If you made this request, click the link below to reset your password:
          </p>
          <a href="${url}" class="button">Reset Password</a>
          <p>
          For your security, this link will expire in 30 minutes. If you didn’t request a password reset,
          no further action is required. Your account remains secure.
          </p>
        </div>
        <div class="footer">
          <p>If you have any questions or concerns, please contact our support team.</p>
          <p>Thank you, <br/> Ikuku property Team</p>
        </div>
      </div>
    </body></html>
  `,
});

export const newListingTemplate = (
  propertyUrl: string,
  brandColor: string = "#4caf50"
) => ({
  subject: "Check Out Our New Listing!",
  text: `A new property has been listed! Visit ${propertyUrl} to learn more.`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-size: 24px; font-weight: bold; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 24px; color: #333333; }
      .content p { font-size: 16px; color: #666666; margin: 10px 0 20px; }
      .button { display: inline-block; padding: 15px 25px; font-size: 16px; font-weight: bold; background-color: ${brandColor}; color: #fff !important; border-radius: 5px; text-decoration: none; margin-top: 20px; }
      .footer { font-size: 14px; color: #999999; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">Ikuku's Property</div>
        <div class="content">
          <h1>New Property Alert!</h1>
          <p>We just added a new property to our listings. Click below to check it out:</p>
          <a href="${propertyUrl}" class="button">View Property</a>
          <p>Don't miss out on this opportunity. Visit now!</p>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>Thank you, <br/> Ikuku Property Team</p>
        </div>
      </div>
    </body></html>
  `,
});

export const bookingAppointmentTemplate = (
  propertyName: string,
  appointmentDate: string,
  appointmentTime: string,
  brandColor: string = "#3f51b5"
) => ({
  subject: "Booking Appointment Confirmation",
  text: `Your booking for ${propertyName} is confirmed for ${appointmentDate} at ${appointmentTime}.`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-size: 24px; font-weight: bold; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 24px; color: #333333; }
      .content p { font-size: 16px; color: #666666; margin: 10px 0 20px; }
      .footer { font-size: 14px; color: #999999; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">Ikuku's Property</div>
        <div class="content">
          <h1>Booking Confirmed</h1>
          <p>Your booking for <strong>${propertyName}</strong> is confirmed.</p>
          <p>Date: <strong>${appointmentDate}</strong><br>Time: <strong>${appointmentTime}</strong></p>
          <p>We look forward to hosting you!</p>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>Thank you, <br/> Ikuku Property Team</p>
        </div>
      </div>
    </body></html>
  `,
});
