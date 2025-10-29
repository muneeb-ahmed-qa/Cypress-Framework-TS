/**
 * Tag filtering utilities for test execution
 */

export interface TagConfig {
  include?: string[];
  exclude?: string[];
  requireAll?: boolean;
}

export class TagFilter {
  private config: TagConfig;

  constructor(config: TagConfig = {}) {
    this.config = config;
  }

  /**
   * Check if test should run based on tags
   */
  shouldRunTest(testTags: string[]): boolean {
    if (!testTags || testTags.length === 0) {
      return true; // Run tests without tags by default
    }

    const { include, exclude, requireAll } = this.config;

    // Check exclude tags first
    if (exclude && exclude.length > 0) {
      const hasExcludedTag = testTags.some(tag => exclude.includes(tag));
      if (hasExcludedTag) {
        return false;
      }
    }

    // Check include tags
    if (include && include.length > 0) {
      if (requireAll) {
        // All include tags must be present
        return include.every(tag => testTags.includes(tag));
      } else {
        // At least one include tag must be present
        return testTags.some(tag => include.includes(tag));
      }
    }

    return true;
  }

  /**
   * Parse tags from environment variable
   */
  static parseFromEnv(envValue?: string): TagConfig {
    if (!envValue) {
      return {};
    }

    const config: TagConfig = {};
    const parts = envValue.split(';');

    parts.forEach(part => {
      const [key, value] = part.split('=');
      const trimmedKey = key?.trim();
      const trimmedValue = value?.trim();

      if (trimmedKey === 'include') {
        config.include = trimmedValue?.split(',').map(tag => tag.trim()) || [];
      } else if (trimmedKey === 'exclude') {
        config.exclude = trimmedValue?.split(',').map(tag => tag.trim()) || [];
      } else if (trimmedKey === 'requireAll') {
        config.requireAll = trimmedValue === 'true';
      }
    });

    return config;
  }

  /**
   * Get tag configuration from Cypress environment
   */
  static fromCypressEnv(): TagConfig {
    const tagsEnv = Cypress.env('TAGS');
    const excludeEnv = Cypress.env('EXCLUDE_TAGS');
    const requireAllEnv = Cypress.env('REQUIRE_ALL_TAGS');

    return {
      include: tagsEnv ? tagsEnv.split(',').map(tag => tag.trim()) : undefined,
      exclude: excludeEnv ? excludeEnv.split(',').map(tag => tag.trim()) : undefined,
      requireAll: requireAllEnv === 'true'
    };
  }

  /**
   * Create filter from command line arguments
   */
  static fromArgs(args: string[]): TagConfig {
    const config: TagConfig = {};

    args.forEach((arg, index) => {
      if (arg === '--tags' && args[index + 1]) {
        config.include = args[index + 1].split(',').map(tag => tag.trim());
      } else if (arg === '--exclude-tags' && args[index + 1]) {
        config.exclude = args[index + 1].split(',').map(tag => tag.trim());
      } else if (arg === '--require-all-tags') {
        config.requireAll = true;
      }
    });

    return config;
  }

  /**
   * Get all available tags from test files
   */
  static async getAllTags(): Promise<string[]> {
    // This would typically scan test files for tags
    // For now, return common tags
    return [
      'smoke', 'regression', 'critical', 'integration', 'api', 'ui', 'visual',
      'slow', 'flaky', 'e2e', 'unit', 'frontend', 'backend', 'comprehensive',
      'high-priority', 'low-priority', 'performance', 'security', 'accessibility'
    ];
  }

  /**
   * Validate tag configuration
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.config.include && this.config.include.length === 0) {
      errors.push('Include tags cannot be empty');
    }

    if (this.config.exclude && this.config.exclude.length === 0) {
      errors.push('Exclude tags cannot be empty');
    }

    if (this.config.include && this.config.exclude) {
      const overlap = this.config.include.filter(tag => this.config.exclude!.includes(tag));
      if (overlap.length > 0) {
        errors.push(`Tags cannot be both included and excluded: ${overlap.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Predefined tag configurations for common scenarios
 */
export const TagPresets = {
  smoke: { include: ['smoke', 'critical'] },
  regression: { include: ['regression', 'comprehensive'] },
  critical: { include: ['critical', 'high-priority'] },
  api: { include: ['api', 'backend'] },
  ui: { include: ['ui', 'frontend'] },
  visual: { include: ['visual', 'screenshot'] },
  fast: { exclude: ['slow', 'performance'] },
  stable: { exclude: ['flaky', 'unstable'] },
  e2e: { include: ['e2e', 'integration'] }
};
