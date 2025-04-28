import React from 'react';

const TermsAndConditions = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
        <p className="text-gray-600">Effective Date: {currentDate}</p>
      </div>

      <p className="mb-6">
        Welcome to selliox.com ("we," "us," "our," or the "Site"). By accessing or using our Site, you
        ("user," "you," or "your") agree to be bound by these Terms and Conditions ("Terms"). If you do
        not agree with these Terms, please do not use our Site.
      </p>

      <Section title="1. Use of the Site">
        <ul className="space-y-4">
          <ListItem
            primary="Eligibility"
            secondary="You must be at least the age of majority in your jurisdiction (e.g., 18 years old in most places) to use the Site. By using the Site, you represent and warrant that you meet this eligibility requirement."
          />
          <ListItem
            primary="User Accounts"
            secondary="To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and agree to accept responsibility for all activities that occur under your account."
          />
        </ul>
      </Section>

      <Section title="2. User Conduct">
        <p className="mb-4">
          When using our Site, you agree to:
        </p>
        <ul className="space-y-2 list-disc pl-5 mb-4">
          <li>Lawful Use: Comply with all applicable laws, regulations, and these Terms.</li>
          <li>Accurate Information: Provide accurate and truthful information when creating an account or placing orders.</li>
        </ul>
        <ListItem
          primary="Prohibited Activities"
          secondary={
            <div>
              Refrain from:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Violating any laws or regulations.</li>
                <li>Attempting to gain unauthorized access to any portion of the Site or related systems/networks.</li>
                <li>Interfering with or damaging the Site's functionality, including through the transmission of viruses or other harmful code.</li>
                <li>Engaging in any activity that may disrupt or impair the Site or the experience of other users.</li>
              </ul>
            </div>
          }
        />
      </Section>

      <Section title="3. Purchases, Payments, and Refunds">
        <ul className="space-y-4">
          <ListItem
            primary="Pricing and Availability"
            secondary="All product or service listings are subject to change without notice. We reserve the right to modify or discontinue products or services at any time."
          />
          <ListItem
            primary="Order Acceptance"
            secondary="We reserve the right to refuse or cancel any order for any reason (e.g., suspected fraud, pricing errors, or product unavailability). If your order is canceled after payment has been processed, we will issue a full refund."
          />
          <ListItem
            primary="Payment"
            secondary="When you provide payment information, you represent and warrant that you are authorized to use the designated payment method. You authorize us to charge the payment method for the total amount of your purchase."
          />
          <ListItem
            primary="Refunds and Returns"
            secondary="We may offer refunds or returns subject to our Refund Policy/Return Policy. For more details, please review our separate policy on the Site."
          />
        </ul>
      </Section>

      <Section title="4. Intellectual Property">
        <ul className="space-y-4">
          <ListItem
            primary="Ownership"
            secondary="All content on the Site, including but not limited to text, graphics, logos, images, and software, is the property of selliox.com or its content suppliers and is protected by intellectual property laws."
          />
          <ListItem
            primary="License"
            secondary="We grant you a limited, non-exclusive, non-transferable license to access and use the Site for personal, non-commercial use. No other use is permitted without our express prior written consent."
          />
          <ListItem
            primary="Trademarks"
            secondary="Any trademarks, service marks, or logos displayed on the Site are the property of their respective owners. You may not use them without prior written permission."
          />
        </ul>
      </Section>

      <Section title="5. User-Generated Content">
        <ul className="space-y-4">
          <ListItem
            primary="Responsibility"
            secondary="If you post, upload, or otherwise provide content (e.g., reviews, comments) on the Site, you are solely responsible for ensuring that such content does not violate any law or the rights of any third party."
          />
          <ListItem
            primary="License to Us"
            secondary="By submitting content to the Site, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display that content in connection with the operation of our business."
          />
          <ListItem
            primary="Removal of Content"
            secondary="We reserve the right to remove or modify any user-generated content at any time for any reason."
          />
        </ul>
      </Section>

      <Section title="6. Third-Party Links and Services">
        <p className="mb-4">
          Our Site may contain links to or integrations with third-party websites or services. We do not
          endorse or assume responsibility for any third-party content, services, or products. Your
          interactions with any third-party site or service are governed by the third party's own terms and
          policies.
        </p>
      </Section>

      <Section title="7. Disclaimers">
        <ul className="space-y-4">
          <ListItem
            primary="No Warranty"
            secondary='The Site and all content, products, and services made available through it are provided on an "as is" and "as available" basis, without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.'
          />
          <ListItem
            primary="Operation of the Site"
            secondary="While we strive to maintain the Site's accuracy and reliability, we do not guarantee that it will be error-free, uninterrupted, or free of viruses or other harmful components."
          />
        </ul>
      </Section>

      <Section title="8. Limitation of Liability">
        <p className="mb-4">
          To the fullest extent permitted by law, selliox.com and its officers, directors, employees, and
          agents shall not be liable for any indirect, incidental, special, consequential, or punitive
          damages, including loss of profits or data, arising out of or in connection with your use of the
          Site or any products/services purchased through it. If we are found liable for any direct
          damages, our total liability shall not exceed the amount you paid for the applicable product or
          service.
        </p>
      </Section>

      <Section title="9. Indemnification">
        <p className="mb-4">
          You agree to defend, indemnify, and hold selliox.com, its affiliates, and their respective officers,
          directors, employees, and agents harmless from and against any claims, liabilities, damages,
          judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees)
          resulting from or arising out of your violation of these Terms or your use of the Site.
        </p>
      </Section>

      <Section title="10. Termination">
        <p className="mb-4">
          We reserve the right to terminate or suspend your access to the Site, without notice or liability,
          for any reason (including breach of these Terms). Upon termination, your right to use the Site
          will immediately cease.
        </p>
      </Section>

      <Section title="11. Governing Law and Dispute Resolution">
        <p className="mb-4">
          These Terms and any disputes arising out of or relating to them or the Site are governed by and
          construed in accordance with the laws of [Applicable Jurisdiction], without regard to its conflict of
          law principles. Any legal action or proceeding must be brought exclusively in the federal or state
          courts located in [Applicable Venue]. You consent to personal jurisdiction and venue in those
          courts.
        </p>
      </Section>

      <Section title="12. Changes to These Terms">
        <p className="mb-4">
          We may update or modify these Terms at any time by posting the revised Terms on the Site and
          updating the "Effective Date" above. Your continued use of the Site after such changes indicates
          your acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="13. Miscellaneous">
        <ul className="space-y-4">
          <ListItem
            primary="Severability"
            secondary="If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect."
          />
          <ListItem
            primary="No Waiver"
            secondary="Our failure to enforce any right or provision under these Terms shall not constitute a waiver of that right or provision."
          />
          <ListItem
            primary="Entire Agreement"
            secondary="These Terms and any other policies or legal notices posted by us on the Site constitute the entire agreement between you and selliox.com with respect to the use of the Site."
          />
        </ul>
      </Section>

      <Section title="14. Contact Us">
        <p className="mb-4">
          If you have any questions or concerns about these Terms and Conditions, please contact us at:
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

const ListItem = ({ primary, secondary }) => (
  <li className="pl-4">
    <p className="font-medium">{primary}</p>
    <p className="text-gray-600">{secondary}</p>
  </li>
);

export default TermsAndConditions;