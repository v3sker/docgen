import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';
import { addDays, format, parse } from "date-fns";

async function generateDocumentTemplate(data) {

  // Bellow is my own generative function, you are not obligated
  // to do exactly the same. Just create your .docx template with
  // all needed variables, add them in your form, validate them
  // as I did - and you're good to go!

  // You can read about templating and using JS variables in your
  // doc on the official docxtemplater website:
  // https://docxtemplater.com/docs/get-started-browser/

  // Fetch the DOCX template from the public folder
  const response = await fetch("/templates/contract.docx");
  const arrayBuffer = await response.arrayBuffer();
  const zip = new PizZip(arrayBuffer);

  // Load the template with docxtemplater
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const addressResidence = `${data.addresses.residence.region}, ${data.addresses.residence.city}, ${data.addresses.residence.street}, ${data.addresses.residence.number}`
  const addressDefacto = `${data.addresses.defacto.region}, ${data.addresses.defacto.city}, ${data.addresses.defacto.street}, ${data.addresses.defacto.number}`

  const creditIssuedDate = data.credit.issuedDate;
  const parsedIssuedDate = parse(creditIssuedDate, 'dd.MM.yyyy', new Date());
  const finishDate = addDays(parsedIssuedDate, (30 * 6));
  const creditFinishDate = format(finishDate, 'dd.MM.yyyy');

  const getCreditInterest = (amount) => {
    return Math.round(amount * 0.5 / 365 * 30)
  };

  const payments = [];

  const creditAmount = data.credit.amount;
  let creditRemainder = data.credit.amount;

  let creditBodySubtotal = 0, creditInterestSubtotal = 0, creditCommissionSubtotal = 0, creditTotalSubtotal = 0;

  for (let i = 0; i < 6; i++) {
    const payment = {};
    payment.number = i + 1;
    payment.date = format(addDays(parsedIssuedDate, 30 * (i+1)), 'dd.MM.yyyy');
    if (i === 0) {
      payment.body = 0;
    } else if (i === 1) {
      payment.body = Math.round(creditAmount * 0.5);
    } else if (i === 2) {
      payment.body = Math.round(creditAmount * 0.2);
    } else {
      payment.body = Math.round(creditAmount * 0.1);
    }

    if (i > 0) {
      creditRemainder -= payments[i-1].body;
    }
    payment.interest = getCreditInterest(creditRemainder);

    if (i === 0) {
      payment.commission = Math.round(creditAmount * 0.072);
    } else {
      payment.commission = 0;
    }

    payment.total = payment.body + payment.interest + payment.commission;

    creditBodySubtotal += payment.body;
    creditInterestSubtotal += payment.interest;
    creditCommissionSubtotal += payment.commission;
    creditTotalSubtotal += payment.total;

    payments.push(payment);
  }

  doc.setData({
    creditID: data.credit.id,
    creditAmount,
    creditIssuedDate,
    creditFinishDate,

    payments,
    creditTotalSubtotal,
    creditBodySubtotal,
    creditCommissionSubtotal,
    creditInterestSubtotal,

    personFirstName: data.personalData.firstName,
    personLastName: data.personalData.lastName,
    personFullName: `${data.personalData.firstName} ${data.personalData.lastName}`,
    personBirthday: data.personalData.birthDate,

    contactNumber: data.contactData.mainNumber,
    contactEmail: data.contactData.email,

    addressResidence,
    addressDefacto,

    bulletinSeries: data.identification.bulletin.series,
    bulletinIssuedDate: data.identification.bulletin.issuedAt,
    bulletinIDNP: data.identification.bulletin.idnp,
  });

  try {
    // Render the document
    doc.render();

    // Generate the document as a Blob
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Trigger the download
    saveAs(out, `Contract_${data.credit.id}_${data.personalData.firstName}${data.personalData.lastName}.docx`);

    return { success: true, error: false };
  } catch (error) {
    console.error("Error generating document:", error);
    return { error: error, success: false }
  }
}

export const generateDocument = async (values, documentType) => {
  switch (documentType) {
    default: return { error: 'Add your document type and generative function in lib/generateDocument.js' }
  }
}