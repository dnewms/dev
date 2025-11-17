import * as emailValidator from 'email-validator';
import { promises as dns } from 'dns';
import { ValidationResult } from '@/types';
import { prisma } from '@/lib/prisma';
import { cacheGet, cacheSet } from '@/lib/redis';
import * as net from 'net';

// Common typos in email domains for suggestions
const COMMON_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'icloud.com', 'aol.com', 'protonmail.com', 'zoho.com'
];

const TYPO_MAP: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
};

export class EmailValidatorService {
  /**
   * Validate email syntax
   */
  private validateSyntax(email: string): boolean {
    return emailValidator.validate(email);
  }

  /**
   * Check if domain is disposable
   */
  private async isDisposableDomain(domain: string): Promise<boolean> {
    const cacheKey = `disposable:${domain}`;
    const cached = await cacheGet<boolean>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    const disposable = await prisma.disposableDomain.findUnique({
      where: { domain },
    });

    const isDisposable = !!disposable;
    await cacheSet(cacheKey, isDisposable, 86400); // Cache for 24 hours

    return isDisposable;
  }

  /**
   * Check MX records for domain
   */
  private async checkMxRecords(domain: string): Promise<boolean> {
    const cacheKey = `mx:${domain}`;
    const cached = await cacheGet<boolean>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    try {
      const addresses = await dns.resolveMx(domain);
      const hasMx = addresses && addresses.length > 0;
      await cacheSet(cacheKey, hasMx, 3600); // Cache for 1 hour
      return hasMx;
    } catch (error) {
      await cacheSet(cacheKey, false, 3600);
      return false;
    }
  }

  /**
   * Validate SMTP connection (simplified version)
   */
  private async validateSmtp(email: string, domain: string): Promise<boolean> {
    const cacheKey = `smtp:${domain}`;
    const cached = await cacheGet<boolean>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    try {
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        await cacheSet(cacheKey, false, 3600);
        return false;
      }

      // Sort by priority and get the primary MX server
      const primaryMx = mxRecords.sort((a, b) => a.priority - b.priority)[0];

      // Simple connection test
      const result = await this.testSmtpConnection(primaryMx.exchange);
      await cacheSet(cacheKey, result, 3600);
      return result;
    } catch (error) {
      await cacheSet(cacheKey, false, 3600);
      return false;
    }
  }

  /**
   * Test SMTP connection
   */
  private testSmtpConnection(host: string, port: number = 25): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = net.createConnection({ host, port, timeout: 5000 });

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('error', () => {
        resolve(false);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Suggest corrections for common typos
   */
  private suggestCorrection(email: string): string | undefined {
    const [localPart, domain] = email.split('@');

    // Check for exact typo match
    if (TYPO_MAP[domain]) {
      return `${localPart}@${TYPO_MAP[domain]}`;
    }

    // Simple Levenshtein distance check for common domains
    const suggestion = this.findClosestDomain(domain);
    if (suggestion && suggestion !== domain) {
      return `${localPart}@${suggestion}`;
    }

    return undefined;
  }

  /**
   * Find closest domain using simple distance calculation
   */
  private findClosestDomain(domain: string): string | undefined {
    let minDistance = Infinity;
    let closest: string | undefined;

    for (const commonDomain of COMMON_DOMAINS) {
      const distance = this.levenshteinDistance(domain, commonDomain);
      if (distance < minDistance && distance <= 2) {
        minDistance = distance;
        closest = commonDomain;
      }
    }

    return closest;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Main validation method
   */
  async validateEmail(email: string): Promise<ValidationResult> {
    const normalizedEmail = email.toLowerCase().trim();
    const domain = normalizedEmail.split('@')[1] || '';

    // Check syntax first
    const syntaxValid = this.validateSyntax(normalizedEmail);

    if (!syntaxValid) {
      return {
        email: normalizedEmail,
        isValid: false,
        syntaxValid: false,
        mxValid: false,
        smtpValid: false,
        isDisposable: false,
        domain,
        suggestion: this.suggestCorrection(normalizedEmail),
        timestamp: new Date().toISOString(),
      };
    }

    // Run all checks in parallel
    const [isDisposable, mxValid, smtpValid] = await Promise.all([
      this.isDisposableDomain(domain),
      this.checkMxRecords(domain),
      this.validateSmtp(normalizedEmail, domain),
    ]);

    const isValid = syntaxValid && mxValid && !isDisposable;

    return {
      email: normalizedEmail,
      isValid,
      syntaxValid,
      mxValid,
      smtpValid,
      isDisposable,
      domain,
      suggestion: !isValid ? this.suggestCorrection(normalizedEmail) : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Bulk validation
   */
  async validateBulk(emails: string[]): Promise<ValidationResult[]> {
    const uniqueEmails = [...new Set(emails)];
    const validations = await Promise.all(
      uniqueEmails.map(email => this.validateEmail(email))
    );
    return validations;
  }
}

export const emailValidatorService = new EmailValidatorService();
