export default function TermsAndConditions() {
  return (
    <main className="max-w-4xl mx-auto p-8 py-24 prose dark:prose-invert">
      <h1>Terms & Conditions</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing Luminate, you agree to be bound by these Terms and Conditions.</p>
      <h2>2. AI-Generated Content</h2>
      <p>Luminate utilizes AI to generate educational content. We do not guarantee 100% accuracy of the generated materials. Users are responsible for verifying facts.</p>
      <h2>3. Intellectual Property</h2>
      <p>You retain rights to the original documents you upload. Luminate retains rights to the platform's code, branding, and UI.</p>
      <h2>4. Limitation of Liability</h2>
      <p>Luminate shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our service.</p>
    </main>
  );
}
