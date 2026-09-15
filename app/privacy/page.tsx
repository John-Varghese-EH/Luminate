export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-8 py-24 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us when you create an account via Google OAuth (Name, Email, Profile Picture) and the content you upload for AI processing.</p>
      <h2>2. How We Use Your Information</h2>
      <p>Your data is used strictly to provide the Luminate educational service, generate study materials, and improve user experience. We do not sell your personal data.</p>
      <h2>3. Cookies</h2>
      <p>We use essential cookies to maintain your authenticated session and preference cookies for theme settings.</p>
      <h2>4. Your Rights</h2>
      <p>Under GDPR and CCPA, you have the right to access, rectify, or erase your personal data. Contact us to exercise these rights.</p>
    </main>
  );
}
