const cypress = require('cypress');
const nodemailer = require('nodemailer');

// Define your email settings
const emailConfig = {
  service: 'Yahoo', // e.g., 'Gmail'
  auth: {
    user: 'sender_email_adress',
    pass: 'password',
  },
  to: 'receiver_email_adress',
  subject: 'Cypress Test Failure',
};

async function runAndEmailTests() {
  try {
    // Run Cypress tests
    const results = await cypress.run({
        spec: "path-to-specific-test" // Optional
      });

    // Check if there were any test failures
    if (results.totalFailed) {
      // Create a transporter for sending emails
      const transporter = nodemailer.createTransport({
        service: emailConfig.service,
        auth: {
          user: emailConfig.auth.user,
          pass: emailConfig.auth.pass,
        },
      });

      // Compose the email content
      const emailContent = {
        from: emailConfig.auth.user,
        to: emailConfig.to,
        subject: emailConfig.subject,
        text: `Cypress tests failed. Total failures: ${results.totalFailed}`,
        attachments: [
          {
            filename: 'file', // Change the filename as needed
            path: 'path-to-file', // Provide the actual path to your file
          },
        ],
      };

      // Send the email
      await transporter.sendMail(emailContent);
      console.log('Email sent successfully.');
    } else {
      console.log('All tests passed. No email sent.');
    }
  } catch (error) {
    console.error('Error running tests or sending email:', error);
  }
}

// Run the function to initiate the process
runAndEmailTests();
