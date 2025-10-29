/**
 * API Helper utilities
 */

export class ApiHelper {
  /**
   * Build query string from object
   */
  static buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    return queryParams.toString();
  }

  /**
   * Validate response structure
   */
  static validateResponse(response: Cypress.Response<any>, expectedFields: string[]): boolean {
    return expectedFields.every((field) => {
      return field.split('.').reduce((obj, key) => obj?.[key], response.body) !== undefined;
    });
  }

  /**
   * Extract response data
   */
  static extractData<T>(response: Cypress.Response<any>, path?: string): T {
    if (!path) {
      return response.body as T;
    }
    return path.split('.').reduce((obj, key) => obj?.[key], response.body) as T;
  }

  /**
   * Handle API errors
   */
  static handleError(response: Cypress.Response<any>): void {
    if (response.status >= 400) {
      const errorMessage =
        response.body?.message || response.body?.error || `HTTP ${response.status} Error`;
      throw new Error(errorMessage);
    }
  }
}

