import React, { useState, useEffect, useCallback } from 'react';
import { Assignment, AssignmentStatus, Bid } from '../types';
import { useAuth } from '../App';
import { mockApi } from '../services/mockApi';
import Modal from './Modal';
import { PlusIcon, EyeIcon, CheckCircleIcon, DocumentAddIcon } from './icons';

const AssignmentForm: React.FC<{onClose: () => void; onAssignmentCreated: (newAssignment: Assignment) => void}> = ({onClose, onAssignmentCreated}) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [budget, setBudget] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const newAssignment = await mockApi.createAssignment({ title, subject, description, deadline, budget, fileUrl: file?.name }, user);
            onAssignmentCreated(newAssignment);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-2 rounded text-sm">{error}</p>}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
                    <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget ($)</label>
                    <input type="number" id="budget" value={budget} onChange={e => setBudget(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
            </div>
            <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachment (Optional)</label>
                <input type="file" id="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/40 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/60"/>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 font-medium">{loading ? 'Submitting...' : 'Submit Assignment'}</button>
            </div>
        </form>
    );
};

const BidsViewer: React.FC<{assignment: Assignment, onClose: () => void, onBidAccepted: (assignment: Assignment) => void}> = ({assignment, onClose, onBidAccepted}) => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockApi.getBidsForAssignment(assignment.id).then(data => {
            setBids(data);
            setLoading(false);
        });
    }, [assignment.id]);

    const handleAcceptBid = async (bid: Bid) => {
        const updatedAssignment = await mockApi.acceptBid(assignment.id, bid);
        onBidAccepted(updatedAssignment);
        onClose();
    };

    return (
        <div>
            {loading ? <p className="text-gray-600 dark:text-gray-400">Loading bids...</p> : (
                bids.length > 0 ? (
                    <ul className="space-y-4">
                        {bids.map(bid => (
                            <li key={bid.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{bid.tutorName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{bid.proposal}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${bid.amount}</p>
                                        <button onClick={() => handleAcceptBid(bid)} className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 font-medium">Accept</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-600 dark:text-gray-400">No bids yet for this assignment.</p>
            )}
        </div>
    )
}

const AssignmentCard: React.FC<{assignment: Assignment, onUpdate: () => void}> = ({assignment, onUpdate}) => {
    const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);

    const onBidAccepted = (updatedAssignment: Assignment) => {
        onUpdate();
    }
    
    const handleComplete = async () => {
        await mockApi.completeAssignment(assignment.id);
        onUpdate();
    };

    const statusColor: { [key in AssignmentStatus]: string } = {
        [AssignmentStatus.Pending]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        [AssignmentStatus.Bidding]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        [AssignmentStatus.InProgress]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [AssignmentStatus.Submitted]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        [AssignmentStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [AssignmentStatus.Disputed]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    
    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor[assignment.status]}`}>{assignment.status}</span>
                </div>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{assignment.subject}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed h-12 overflow-hidden">{assignment.description}</p>
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div>
                        <p>Deadline: <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(assignment.deadline).toLocaleDateString()}</span></p>
                        <p>Budget: <span className="font-semibold text-gray-700 dark:text-gray-200">${assignment.budget}</span></p>
                         {assignment.tutorName && <p>Tutor: <span className="font-semibold text-gray-700 dark:text-gray-200">{assignment.tutorName}</span></p>}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        {assignment.status === AssignmentStatus.Bidding && (
                            <button onClick={() => setIsBidsModalOpen(true)} className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold">
                                <EyeIcon/> <span className="ml-1">View Bids</span>
                            </button>
                        )}
                        {assignment.status === AssignmentStatus.Submitted && (
                             <button onClick={handleComplete} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                <CheckCircleIcon/> <span className="ml-1.5">Approve</span>
                            </button>
                        )}
                         {assignment.submittedFileUrl && (
                             <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">View Submission</a>
                         )}
                    </div>
                </div>
            </div>
            <Modal isOpen={isBidsModalOpen} onClose={() => setIsBidsModalOpen(false)} title={`Bids for "${assignment.title}"`}>
                <BidsViewer assignment={assignment} onClose={() => setIsBidsModalOpen(false)} onBidAccepted={onBidAccepted} />
            </Modal>
        </>
    );
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssignments = useCallback(() => {
    if (user) {
      setLoading(true);
      mockApi.getAssignments(user).then(data => {
        setAssignments(data);
        setLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);
  
  const handleAssignmentCreated = (newAssignment: Assignment) => {
    setAssignments(prev => [newAssignment, ...prev]);
  };

  if (loading) return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Loading assignments...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Assignments</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            <PlusIcon/> <span className="ml-2">New Assignment</span>
        </button>
      </div>
      
      {assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map(assignment => <AssignmentCard key={assignment.id} assignment={assignment} onUpdate={fetchAssignments} />)}
          </div>
      ) : (
          <div className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-12 rounded-lg shadow-sm">
                <DocumentAddIcon/>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No assignments yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new assignment.</p>
          </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assignment">
        <AssignmentForm onClose={() => setIsModalOpen(false)} onAssignmentCreated={handleAssignmentCreated} />
      </Modal>
    </div>
  );
}