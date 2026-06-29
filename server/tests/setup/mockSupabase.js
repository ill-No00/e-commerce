import { jest } from "@jest/globals";

export function createMockSupabase() {
  const mockSelect = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockEq = jest.fn();
  const mockNeq = jest.fn();
  const mockIn = jest.fn();
  const mockOrder = jest.fn();
  const mockRange = jest.fn();
  const mockLimit = jest.fn();
  const mockSingle = jest.fn();
  const mockMaybeSingle = jest.fn();
  const mockIlike = jest.fn();
  const mockOr = jest.fn();
  const mockCount = jest.fn();

  function resetChain() {
    mockSelect.mockReturnThis();
    mockInsert.mockReturnThis();
    mockUpdate.mockReturnThis();
    mockDelete.mockReturnThis();
    mockEq.mockReturnThis();
    mockNeq.mockReturnThis();
    mockIn.mockReturnThis();
    mockOrder.mockReturnThis();
    mockRange.mockReturnThis();
    mockLimit.mockReturnThis();
    mockSingle.mockReturnThis();
    mockMaybeSingle.mockReturnThis();
    mockIlike.mockReturnThis();
    mockOr.mockReturnThis();
    mockCount.mockReturnThis();
  }
  resetChain();

  const from = jest.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  }));

  mockSelect.mockImplementation(() => ({
    eq: mockEq,
    neq: mockNeq,
    in: mockIn,
    order: mockOrder,
    range: mockRange,
    limit: mockLimit,
    ilike: mockIlike,
    or: mockOr,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    count: mockCount,
  }));

  mockEq.mockImplementation(() => ({
    eq: mockEq,
    neq: mockNeq,
    in: mockIn,
    order: mockOrder,
    range: mockRange,
    limit: mockLimit,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    select: mockSelect,
    delete: mockDelete,
    update: mockUpdate,
    ilike: mockIlike,
    or: mockOr,
  }));

  mockNeq.mockImplementation(() => ({
    eq: mockEq,
    neq: mockNeq,
    order: mockOrder,
    select: mockSelect,
    range: mockRange,
    limit: mockLimit,
  }));

  mockIn.mockImplementation(() => ({
    eq: mockEq,
    neq: mockNeq,
    order: mockOrder,
    select: mockSelect,
  }));

  mockOrder.mockImplementation(() => ({
    eq: mockEq,
    order: mockOrder,
    range: mockRange,
    limit: mockLimit,
    select: mockSelect,
  }));

  mockRange.mockImplementation(() => ({
    eq: mockEq,
    order: mockOrder,
    select: mockSelect,
    ilike: mockIlike,
  }));

  mockLimit.mockReturnThis();

  mockSingle.mockResolvedValue({ data: null, error: null });
  mockMaybeSingle.mockResolvedValue({ data: null, error: null });
  mockCount.mockResolvedValue({ data: null, error: null, count: 0 });

  const auth = {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    getUser: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    admin: {
      signOut: jest.fn(),
    },
  };

  const mockSupabase = {
    auth,
    from,
    rpc: jest.fn(),
    channel: jest.fn(),
    schema: jest.fn(),
  };

  mockSupabase.resetAll = () => {
    jest.clearAllMocks();
    resetChain();
    mockSingle.mockResolvedValue({ data: null, error: null });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    mockCount.mockResolvedValue({ data: null, error: null, count: 0 });
  };

  return mockSupabase;
}
