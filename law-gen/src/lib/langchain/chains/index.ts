// LAW.GEN Chain Factory
// Provides mode-based chain routing with strict isolation

import { LAWGenMode, ChainConfig, SessionMemory } from '../types';
import { SchoolChain } from './schoolChain';
// TODO: Import other chains when created
// import { CollegeChain } from './collegeChain';
// import { LawyerChain } from './lawyerChain';

export class ChainFactory {
  private static memory = new SessionMemory();

  static createChain(mode: LAWGenMode, config: ChainConfig) {
    // Validate mode before creating chain
    if (!this.isValidMode(mode)) {
      throw new Error(`Invalid mode: ${mode}. Must be one of: ${this.getValidModes().join(', ')}`);
    }

    switch (mode) {
      case 'school':
        return new SchoolChain(config, this.memory);
      case 'college':
        // return new CollegeChain(config, this.memory);
        throw new Error('College chain not yet implemented');
      case 'lawyer':
        // return new LawyerChain(config, this.memory);
        throw new Error('Lawyer chain not yet implemented');
      default:
        throw new Error(`Unsupported mode: ${mode}`);
    }
  }

  static resetMemoryForMode(sessionId: string, newMode: LAWGenMode) {
    this.memory.resetOnModeChange(sessionId, newMode);
  }

  static clearMemory(sessionId: string) {
    this.memory.clearMemory(sessionId);
  }

  private static isValidMode(mode: string): mode is LAWGenMode {
    return ['school', 'college', 'lawyer'].includes(mode);
  }

  private static getValidModes(): LAWGenMode[] {
    return ['school', 'college', 'lawyer'];
  }
}

// Export individual chains for direct use if needed
export { SchoolChain };
// export { CollegeChain };
// export { LawyerChain };
