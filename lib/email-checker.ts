export interface EmailValidationResponse {
  isValid: boolean;
  error?: string;
}

const ROLE_BASED_PREFIXES = [
  'admin', 'info', 'support', 'contact', 'test', 
  'noreply', 'no-reply', 'hello', 'sales', 'marketing'
];

/**
 * Checks an email against basic regex, role-based prefixes, and debounce.io for disposable domains.
 * Provides user-friendly error messages and suggestions on rejection.
 */
export async function checkEmailValidity(email: string): Promise<EmailValidationResponse> {
  try {
    // 1. Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: "This email address doesn't look quite right. Did you make a typo?"
      };
    }

    const [localPart] = email.toLowerCase().split('@');

    // 2. Check for role-based/test emails
    if (ROLE_BASED_PREFIXES.includes(localPart)) {
      return {
        isValid: false,
        error: `"${localPart}@" is a role-based or test address. Please use a personal email address for your Luminate account.`
      };
    }

    // 3. Check for disposable/temp emails by directly contacting debounce API
    // Using a direct fetch to a free service prevents 401 Unauthorized console errors
    const response = await fetch(`https://disposable.debounce.io/?email=${encodeURIComponent(email)}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.disposable === "true") {
        return {
          isValid: false,
          error: "This looks like a temporary or disposable email address. Please use your primary email to ensure you don't lose access to your study materials."
        };
      }
    }

    // If API fails or email is valid, we allow them to proceed (fail-open)
    return { isValid: true };
    
  } catch (error) {
    console.warn('[checkEmailValidity] Error checking email:', error);
    // Fail-open on network errors so users aren't blocked
    return { isValid: true };
  }
}
