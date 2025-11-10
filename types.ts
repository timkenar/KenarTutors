// types.ts

export enum UserRole {
  Student = 'student',
  Tutor = 'tutor',
  Admin = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum AssignmentStatus {
  Pending = 'Pending',
  Bidding = 'Open for Bids',
  InProgress = 'In Progress',
  Submitted = 'Submitted',
  Completed = 'Completed',
  Disputed = 'Disputed',
}

export interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  tutorId?: string;
  tutorName?: string;
  title: string;
  subject: string;
  description: string;
  deadline: string;
  budget: number;
  fileUrl?: string;
  submittedFileUrl?: string;
  status: AssignmentStatus;
  createdAt: number;
}

export interface Bid {
    id: string;
    assignmentId: string;
    tutorId: string;
    tutorName: string;
    amount: number;
    proposal: string;
    createdAt: number;
}

export interface Payment {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  amount: number;
  platformFee: number;
  payout: number;
  createdAt: number;
}
