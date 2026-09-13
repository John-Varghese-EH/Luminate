export interface EmailCheckResult {
  valid: boolean;
  block: boolean;
  domain: string;
  base_domain: string;
  text: string;
  reason: string;
  risk: number;
  is_disposable: boolean;
  is_email_forwarder: boolean;
  is_public_free: boolean;
  is_public_premium: boolean;
  is_business_provider: boolean;
  is_isp_email: boolean;
  is_email_api: boolean;
  is_web_hosting_email: boolean;
  is_self_hosted: boolean;
  is_parked: boolean;
  is_role_based_email: boolean;
  mx_host: string;
  mx_ip: string;
  mx_info: string;
  mx_fallback: boolean;
  mx_hosts: string[];
  mx_ips: string[];
  mx_priorities: Record<string, number>;
  email_provider: string;
  disposable_provider: string;
  possible_typo: string[];
  domain_age_days: number;
  domain_created_at: string;
  block_status_changed_at: string;
}

export interface EmailValidationResponse {
  isValid: boolean;
  error?: string;
  data?: EmailCheckResult;
}

/**
 * Checks an email against api.check-mail.org/v2/ to verify if it's a real, non-temporary account.
 * Useful for login and registration flows.
 * 
 * @param email The email address to check
 * @returns An object containing validation status and raw API data
 */
export async function checkEmailValidity(email: string): Promise<EmailValidationResponse> {
  try {
    const params = new URLSearchParams();
    params.append('email', email);

    const response = await fetch('https://api.check-mail.org/v2/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      return { 
        isValid: false, 
        error: `Failed to check email: ${response.status} - ${response.statusText}` 
      };
    }

    const data: EmailCheckResult = await response.json();

    // Determine if the email is a valid, real account.
    // We reject if it's explicitly marked as disposable, blocked, or not valid.
    const isTempOrBlocked = data.is_disposable || data.block || !data.valid;
    
    // You might also want to filter by risk score if needed (e.g. data.risk > 90)
    // const isHighRisk = data.risk >= 90;
    
    const isValidRealAccount = !isTempOrBlocked;

    return { 
      isValid: isValidRealAccount, 
      data 
    };
  } catch (error) {
    console.error('[checkEmailValidity] Error checking email:', error);
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown network error occurred.' 
    };
  }
}
