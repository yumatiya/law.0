# LangChain Integration for LAW.GEN

## Overview
Integrate LangChain into the Next.js + TypeScript LAW.GEN project to replace direct Anthropic API calls with modular, commercial-safe chains for School, College, and Lawyer modes.

## Steps to Complete

### 1. Install LangChain Dependencies
- [ ] Add @langchain/core, @langchain/anthropic, @langchain/community, and related packages to package.json
- [ ] Run npm install to install new dependencies

### 2. Create Folder Structure
- [ ] Create src/lib/langchain/ directory
- [ ] Create subfolders: chains/, prompts/, types/, utils/
- [ ] Ensure structure aligns with existing src/lib/ conventions

### 3. Define Mode Types
- [ ] Create src/lib/langchain/types.ts with TypeScript types for LAW.GEN modes
- [ ] Define strict mode validation functions
- [ ] Include types for context, prompts, and chain configurations

### 4. Implement Prompt Templates
- [ ] Create mode-specific prompt templates in src/lib/langchain/prompts/
- [ ] Implement schoolPrompt.ts, collegePrompt.ts, lawyerPrompt.ts
- [ ] Use LangChain's PromptTemplate with proper variable interpolation

### 5. Build Example Chains
- [ ] Create chain implementations in src/lib/langchain/chains/
- [ ] Implement schoolChain.ts, collegeChain.ts, lawyerChain.ts
- [ ] Use LLMChain or similar for Q&A functionality
- [ ] Ensure model-agnostic design

### 6. Update API Route
- [ ] Refactor law-gen/src/app/api/ai/chat/route.ts to use LangChain chains
- [ ] Implement mode-based routing with strict validation
- [ ] Add session-scoped memory management
- [ ] Reset memory on mode changes to prevent context leakage

### 7. Ensure Model-Agnostic Design
- [ ] Verify chains can work with different LLM providers
- [ ] Add configuration for easy model switching
- [ ] Test with Anthropic as primary, but allow OpenAI/other providers

### 8. Testing and Validation
- [ ] Test mode isolation and validation
- [ ] Verify memory scoping and reset functionality
- [ ] Ensure commercial-safe usage (no GPL/AGPL code)

## Additional Requirements
- Enforce strict mode validation before invoking any chain
- Scope LangChain memory to active session only
- Reset memory when mode changes to prevent cross-mode context leakage
- Keep integration modular and aligned with LAW.GEN architecture
