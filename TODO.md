# Phase 2 Testing Expansions - TODO Plan

## Backend API Tests

1. Chat API
   - Expand coverage in backend/src/api/chat.test.js
   - Test edge cases and error handling
2. Legal Judgement API
   - Completed extended tests in test_api_judge_extended.py
3. Authentication & Security
   - Completed extended tests in test_api_auth_extended.py
4. Mock Court APIs
   - Identify API handlers (e.g., api_web.py)
   - Create new tests covering main endpoints and edge cases
5. Document Handling APIs
   - Currently no explicit implementation found
   - Add tests if/when feature added
6. RAG API
   - Frontend RAG library well covered (rag.test.ts)
   - Add backend RAG API tests if separate

## Frontend Tests

1. Fix import and dependency issues blocking frontend test runs
2. Dashboard page tests (paused awaiting component availability)
3. PracticeHub page tests (created initial tests)
4. Other pages/components in order:
   - MockCourt, DraftBuilder, StatuteNavigation, AI Assistant, 3D viewer

## Environment & Dependencies

- Verify and install '@testing-library/react', '@testing-library/jest-dom', '@testing-library/user-event'
- Check jest/setup files for testing-library integration

---

This plan guides incremental expansion of test coverage and environment fixes needed.
