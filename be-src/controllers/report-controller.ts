import { Report, User } from "../models";
import { sgMail } from "../lib/sendgrid";

export async function createReport(petReportData) {
  const { name, phone, info, petId, userId } = petReportData;

  const report = await Report.create({
    name,
    phone,
    info,
    petId,
  });

  const recipient = await User.findByPk(userId);

  const msg = {
    to: recipient.get("email"),
    from: "benjahenley@hotmail.com",
    subject: "Pet Finder - Reports",
    text: `there has been information reported on ${name}. the following user: ${name}, has reported: ${info}, to get in touch please contact the following number: ${phone}`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("enviado!");
    })
    .catch((error) => {
      console.error(error);
    });

  return true;
}

export async function getReports(petId) {
  const reports = await Report.findAll({ where: { petId } });

  return reports;
}
