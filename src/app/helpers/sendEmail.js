const nodemailer = require('nodemailer');

const renderEmailContent = (url) => {
  const content = `
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #fff;" leftmargin="0">
      <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#fff"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
          <td>
            <table style="background-color: #fff; max-width:670px;  margin:0 auto;" width="100%" border="0"
              align="center" cellpadding="0" cellspacing="0">
              <tr>
                <td style="height:32px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="height:20px;">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                    style="max-width:670px;background:#fff; border-radius:3px; border: 1px solid #ddd; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                    <tr>
                      <td style="height:40px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td style="padding:0 35px;">
                        <h1 style="color:#1e1e2d; font-weight:bold; margin:0;font-size:24px;font-family:'Rubik',sans-serif;">
                          You have been invited to join an online meeting.
                        </h1>
                        <p>
                          <span
                            style="display:inline-block; vertical-align:middle; border-bottom:1px solid #cecece; width:100px;">
                          </span>
                        </p>
                        <a href="${url}"
                          style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:28px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                          Join meeting
                        </a>
                        <p style="color:#455056; font-size:15px;line-height:24px; margin-top:20px;">Thanks, <br> VideoConference Team</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="height:40px;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              <tr>
                <td style="height:20px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="height:80px;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  `;

  return content;
};

const sendInviteEmail = async (email, url) => {
  const emailContent = renderEmailContent(url);
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'cty.hotjob2020@gmail.com',
      pass: 'Qw01635953170',
    },
  });

  let info = await transporter.sendMail({
    from: `"Video conference" <videoconference@gmail.com>`,
    to: `${email}`,
    subject: '[VideoConference] Inviting to join an online meeting',
    html: emailContent,
  });
};

module.exports = { sendInviteEmail };
