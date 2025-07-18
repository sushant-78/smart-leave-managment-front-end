export interface Leave {
  id: number;
  created_by: number;
  manager_id?: number | null;
  from_date: string;
  to_date: string;
  type: "casual" | "sick" | "earned";
  reason: string;
  status: "pending" | "approved" | "rejected";
  manager_comment?: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
  manager?: {
    name: string;
    email: string;
  };
}

export interface LeaveBalance {
  id: number;
  user_id: number;
  type: "casual" | "sick" | "earned";
  balance: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveApplication {
  from_date: string;
  to_date: string;
  type: "casual" | "sick" | "earned";
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
