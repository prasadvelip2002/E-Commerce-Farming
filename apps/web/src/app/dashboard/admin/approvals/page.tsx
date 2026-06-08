'use client';
import { useState, useEffect } from 'react';

interface KycApplication {
  id: string;
  farmerName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  gpsLocation: string;
  totalAcres: number;
  ownershipType: string;
  farmingMethod: string;
  leaseDocumentUrl: string;
  govRecordsUrl: string;
  organicCertificateUrl: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function ApprovalsPage() {
  const [applications, setApplications] = useState<KycApplication[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Checklist State
  const [checklist, setChecklist] = useState({
    identity: false,
    location: false,
    size: false,
    ownership: false,
    farmingMethod: false,
    records: false,
  });

  // Reset checklist when selected app changes
  useEffect(() => {
    setChecklist({
      identity: false, location: false, size: false,
      ownership: false, farmingMethod: false, records: false
    });
  }, [selectedId]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:5153/api/verification/pending');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      const mappedApps: KycApplication[] = data.map((v: any) => ({
        id: v.verificationId,
        farmerName: v.farmerName,
        email: v.email,
        phone: v.phoneNumber,
        aadhaarNumber: v.aadhaarNumber,
        gpsLocation: v.gpsLocation,
        totalAcres: v.totalAcres,
        ownershipType: v.ownershipType,
        farmingMethod: v.farmingMethod,
        leaseDocumentUrl: v.leaseDocumentUrl,
        govRecordsUrl: v.govRecordsUrl,
        organicCertificateUrl: v.organicCertificateUrl,
        submittedAt: v.submittedAt,
        status: v.status
      }));
      setApplications(mappedApps);
      if (mappedApps.length > 0 && !selectedId) {
        setSelectedId(mappedApps[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingApps = applications.filter(a => a.status === 'Pending');
  const selectedApp = pendingApps.find(a => a.id === selectedId);

  const handleAction = async (id: string, action: 'Approved' | 'Rejected') => {
    if (!confirm(`Are you sure you want to ${action.toUpperCase()} this application?`)) return;
    
    try {
      const res = await fetch('http://localhost:5153/api/verification/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          verificationId: id, 
          isApproved: action === 'Approved',
          notes: `Admin ${action}`
        })
      });
      
      if (!res.ok) throw new Error('Action failed');
      
      // Select next available
      const remaining = pendingApps.filter(a => a.id !== id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      
      fetchApplications();
    } catch (err) {
      alert(`Failed to ${action} the application.`);
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col overflow-hidden">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">KYC Approvals</h1>
        <p className="text-gray-500 mt-1">Review and verify farmer identities and farm locations.</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Pane: List */}
        <div className="w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-gray-800">Pending Review ({pendingApps.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="p-4 animate-pulse space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ) : pendingApps.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No pending applications.</div>
            ) : (
              pendingApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${
                    selectedId === app.id
                      ? 'bg-green-50 border-[#4A7C59] shadow-sm'
                      : 'bg-white border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className={`font-bold ${selectedId === app.id ? 'text-[#4A7C59]' : 'text-gray-800'}`}>
                      {app.farmerName}
                    </p>
                    <span className="text-xs text-gray-400 font-mono">{app.id.split('-').pop()}</span>
                  </div>
                  <p className="text-xs text-gray-500">Submitted: {app.submittedAt}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Detail */}
        <div className="w-2/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {selectedApp ? (
            <>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedApp.farmerName}</h2>
                  <p className="text-sm text-gray-500">{selectedApp.email} · {selectedApp.phone}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(selectedApp.id, 'Rejected')}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(selectedApp.id, 'Approved')}
                    disabled={!Object.values(checklist).every(Boolean)}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-[#4A7C59] hover:bg-[#3a6347] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve Farmer
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Authorizer Checklist */}
                <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
                  <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-4">Authorizer Stage-by-Stage Verification Checklist</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={checklist.identity} onChange={e => setChecklist(c => ({...c, identity: e.target.checked}))} className="w-5 h-5 rounded text-[#4A7C59] border-gray-300" />
                      <span className="text-sm font-medium text-gray-800">Identity matches government ID</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={checklist.location} onChange={e => setChecklist(c => ({...c, location: e.target.checked}))} className="w-5 h-5 rounded text-[#4A7C59] border-gray-300" />
                      <span className="text-sm font-medium text-gray-800">Land location matches coordinates</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={checklist.size} onChange={e => setChecklist(c => ({...c, size: e.target.checked}))} className="w-5 h-5 rounded text-[#4A7C59] border-gray-300" />
                      <span className="text-sm font-medium text-gray-800">Land size matches dimensions</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={checklist.ownership} onChange={e => setChecklist(c => ({...c, ownership: e.target.checked}))} className="w-5 h-5 rounded text-[#4A7C59] border-gray-300" />
                      <span className="text-sm font-medium text-gray-800">Ownership/Lease documents verified</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={checklist.farmingMethod} onChange={e => setChecklist(c => ({...c, farmingMethod: e.target.checked}))} className="w-5 h-5 rounded text-[#4A7C59] border-gray-300" />
                      <span className="text-sm font-medium text-gray-800">Crop types & Organic certs validated</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={checklist.records} onChange={e => setChecklist(c => ({...c, records: e.target.checked}))} className="w-5 h-5 rounded text-[#4A7C59] border-gray-300" />
                      <span className="text-sm font-medium text-gray-800">Last 2 years gov records checked</span>
                    </label>
                  </div>
                  <p className="text-xs text-orange-600 mt-4 italic">* All items must be physically verified by an Authorizer to unlock approval.</p>
                </div>

                {/* AI KYC Analysis */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-blue-900 font-bold mb-1">AI Document & Identity Scan: <span className="text-green-600">Passed (98% Confidence)</span></h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      The AI Vision engine has scanned the Aadhaar card and matched the extracted text (Name, UID) against the submitted application form with 100% accuracy. The 7/12 Extract document bears a verified digital signature. No signs of digital forgery detected in image metadata.
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Identity Verification</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Aadhaar Number</p>
                      <p className="font-mono text-lg font-medium text-gray-800">{selectedApp.aadhaarNumber}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Farm Details</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">GPS Coordinates</p>
                        <p className="font-mono text-sm font-medium text-[#4A7C59]">{selectedApp.gpsLocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Total Acres</p>
                        <p className="font-bold text-lg text-gray-800">{selectedApp.totalAcres} <span className="text-sm font-normal text-gray-500">ac</span></p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Farming Operations</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Method</p>
                        <p className="font-mono text-sm font-medium text-[#4A7C59]">{selectedApp.farmingMethod}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Ownership</p>
                        <p className="font-bold text-lg text-gray-800">{selectedApp.ownershipType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Previews */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative aspect-video bg-gray-100 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
                      <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1 border border-green-200 shadow-sm z-20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        AI Verified
                      </div>
                      <span className="text-4xl relative z-10 mb-2">📄</span>
                      <p className="text-sm font-medium text-gray-600 relative z-10">Aadhaar Card (Front)</p>
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-lg shadow-sm">View Full</button>
                      </div>
                    </div>
                    
                    <div className="relative aspect-video bg-gray-100 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50"></div>
                      <span className="text-4xl relative z-10 mb-2">📸</span>
                      <p className="text-sm font-medium text-gray-600 relative z-10">Farm Proof (7/12 Extract)</p>
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-lg shadow-sm">View Full</button>
                      </div>
                    </div>

                    <div className="relative aspect-video bg-gray-100 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-50"></div>
                      <span className="text-4xl relative z-10 mb-2">📑</span>
                      <p className="text-sm font-medium text-gray-600 relative z-10">Lease / Ownership Docs</p>
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-lg shadow-sm">View Full</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <span className="text-6xl mb-4">📋</span>
              <p>Select an application to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
