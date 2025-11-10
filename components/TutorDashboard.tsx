import React, { useState, useEffect, useCallback } from 'react';
import { Assignment, AssignmentStatus } from '../types';
import { useAuth } from '../App';
import { mockApi } from '../services/mockApi';
import Modal from './Modal';

type TutorView = 'open' | 'active' | 'completed';

const BidForm: React.FC<{assignmentId: string, onClose: () => void, onBidSubmitted: () => void}> = ({assignmentId, onClose, onBidSubmitted}) => {
    const { user } = useAuth();
    const [amount, setAmount] = useState(0);
    const [proposal, setProposal] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            await mockApi.createBid({ assignmentId, tutorId: user.id, amount, proposal }, user);
            onBidSubmitted();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit bid');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-2 rounded text-sm">{error}</p>}
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bid Amount ($)</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
                <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proposal</label>
                <textarea id="proposal" value={proposal} onChange={e => setProposal(e.target.value)} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 font-medium">{loading ? 'Submitting...' : 'Submit Bid'}</button>
            </div>
        </form>
    );
};

const OpenAssignmentCard: React.FC<{assignment: Assignment, onBidSubmitted: () => void}> = ({assignment, onBidSubmitted}) => {
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                     <p className="text-lg font-bold text-green-600 dark:text-green-400">${assignment.budget}</p>
                </div>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{assignment.subject}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed h-12 overflow-hidden">{assignment.description}</p>
                 <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div>
                        <p>Student: <span className="font-medium text-gray-700 dark:text-gray-300">{assignment.studentName}</span></p>
                        <p>Deadline: <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(assignment.deadline).toLocaleDateString()}</span></p>
                    </div>
                    <button onClick={() => setIsBidModalOpen(true)} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                        Bid Now
                    </button>
                </div>
            </div>
            <Modal isOpen={isBidModalOpen} onClose={() => setIsBidModalOpen(false)} title={`Bid on "${assignment.title}"`}>
                <BidForm assignmentId={assignment.id} onClose={() => setIsBidModalOpen(false)} onBidSubmitted={onBidSubmitted} />
            </Modal>
        </>
    );
};

const WorkManagementCard: React.FC<{assignment: Assignment, onUpdate: () => void}> = ({assignment, onUpdate}) => {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmitWork = async () => {
        if (!file) {
            alert("Please select a file to submit.");
            return;
        }
        await mockApi.submitWork(assignment.id, file.name);
        onUpdate();
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
             <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{assignment.subject}</p>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Status: <span className="font-semibold text-gray-700 dark:text-gray-200">{assignment.status}</span></p>
             <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                {assignment.status === AssignmentStatus.InProgress && (
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Submit your work:</p>
                        <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/40 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/60"/>
                        <button onClick={handleSubmitWork} disabled={!file} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 dark:disabled:bg-green-800/50">
                            Submit for Review
                        </button>
                    </div>
                )}
                 {assignment.status === AssignmentStatus.Submitted && <p className="text-purple-600 dark:text-purple-400">Work submitted. Waiting for student approval.</p>}
                 {assignment.status === AssignmentStatus.Completed && <p className="text-green-600 dark:text-green-400 font-bold">Assignment Completed!</p>}
             </div>
        </div>
    );
};


export default function TutorDashboard({ view }: { view: TutorView }) {
  const { user } = useAuth();
  const [openAssignments, setOpenAssignments] = useState<Assignment[]>([]);
  const [myAssignments, setMyAssignments] = useState<{active: Assignment[], completed: Assignment[]}>({active:[], completed:[]});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    if (!user) return;
    setLoading(true);
    
    const openPromise = mockApi.getAssignments(user);
    const myWorkPromise = mockApi.getTutorAssignments(user.id);

    Promise.all([openPromise, myWorkPromise]).then(([openData, myWorkData]) => {
        setOpenAssignments(openData);
        setMyAssignments(myWorkData);
        setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderContent = () => {
      if (loading) return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Loading...</div>;
      
      const EmptyState: React.FC<{message: string}> = ({message}) => (
        <div className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-12 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
        </div>
      );

      switch(view) {
          case 'open':
              return openAssignments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {openAssignments.map(a => <OpenAssignmentCard key={a.id} assignment={a} onBidSubmitted={fetchData} />)}
                  </div>
              ) : <EmptyState message="No open assignments at the moment. Check back later!" />;
          case 'active':
              return myAssignments.active.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myAssignments.active.map(a => <WorkManagementCard key={a.id} assignment={a} onUpdate={fetchData} />)}
                  </div>
              ) : <EmptyState message="You have no active assignments." />;
          case 'completed':
              return myAssignments.completed.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myAssignments.completed.map(a => <WorkManagementCard key={a.id} assignment={a} onUpdate={fetchData} />)}
                  </div>
              ) : <EmptyState message="You haven't completed any assignments yet." />;
      }
  };
  
  const titles: Record<TutorView, string> = {
    open: 'Find New Work',
    active: 'Manage Active Assignments',
    completed: 'View Completed Work'
  };
  
  const subtitles: Record<TutorView, string> = {
      open: 'Bid on available assignments from students.',
      active: 'Manage your ongoing work and submit deliverables.',
      completed: 'Review your history of completed assignments.'
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{titles[view]}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{subtitles[view]}</p>
      <div>
          {renderContent()}
      </div>
    </div>
  );
}