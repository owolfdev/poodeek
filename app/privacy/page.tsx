// "use client";

import React from "react";
import ReactMarkdown from "react-markdown";

let markdown = ``;

function About() {
  return (
    <div className="flex flex-col sm:gap-4 gap-6 max-w-3xl w-full pt-10 pb-24 px-4">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <ReactMarkdown className="text-lg sm:text-base flex flex-col sm:gap-4 gap-6">
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export default About;

markdown = `


Thank you for choosing to use Poodeek!, a Thai language learning web app. This Privacy Policy describes how we handle and protect your personal information in connection with Poodeek!'s services.

**1. Information We Collect**

When you use Poodeek!, you have the option to send us contact messages. To do so, you are prompted to provide:
- Your name
- Your email address

This is the only personal information we collect from you.

**2. How We Use Your Information**

We use your name and email address exclusively for:
- Responding to your queries or messages.
- Sending any necessary updates or information about Poodeek!.

We do not use your personal information for marketing purposes, nor do we share, sell, rent, or trade your personal information with any third parties for their promotional purposes.

**3. Data Protection**

We value your trust in providing us with your personal information. We strive to use commercially acceptable means to protect your personal information. However, no method of transmission over the internet or method of electronic storage is 100% secure and reliable. While we do our best, we cannot guarantee its absolute security.

**4. Changes to This Privacy Policy**

We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify users of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted.

**5. Contact Us**

If you have any questions or suggestions about our Privacy Policy, please contact us using our contact form.`;
