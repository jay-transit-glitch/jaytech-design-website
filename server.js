require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Home | Custom Web Development' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me | Web Developer' });
});

app.get('/services', (req, res) => {
  res.render('services', { title: 'Services & Pricing | Web Development' });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us',
        successMsg: null,
        errorMsg: null
    });
});

app.post('/contact', async (req, res) => {
  const { name, email, businessName, projectNeeded, details, meetingDate, meetingTime } = req.body;

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Lead Request from ${name}`,
    html: `
      <h2>New Project Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Business Name:</strong> ${businessName || 'N/A'}</p>
      <p><strong>Project Needed:</strong> ${projectNeeded}</p>
      <p><strong>Details:</strong> ${details}</p>
      <p><strong>Date:</strong> ${meetingDate || 'Not specified'}</p>
      <p><strong>Time:</strong> ${meetingTime || 'Not specified'}</p>
      <h3>Requested Consulation Call:</h3>
      <p><strong>Date:</strong> ${meetingDate}</p>
      <p><strong>Time:</strong> ${meetingTime}</p>
      `
  };

  const clientMailOptions = {
    from: `"JayTech & Design" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `We received your inquiry, ${name}! | JayTech & Design`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
        <h2 style="color: #10b981;">Thanks for reaching out to JayTech & Design!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for inquiring about a new site build. I've received your details for <strong>${projectNeeded}</strong> and am currently reviewing your request.</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
          <h4 style="margin-top: 0;">What happens next?</h4>
          <p style="margin-bottom: 0;">I will analyze your requirements and follow up via email within <strong>24 business hours</strong> to schedule a discovery call or send over a quote.</p>
        </div>

        <p>If you have any extra files or brand assets to share in the meantime, feel free to reply directly to this email.</p>
        
        <br>
        <p>Best regards,</p>
        <p><strong>JayTech & Design</strong><br>
        <a href="https://yourwebsite.com" style="color: #10b981;">JayTech & Design Studio</a></p>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(clientMailOptions)
        ]);
    }

    res.redirect(`/thank-you?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);

  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.render('contact', {
        title: 'Contact Us',
        successMsg: null,
        errorMsg: 'There was an issue sending your request. Please try again or email us directly: jwtechdesign@gmail.com'
    });
  }
});

app.get('/thank-you', (req, res) => {
    const { name, email } = req.query;
    res.render('thank-you', {
        title: 'Thank You | JayTech & Design',
        clientName: name || "Valued Client",
        clientEmail: email || '',
        successMsg: null
    });
});

app.post('/onboarding', async (req, res) => {
  const { email, websiteGoals, targetAudience, competitorUrls, brandAssets, launchTimeline } = req.body;

  const briefMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `📋 Onboarding Brief Completed for ${email}`,
    html: `
      <h2>Client Project Brief Submission</h2>
      <p><strong>Client Email:</strong> ${email}</p>
      <p><strong>Primary Goal:</strong> ${websiteGoals || 'N/A'}</p>
      <p><strong>Target Audience:</strong> ${targetAudience || 'N/A'}</p>
      <p><strong>Competitor / Inspiration URLs:</strong> ${competitorUrls || 'N/A'}</p>
      <p><strong>Branding / Logo Status:</strong> ${brandAssets || 'N/A'}</p>
      <p><strong>Target Launch Timeline:</strong> ${launchTimeline || 'N/A'}</p>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(briefMailOptions);
    }

    res.render('thank-you', {
      title: 'Thank You | JayTech & Design',
      clientName: 'Client',
      clientEmail: email,
      successMsg: 'Brief details submitted successfully! I will have initial concepts ready for our call.'
    });
  } catch (error) {
    console.error('Onboarding Error:', error);
    res.redirect('/thank-you');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});