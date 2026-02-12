// BEGIN AI-generated - Following QuizApplication testing pattern

import { ReturnStatusPipe } from './return-request-pipe';

// We test ReturnStatusPipe because it handles:
// - Transforming return status numbers to readable status strings

describe('ReturnStatusPipe', () => {
  let pipe: ReturnStatusPipe;

  beforeEach(() => {
    pipe = new ReturnStatusPipe();
  });

  // --- Basic instantiation ---

  it('should create the pipe', () => {
    // Assert
    expect(pipe).toBeTruthy();
  });

  // --- transform method ---

  it('should transform a valid status number', () => {
    // Act
    const result = pipe.transform(0);

    // Assert - Result depends on mapReturnStatus implementation
    expect(result).toBeDefined();
  });

  it('should handle undefined status gracefully', () => {
    // Act
    const result = pipe.transform(undefined as any);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should handle invalid status number', () => {
    // Act
    const result = pipe.transform(999);

    // Assert - Should return undefined for invalid status
    expect(result).toBeUndefined();
  });
});

// END AI-generated - Following QuizApplication testing pattern
