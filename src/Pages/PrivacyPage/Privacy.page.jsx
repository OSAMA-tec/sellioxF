import React from 'react';

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Effective Date: {currentDate}</p>
      </div>

      <p className="mb-6">
        Thank you for visiting selliox.com ("we," "us," or "our"). We value your privacy and want to be
        transparent about the ways in which we collect, use, and share your personal information. This
        Privacy Policy explains our practices regarding data collection and processing related to your
        use of selliox.com ("the Site").
      </p>

      <Section title="1. Information We Collect">
        <SubSection title="1.1. Information You Provide to Us">
          <ul className="space-y-4">
            <ListItem
              primary="Account or Registration Information"
              secondary="When you sign up or register on the Site, we may collect personal details such as your name, email address, username, password, and other information you choose to provide."
            />
            <ListItem
              primary="Transaction Data"
              secondary="If you make a purchase or conduct transactions on our Site, we collect information related to the transaction, which may include billing or shipping addresses and payment method details (e.g., partial credit card information or other payment details)."
            />
            <ListItem
              primary="Communications"
              secondary="When you contact us (e.g., via email, contact forms, or chat), we collect the information you choose to share, including the contents of your message."
            />
          </ul>
        </SubSection>

        <SubSection title="1.2. Information Collected Automatically">
          <ul className="space-y-4">
            <ListItem
              primary="Log Data"
              secondary="Our servers automatically record certain information when you visit or use the Site. This may include your Internet Protocol (IP) address, browser type, device type, operating system, referring URLs, pages viewed, and timestamps of your visits."
            />
            <ListItem
              primary="Cookies and Similar Technologies"
              secondary="We use cookies and similar tracking technologies to personalize your experience, analyze usage, and improve our Site. Cookies are small data files stored on your device. You can manage cookie preferences in your browser settings."
            />
          </ul>
        </SubSection>

        <SubSection title="1.3. Information from Third Parties">
          <p className="mb-4">
            We may receive information about you from third-party service providers, partners, or publicly
            available sources when you engage with our content or use their services in connection with
            ours.
          </p>
        </SubSection>
      </Section>

      <Section title="2. How We Use Your Information">
        <p className="mb-4">
          We use the personal information we collect for the following purposes:
        </p>
        <ul className="space-y-2 list-disc pl-5 mb-4">
          <li>Providing and Maintaining the Site: To operate the Site, enable your access, process your transactions, and provide related services.</li>
          <li>Improving and Personalizing the Site: To understand how users interact with the Site, personalize your user experience, and develop new features or services.</li>
          <li>Communication: To communicate with you about updates, offers, promotions, and news related to our Site, as well as to respond to your inquiries or provide customer support.</li>
          <li>Security and Fraud Prevention: To protect our Site and your account, verify identity, and detect and prevent fraud or other illegal activities.</li>
          <li>Compliance with Legal Obligations: To comply with applicable laws, regulations, legal processes, and law enforcement requests.</li>
        </ul>
      </Section>

      <Section title="3. How We Share Your Information">
        <p className="mb-4">
          We may share your information as follows:
        </p>
        <ul className="space-y-2 list-disc pl-5 mb-4">
          <li>Service Providers: We share information with trusted third-party vendors or service providers who perform services on our behalf (e.g., payment processing, data analysis, marketing support, hosting).</li>
          <li>Business Transfers: If we undergo a merger, acquisition, reorganization, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
          <li>Legal Compliance and Protection: We may disclose information if required to do so by law or if we believe in good faith that such disclosure is necessary to comply with legal obligations, protect or defend our rights or property, or protect the safety of our users or the public.</li>
          <li>With Your Consent: We may share your information for other purposes not listed here if you have given us explicit consent to do so.</li>
        </ul>
      </Section>

      <Section title="4. Data Retention">
        <p className="mb-4">
          We retain personal information for as long as necessary to fulfill the purposes outlined in this
          Privacy Policy (unless a longer retention period is required by law). When we no longer need
          your personal information, we will securely dispose of it in accordance with our data retention
          and deletion policies.
        </p>
      </Section>

      <Section title="5. Your Choices and Rights">
        <ul className="space-y-4">
          <ListItem
            primary="Access and Correction"
            secondary="You can access and update certain information through your account settings. If you need further assistance accessing or correcting your personal information, please contact us."
          />
          <ListItem
            primary="Opt-out of Marketing Emails"
            secondary="If you no longer wish to receive marketing emails, you may click the 'Unsubscribe' link in the email or update your email preferences in your account settings."
          />
          <ListItem
            primary="Cookies"
            secondary="You can usually modify your browser settings to decline cookies. Doing so, however, may affect certain features of our Site."
          />
          <ListItem
            primary="Additional Rights (GDPR / CCPA, etc.)"
            secondary="Depending on your jurisdiction, you may have additional rights regarding your personal data (e.g., the right to request deletion, portability, or object to processing). Please contact us if you wish to exercise these rights."
          />
        </ul>
      </Section>

      <Section title="6. Security">
        <p className="mb-4">
          We employ industry-standard security measures to protect your personal information from
          unauthorized access, alteration, disclosure, or destruction. Nevertheless, no online service can
          guarantee complete security, and you share information at your own risk.
        </p>
      </Section>

      <Section title="7. International Data Transfers">
        <p className="mb-4">
          If you are located outside the country where our servers or facilities are located, your
          information may be transferred abroad. We will take appropriate measures to ensure the
          protection of your personal data in accordance with this Privacy Policy and applicable laws.
        </p>
      </Section>

      <Section title="8. Links to Third-Party Websites">
        <p className="mb-4">
          Our Site may contain links to third-party websites or services. We are not responsible for the
          privacy practices of those websites. We encourage you to review the privacy policies of those
          third-party sites before sharing any personal information.
        </p>
      </Section>

      <Section title="9. Children's Privacy">
        <p className="mb-4">
          Our Site is not intended for children under the age of 13, and we do not knowingly collect personal
          information from them. If you believe we have inadvertently collected such information, please
          contact us so we can promptly remove it.
        </p>
      </Section>

      <Section title="10. Changes to This Privacy Policy">
        <p className="mb-4">
          We reserve the right to update or modify this Privacy Policy at any time. When we do, we will
          post the revised policy and update the "Effective Date" at the top. We encourage you to review
          this page periodically to stay informed about our privacy practices.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-4">
          Selliox<br />
          <a href="mailto:info@selliox.com" className="text-blue-600 hover:underline">info@selliox.com</a>
        </p>
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 mt-8">{title}</h2>
    {children}
    <div className="border-t border-gray-200 mt-6"></div>
  </div>
);

const SubSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-3">{title}</h3>
    {children}
  </div>
);

const ListItem = ({ primary, secondary }) => (
  <li className="pl-4">
    <p className="font-medium">{primary}</p>
    <p className="text-gray-600">{secondary}</p>
  </li>
);

export default PrivacyPolicy;