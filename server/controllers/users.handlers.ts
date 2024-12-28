import { HTTPSTATUS } from "../config/http.config";
import propertyModel from "../database/models/property.model";
import User from "../database/models/user.model";
import { asyncHandler } from "../middleware/asyncHandler";
import { Resend } from "resend";
import { bookingAppointmentTemplate } from "../mailer/template";
import { config } from "../config/app.config";

const resend = new Resend(config.RESEND_API_KEY);

/*
 * @route   POST api/v1/favorites
 * @desc    Add a property to favorites
 * @access  Private
 */

export const addFavorite = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;
  const userId = (req as any).user?.id;

  console.log(userId, "userId");
  console.log(propertyId, "propertyId");

  const property = await propertyModel.findById(propertyId);

  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }

  if (user.favorites.includes(propertyId)) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "Property is already in favorites" });
  }

  user.favorites.push(propertyId);
  await user.save();

  res.status(HTTPSTATUS.OK).json({ message: "Property added to favorites" });
});

/*
 * @route   DELETE api/v1/favorites/:id
 * @desc    Remove a property from favorites
 * @access  Private
 */

export const removeFavorite = asyncHandler(async (req, res) => {
  const { id: propertyId } = req.params;
  const userId = (req as any).user?.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }

  const favoriteIndex = user.favorites.findIndex(
    (favorite) => favorite.toString() === propertyId
  );

  if (favoriteIndex === -1) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found in favorites" });
  }

  // Remove the property from favorites
  user.favorites.splice(favoriteIndex, 1);
  await user.save();

  res
    .status(HTTPSTATUS.OK)
    .json({ message: "Property removed from favorites" });
});

/*
 * @route   GET api/v1/favorites
 * @desc    Get all properties in favorites
 * @access  Private
 */

export const viewFavorites = asyncHandler(async (req, res) => {
  const userId = (req as any).user?.id;

  const user = await User.findById(userId).populate("favorites");

  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }

  res.status(HTTPSTATUS.OK).json({ favorites: user.favorites });
});

/*
 * @route   POST api/v1/bookings
 * @desc    Book a property
 * @access  Private
 */

export const bookAppointment = asyncHandler(async (req, res) => {
  const { propertyId, date, time } = req.body;
  const userId = (req as any).user?.id;

  const property = await propertyModel.findById(propertyId);

  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }

  // Validate the time
  if (!time) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "Appointment time is required" });
  }

  user.appointments.push({ propertyId, date, time });
  await user.save();

  // Send an email to the user

  const appointmentDate = new Date(date).toDateString();
  const appointmentTime = time;

  await resend.emails.send({
    from: "Admin <onboarding@resend.dev>",
    to: [user.email],
    subject: "Booking Appointment Confirmation",
    html: bookingAppointmentTemplate(
      property.name,
      appointmentDate,
      appointmentTime
    ).html,
  });

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Appointment booked successfully" });
});

/*
 * @route   DELETE api/v1/bookings/:id
 * @desc    Cancel a booking
 * @access  Private
 */

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id: bookingId } = req.params;
  const userId = (req as any).user?.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }

  const appointmentIndex = user.appointments.findIndex(
    (appointment) => appointment._id.toString() === bookingId
  );

  if (appointmentIndex === -1) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Booking not found" });
  }

  // get appointment details before removing it
  const appointment = user.appointments[appointmentIndex];
  const property = await propertyModel.findById(appointment.propertyId);
  const appointmentDate = new Date(appointment.date).toDateString();
  const appointmentTime = appointment.time;

  // Remove the booking
  user.appointments.splice(appointmentIndex, 1);
  await user.save();

  // Send an email to the user
  await resend.emails.send({
    from: "Admin <onboarding@resend.dev>",
    to: [user.email],
    subject: "Booking Cancellation Confirmation",
    html: `
        <html>
        <body>
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">Booking Cancellation</h2>
            <p>Your booking for <strong>${
              property?.name || "Property"
            }</strong> on ${appointmentDate} at ${appointmentTime} has been canceled.</p>
            <p>If you have any questions or need assistance, please contact our support team.</p>
            <p>Thank you, <br/> Ikuku's Property Team</p>
          </div>
        </body>
        </html>
      `,
  });

  res.status(HTTPSTATUS.OK).json({ message: "Booking canceled successfully" });
});

/*
 * @route   GET api/v1/bookings
 * @desc    Get all bookings
 * @access  Private
 */

export const viewAppointments = asyncHandler(async (req, res) => {
  const userId = (req as any).user?.id;

  const user = await User.findById(userId).populate("appointments.propertyId");
  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }
  res.status(HTTPSTATUS.OK).json({ appointments: user.appointments });
});
