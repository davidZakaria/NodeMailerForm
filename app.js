const express = require("express");
const nodeparser = require("body-parser");
const nodemailer = require("nodemailer");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();

// View Engine Setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//Body Parser Middleware
app.use(nodeparser.urlencoded({ extended: false }));
app.use(nodeparser.json());

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("contact", { layout: false });
});

app.get("/main", (req, res) => {
  res.render("main", { layout: false });
});

app.post("/send", (req, res) => {
  const output = `
  <p>You have a new Contact Request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
`;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "davidsamii3@gmail.com", // generated ethereal user
      pass: "wzdfpfxbjiheduut", // generated ethereal password
    },
  });
  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"NodeMailer contact" <davidsamii3@gmail.com> ', // sender address
    to: "davidsamii97@gmail.com", // list of receivers
    subject: "Node contact request ", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.render("contact", { msg: "Email has been sent yabne", layout: false });
  // main().catch(console.error);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
