const TermOfUse = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg mt-20">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Terms and Conditions
      </h1>
      <p className="mb-4">
        Welcome to <strong>Ikuku_Tech_Property</strong>. By using our website
        and services, you agree to comply with and be bound by the following
        terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        By accessing or using our website, you agree to these Terms and
        Conditions. If you do not agree, please discontinue use immediately.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Services Provided</h2>
      <p className="mb-4">
        Ikuku_Tech_Property offers real estate listings, property inquiries, and
        related services. All information provided is for general purposes only
        and is subject to change.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. User Obligations</h2>
      <ul className="list-disc list-inside mb-4">
        <li>You must be at least 18 years old to use our services.</li>
        <li>You agree to provide accurate and truthful information.</li>
        <li>
          You must not engage in any illegal activities or misuse our platform.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Property Listings</h2>
      <p className="mb-4">
        Ikuku_Tech_Property does not guarantee the accuracy of property
        descriptions, availability, or pricing. Property details are subject to
        change without notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Intellectual Property
      </h2>
      <p className="mb-4">
        All content on this website, including logos, images, and text, is the
        property of Ikuku_Tech_Property and may not be copied or reproduced
        without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Limitation of Liability
      </h2>
      <p className="mb-4">Ikuku_Tech_Property is not responsible for:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Errors or inaccuracies in property listings.</li>
        <li>Financial losses from property transactions.</li>
        <li>Website downtime or technical errors.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your access to our platform
        if you violate these Terms and Conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Governing Law</h2>
      <p className="mb-4">
        These Terms and Conditions are governed by the law. Any disputes will be
        resolved through arbitration or local courts.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Changes to Terms</h2>
      <p className="mb-4">
        Ikuku_Tech_Property reserves the right to modify these Terms and
        Conditions at any time. Continued use of the platform constitutes
        acceptance of the updated terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Contact Us</h2>
      <p className="mb-4">
        For any questions regarding these Terms and Conditions, please contact:
      </p>
      <p>
        Email:{" "}
        <a
          href="mailto:ikukutechproperty@gmail.com"
          className="text-red-500 underline"
        >
          ikukutechproperty@gmail.com
        </a>
      </p>
      <p>
        Phone:{" "}
        <a href="tel:+2349030952594" className="text-red-500 underline">
          +2349030952594
        </a>
      </p>
    </div>
  );
};

export default TermOfUse;
