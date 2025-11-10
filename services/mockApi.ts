import { User, UserRole, Assignment, AssignmentStatus, Bid, Payment } from '../types';

// In-memory database
let users: User[] = [
    { id: '1', name: 'Alice Student', email: 'student@test.com', role: UserRole.Student },
    { id: '2', name: 'Bob Tutor', email: 'tutor@test.com', role: UserRole.Tutor },
    { id: '3', name: 'Charlie Admin', email: 'admin@test.com', role: UserRole.Admin },
    { id: '4', name: 'Diana Tutor', email: 'tutor2@test.com', role: UserRole.Tutor },
    { id: '5', name: 'Eve Student', email: 'student2@test.com', role: UserRole.Student },
];

let assignments: Assignment[] = [
    { 
        id: 'a1', studentId: '1', studentName: 'Alice Student', title: 'Calculus Homework', subject: 'Math',
        description: 'Need help with chapter 5 problems on differentiation and integration. It is about 10 problems.',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), budget: 50, status: AssignmentStatus.Bidding,
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    { 
        id: 'a2', studentId: '1', studentName: 'Alice Student', title: 'History Essay', subject: 'History',
        description: 'A 5-page essay on the causes of World War II. Requires research and proper citations.',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), budget: 100, status: AssignmentStatus.InProgress,
        tutorId: '2', tutorName: 'Bob Tutor',
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
     { 
        id: 'a3', studentId: '1', studentName: 'Alice Student', title: 'Chemistry Lab Report', subject: 'Chemistry',
        description: 'Write up a lab report for the titration experiment. Data and instructions attached.',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), budget: 75, status: AssignmentStatus.Submitted,
        tutorId: '4', tutorName: 'Diana Tutor', submittedFileUrl: 'report.pdf',
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    },
    { 
        id: 'a4', studentId: '5', studentName: 'Eve Student', title: 'Previous Work', subject: 'Physics',
        description: 'A presentation on Newtons laws of motion.',
        deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), budget: 60, status: AssignmentStatus.Completed,
        tutorId: '2', tutorName: 'Bob Tutor', submittedFileUrl: 'newton.pptx',
        createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    },
];

let bids: Bid[] = [
    { id: 'b1', assignmentId: 'a1', tutorId: '2', tutorName: 'Bob Tutor', amount: 45, proposal: 'I have a PhD in Mathematics and can help you with your calculus homework easily.', createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
    { id: 'b2', assignmentId: 'a1', tutorId: '4', tutorName: 'Diana Tutor', amount: 48, proposal: 'I am an experienced math tutor and can guarantee a high grade.', createdAt: Date.now() - 12 * 60 * 60 * 1000 },
];

let payments: Payment[] = [
    {
        id: 'p1', assignmentId: 'a4', assignmentTitle: 'Previous Work', studentId: '5', studentName: 'Eve Student',
        tutorId: '2', tutorName: 'Bob Tutor', amount: 60, platformFee: 6, payout: 54,
        createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    }
];

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

interface PlatformAnalytics {
  totalUsers: number;
  studentCount: number;
  tutorCount: number;
  totalVolume: number;
  platformRevenue: number;
  recentPayments: Payment[];
}

export const mockApi = {
    login: async (email: string, password: string): Promise<User | null> => {
        await delay(500);
        const user = users.find(u => u.email === email);
        if (user) {
            // In a real app, you'd check the password hash
            return user;
        }
        return null;
    },

    register: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
        await delay(500);
        if (users.some(u => u.email === email)) {
            throw new Error('User with this email already exists.');
        }
        const newUser: User = { id: String(users.length + 1), name, email, role };
        users.push(newUser);
        return newUser;
    },
    
    loginWithGoogle: async (): Promise<User> => {
        await delay(700);
        // For mock purposes, just log in as the student.
        return users[0];
    },

    createAssignment: async (data: Omit<Assignment, 'id' | 'studentId' | 'studentName' | 'status' | 'createdAt'>, student: User): Promise<Assignment> => {
        await delay(800);
        const newAssignment: Assignment = {
            ...data,
            id: `a${assignments.length + 1}`,
            studentId: student.id,
            studentName: student.name,
            status: AssignmentStatus.Bidding,
            createdAt: Date.now(),
        };
        assignments.unshift(newAssignment);
        return newAssignment;
    },

    getAssignments: async (user: User): Promise<Assignment[]> => {
        await delay(600);
        if (user.role === UserRole.Student) {
            return assignments.filter(a => a.studentId === user.id).sort((a, b) => b.createdAt - a.createdAt);
        }
        if (user.role === UserRole.Tutor) {
            // Tutors see assignments they haven't bid on and are open for bidding
            const tutorBids = bids.filter(b => b.tutorId === user.id).map(b => b.assignmentId);
            return assignments.filter(a => a.status === AssignmentStatus.Bidding && !tutorBids.includes(a.id));
        }
        return [];
    },

    getBidsForAssignment: async (assignmentId: string): Promise<Bid[]> => {
        await delay(400);
        return bids.filter(b => b.assignmentId === assignmentId).sort((a,b) => a.createdAt - b.createdAt);
    },

    acceptBid: async (assignmentId: string, bid: Bid): Promise<Assignment> => {
        await delay(500);
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) throw new Error('Assignment not found');
        assignment.status = AssignmentStatus.InProgress;
        assignment.tutorId = bid.tutorId;
        assignment.tutorName = bid.tutorName;
        return assignment;
    },

    completeAssignment: async (assignmentId: string): Promise<Assignment> => {
        await delay(500);
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) throw new Error('Assignment not found');
        if (!assignment.tutorId || !assignment.tutorName) throw new Error('Assignment has no tutor');
        
        assignment.status = AssignmentStatus.Completed;

        // Create a payment record
        const platformFee = assignment.budget * 0.10; // 10% platform fee
        const newPayment: Payment = {
          id: `p${payments.length + 1}`,
          assignmentId: assignment.id,
          assignmentTitle: assignment.title,
          studentId: assignment.studentId,
          studentName: assignment.studentName,
          tutorId: assignment.tutorId,
          tutorName: assignment.tutorName,
          amount: assignment.budget,
          platformFee: platformFee,
          payout: assignment.budget - platformFee,
          createdAt: Date.now(),
        };
        payments.push(newPayment);

        return assignment;
    },
    
    getTutorAssignments: async(tutorId: string): Promise<{active: Assignment[], completed: Assignment[]}> => {
        await delay(700);
        const all = assignments.filter(a => a.tutorId === tutorId);
        const active = all.filter(a => a.status === AssignmentStatus.InProgress || a.status === AssignmentStatus.Submitted);
        const completed = all.filter(a => a.status === AssignmentStatus.Completed || a.status === AssignmentStatus.Disputed);
        return {active, completed};
    },
    
    createBid: async(data: Omit<Bid, 'id' | 'tutorName' | 'createdAt'>, tutor: User): Promise<Bid> => {
        await delay(500);
         if (bids.some(b => b.assignmentId === data.assignmentId && b.tutorId === tutor.id)) {
            throw new Error('You have already placed a bid on this assignment.');
        }
        const newBid: Bid = {
            ...data,
            id: `b${bids.length + 1}`,
            tutorName: tutor.name,
            createdAt: Date.now(),
        };
        bids.push(newBid);
        return newBid;
    },
    
    submitWork: async(assignmentId: string, fileName: string): Promise<Assignment> => {
        await delay(1000);
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) throw new Error('Assignment not found');
        assignment.status = AssignmentStatus.Submitted;
        assignment.submittedFileUrl = fileName;
        return assignment;
    },
    
    getAllUsers: async(): Promise<User[]> => {
        await delay(300);
        return [...users];
    },

    getAllAssignments: async(): Promise<Assignment[]> => {
        await delay(400);
        return [...assignments].sort((a, b) => b.createdAt - a.createdAt);
    },

    getPlatformAnalytics: async (): Promise<PlatformAnalytics> => {
      await delay(800);
      const studentCount = users.filter(u => u.role === UserRole.Student).length;
      const tutorCount = users.filter(u => u.role === UserRole.Tutor).length;
      const totalVolume = payments.reduce((sum, p) => sum + p.amount, 0);
      const platformRevenue = payments.reduce((sum, p) => sum + p.platformFee, 0);
      return {
        totalUsers: users.length,
        studentCount,
        tutorCount,
        totalVolume,
        platformRevenue,
        recentPayments: [...payments].sort((a,b) => b.createdAt - a.createdAt).slice(0, 20), // get last 20
      };
    },
};
