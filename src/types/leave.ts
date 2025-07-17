export interface Leave {
  id: number;
  user_id: number;
  from_date: string;
  to_date: string;
  type: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  manager_comment?: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface LeaveBalance {
  id: number;
  user_id: number;
  type: string;
  balance: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveApplication {
  from_date: string;
  to_date: string;
  type: string;
  reason: string;
}

export interface LeaveApproval {
  status: "approved" | "rejected";
  manager_comment: string;
}

export interface LeaveState {
  leaves: Leave[];
  balances: LeaveBalance[];
  loading: boolean;
  error: string | null;
}
