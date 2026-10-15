import React from 'react';
import { ShieldCheck, Clock, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const StudentVerificationBanner: React.FC = () => {
  const { currentUser, setIsVerificationModalOpen, isAuthenticated } = useApp();

  if (!isAuthenticated || currentUser?.role !== 'student') {
    return null;
  }

  const status = currentUser?.student_verification_status || 'unverified';

  if (status === 'verified') {
    return null;
  }

  return (
    <div className="w-full bg-[#FFFFFF] border-b border-[#E5DDD1] px-4 py-3 transition-all">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#581C2E]/10 text-[#581C2E] flex items-center justify-center shrink-0">
            {status === 'unverified' && <ShieldCheck className="w-4 h-4" />}
            {status === 'pending' && <Clock className="w-4 h-4" />}
            {status === 'info_requested' && <Info className="w-4 h-4" />}
            {status === 'rejected' && <AlertCircle className="w-4 h-4" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif font-bold text-sm text-[#1C1311]">
                {status === 'unverified' && 'Student Identity Verification Required'}
                {status === 'pending' && 'Student Verification Under Review'}
                {status === 'info_requested' && 'Additional Student Information Requested'}
                {status === 'rejected' && 'Verification Application Requires Updates'}
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#735E55] font-semibold">
                [{status === 'unverified' ? 'Not Verified' : status === 'pending' ? 'Pending' : status === 'info_requested' ? 'Action Needed' : 'Resubmit'}]
              </span>
            </div>
            <p className="text-xs text-[#5C4A42] mt-0.5">
              {status === 'unverified' && 'Verify your institutional credentials to earn accredited session hours and build your student portfolio.'}
              {status === 'pending' && 'Your university credentials are currently being reviewed by campus organizers. Verified badges appear upon approval.'}
              {status === 'info_requested' && (currentUser?.verification_info_request ? `Reviewer: "${currentUser.verification_info_request}"` : 'The reviewer requires clarification before approving your collegiate standing.')}
              {status === 'rejected' && (currentUser?.verification_rejection_reason ? `Feedback: "${currentUser.verification_rejection_reason}"` : 'Please correct your collegiate credentials and resubmit.')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVerificationModalOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs bg-[#581C2E] text-[#FAF7F2] hover:bg-[#431422] cursor-pointer"
        >
          <span>
            {status === 'unverified' && 'Verify Student ID'}
            {status === 'pending' && 'View Application'}
            {status === 'info_requested' && 'Respond & Resubmit'}
            {status === 'rejected' && 'Review & Resubmit'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
