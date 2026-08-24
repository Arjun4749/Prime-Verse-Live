import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
} from '../../lib/workspaceAuth';
import {
  fetchGmailMessages,
  sendGmailEmail,
  GmailMessageSummary,
} from '../../services/gmailService';
import {
  fetchDriveFiles,
  uploadDriveTextFile,
  deleteDriveFile,
  DriveFileItem,
} from '../../services/driveService';
import {
  Mail,
  HardDrive,
  RefreshCw,
  Send,
  Upload,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  LogOut,
  FileText,
  Inbox,
  Sparkles,
} from 'lucide-react';

export const WorkspaceHub: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'gmail' | 'drive'>('gmail');

  // Gmail states
  const [emails, setEmails] = useState<GmailMessageSummary[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState<boolean>(false);
  const [gmailError, setGmailError] = useState<string | null>(null);

  // Email Composer states
  const [toEmail, setToEmail] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [showSendConfirm, setShowSendConfirm] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  // Drive states
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState<boolean>(false);
  const [driveError, setDriveError] = useState<string | null>(null);

  // Drive Upload states
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFileContent, setNewFileContent] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Drive Delete confirmation state
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Load data when token changes
  useEffect(() => {
    if (token) {
      loadGmail();
      loadDrive();
    }
  }, [token]);

  const handleLogin = async () => {
    setIsLoadingAuth(true);
    setGmailError(null);
    setDriveError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      setGmailError(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setNeedsAuth(true);
    setEmails([]);
    setDriveFiles([]);
  };

  const loadGmail = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) return;
    setIsLoadingEmails(true);
    setGmailError(null);
    try {
      const msgs = await fetchGmailMessages(currentToken, '', 8);
      setEmails(msgs);
    } catch (err: any) {
      setGmailError(err.message || 'Error loading Gmail messages');
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const loadDrive = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) return;
    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const files = await fetchDriveFiles(currentToken, "trashed = false", 12);
      setDriveFiles(files);
    } catch (err: any) {
      setDriveError(err.message || 'Error loading Google Drive files');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleConfirmSendEmail = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken || !toEmail || !emailSubject || !emailBody) return;
    setIsSendingEmail(true);
    setEmailSuccessMsg(null);
    setGmailError(null);
    try {
      await sendGmailEmail(currentToken, toEmail, emailSubject, emailBody);
      setEmailSuccessMsg(`Email successfully sent to ${toEmail}`);
      setToEmail('');
      setEmailSubject('');
      setEmailBody('');
      setShowSendConfirm(false);
      loadGmail();
    } catch (err: any) {
      setGmailError(err.message || 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleUploadToDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentToken = token || (await getAccessToken());
    if (!currentToken || !newFileName || !newFileContent) return;
    setIsUploading(true);
    setUploadSuccessMsg(null);
    setDriveError(null);
    try {
      await uploadDriveTextFile(currentToken, newFileName, newFileContent);
      setUploadSuccessMsg(`File '${newFileName}' uploaded to Google Drive!`);
      setNewFileName('');
      setNewFileContent('');
      loadDrive();
    } catch (err: any) {
      setDriveError(err.message || 'Failed to upload to Drive');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDeleteFile = async () => {
    if (!fileToDelete) return;
    const currentToken = token || (await getAccessToken());
    if (!currentToken) return;

    setIsDeletingFile(true);
    setDriveError(null);
    try {
      await deleteDriveFile(currentToken, fileToDelete.id);
      setDriveFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err: any) {
      setDriveError(err.message || 'Failed to delete file from Drive');
    } finally {
      setIsDeletingFile(false);
    }
  };

  const handleQuickExportLeaderboard = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) return;

    setIsUploading(true);
    setUploadSuccessMsg(null);
    const exportContent = `# PRIME verse BGMI Tournament Standings
Generated Date: ${new Date().toLocaleString()}

Rank | Team Name | Matches Played | WWCD | Finish Points | Total Points
1. GodLike Esports | 12 | 4 | 82 | 142
2. Soul | 12 | 3 | 74 | 128
3. Global Esports | 12 | 2 | 65 | 115
4. Orangutan | 12 | 2 | 58 | 102
5. Blind Esports | 12 | 1 | 51 | 89

Status: Verified & Audited by PRIME verse Admin.
`;

    try {
      const fileName = `PRIMEverse_BGMI_Leaderboard_${Date.now()}.txt`;
      await uploadDriveTextFile(currentToken, fileName, exportContent);
      setUploadSuccessMsg(`Exported leaderboard as '${fileName}' to Google Drive!`);
      loadDrive();
    } catch (err: any) {
      setDriveError(err.message || 'Failed to export leaderboard');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#111218]/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gradient-to-r from-red-500/20 to-blue-500/20 border border-red-500/30 text-xs font-semibold text-red-400 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Integration
            </span>
            <span className="text-xs text-gray-400">OAuth Connected</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
            Google Workspace Hub
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage Gmail communications, tournament announcements, rulebooks, and Google Drive files.
          </p>
        </div>

        {/* User Auth Bar */}
        <div>
          {user ? (
            <div className="flex items-center gap-3 bg-[#181a24] border border-white/10 p-2.5 rounded-xl">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-orange-500/50" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">{user.displayName || 'Connected Account'}</p>
                <p className="text-[11px] text-gray-400 leading-tight truncate max-w-[150px]">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors ml-1"
                title="Disconnect Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoadingAuth}
              className="px-4 py-2.5 bg-white text-gray-900 font-semibold text-sm rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2.5 shadow-lg shadow-white/5 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {isLoadingAuth ? 'Connecting...' : 'Sign in with Google'}
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      {!needsAuth && user ? (
        <div className="mt-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveTab('gmail')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'gmail'
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-4 h-4" /> Gmail Operations
            </button>
            <button
              onClick={() => setActiveTab('drive')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'drive'
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HardDrive className="w-4 h-4" /> Google Drive Storage
            </button>
          </div>

          {/* GMAIL TAB CONTENT */}
          {activeTab === 'gmail' && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inbox List */}
              <div className="lg:col-span-6 bg-[#161722] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-red-400" /> Recent Gmail Messages
                  </h3>
                  <button
                    onClick={loadGmail}
                    disabled={isLoadingEmails}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Refresh Gmail"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEmails ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {gmailError && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                    {gmailError}
                  </div>
                )}

                {isLoadingEmails ? (
                  <div className="py-12 text-center text-xs text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-red-400" />
                    Fetching Gmail inbox...
                  </div>
                ) : emails.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-500">
                    No recent messages found in Gmail.
                  </div>
                ) : (
                  <div className="mt-3 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {emails.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3 bg-[#1e2030] hover:bg-[#25283b] border border-white/5 rounded-lg transition-all"
                      >
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span className="font-semibold text-gray-200 truncate max-w-[200px]">{msg.from}</span>
                          <span className="text-[10px] text-gray-500">{msg.date?.split(' ').slice(0, 4).join(' ')}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{msg.subject}</h4>
                        <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{msg.snippet}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Email Composer */}
              <div className="lg:col-span-6 bg-[#161722] border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-3 border-b border-white/10">
                  <Send className="w-4 h-4 text-orange-400" /> Compose & Send Gmail Message
                </h3>

                {emailSuccessMsg && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {emailSuccessMsg}
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Recipient Email (To)</label>
                    <input
                      type="email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="e.g. captain@godlikeesports.in"
                      className="w-full bg-[#1e2030] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g. PRIME verse Tournament Confirmation & Room Credentials"
                      className="w-full bg-[#1e2030] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Message Body</label>
                    <textarea
                      rows={4}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Enter the official communication details here..."
                      className="w-full bg-[#1e2030] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!toEmail || !emailSubject || !emailBody) {
                        alert('Please fill out all fields before sending.');
                        return;
                      }
                      setShowSendConfirm(true);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Prepare & Send Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DRIVE TAB CONTENT */}
          {activeTab === 'drive' && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Drive Files List */}
              <div className="lg:col-span-7 bg-[#161722] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-blue-400" /> Google Drive File Library
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleQuickExportLeaderboard}
                      disabled={isUploading}
                      className="px-2.5 py-1 bg-lime-500/20 border border-lime-500/40 text-lime-400 hover:bg-lime-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" /> Export Standings to Drive
                    </button>
                    <button
                      onClick={loadDrive}
                      disabled={isLoadingDrive}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Refresh Drive"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDrive ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {driveError && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                    {driveError}
                  </div>
                )}

                {isLoadingDrive ? (
                  <div className="py-12 text-center text-xs text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />
                    Fetching files from Google Drive...
                  </div>
                ) : driveFiles.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-500">
                    No files found in Google Drive. Upload a file or export tournament data below.
                  </div>
                ) : (
                  <div className="mt-3 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 bg-[#1e2030] border border-white/5 rounded-lg flex items-center justify-between gap-3 hover:bg-[#25283b] transition-all"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-white truncate">{file.name}</h4>
                            <p className="text-[10px] text-gray-400 truncate">{file.mimeType}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Open in Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drive File Upload Box */}
              <div className="lg:col-span-5 bg-[#161722] border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-3 border-b border-white/10">
                  <Upload className="w-4 h-4 text-lime-400" /> Save Document to Drive
                </h3>

                {uploadSuccessMsg && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {uploadSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleUploadToDrive} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">File Name</label>
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="e.g. Tournament_Rulebook_2026.txt"
                      required
                      className="w-full bg-[#1e2030] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Text Content</label>
                    <textarea
                      rows={5}
                      value={newFileContent}
                      onChange={(e) => setNewFileContent(e.target.value)}
                      placeholder="Enter rulebook notes, team roster specs, or tournament notes..."
                      required
                      className="w-full bg-[#1e2030] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> {isUploading ? 'Uploading...' : 'Save to Google Drive'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Unauthenticated State */
        <div className="mt-8 py-12 text-center bg-[#161722]/60 border border-dashed border-white/10 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-blue-500/20 text-orange-400 flex items-center justify-center mx-auto mb-3 border border-orange-500/30">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Connect Google Workspace</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 mb-6">
            Sign in with Google to enable sending tournament emails via Gmail and managing tournament rulebooks or exporting leaderboards directly to Google Drive.
          </p>

          <button
            onClick={handleLogin}
            disabled={isLoadingAuth}
            className="px-6 py-3 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all inline-flex items-center gap-2.5 shadow-xl shadow-white/5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {isLoadingAuth ? 'Connecting...' : 'Sign in with Google'}
          </button>
        </div>
      )}

      {/* CONFIRMATION DIALOG: SEND EMAIL */}
      {showSendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181a24] border border-orange-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-orange-400 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-white">Confirm Email Delivery</h3>
            </div>
            <p className="text-xs text-gray-300 mb-4">
              You are about to send an email via your connected Gmail account to:
            </p>
            <div className="bg-[#111218] border border-white/10 rounded-xl p-3 mb-4 space-y-1 text-xs">
              <p><span className="text-gray-400">To:</span> <span className="font-bold text-white">{toEmail}</span></p>
              <p><span className="text-gray-400">Subject:</span> <span className="font-semibold text-gray-200">{emailSubject}</span></p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSendConfirm(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSendEmail}
                disabled={isSendingEmail}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSendingEmail ? 'Sending...' : 'Confirm & Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE DRIVE FILE */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181a24] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-white">Confirm Drive File Deletion</h3>
            </div>
            <p className="text-xs text-gray-300 mb-4">
              Are you sure you want to permanently delete this file from Google Drive?
            </p>
            <div className="bg-[#111218] border border-white/10 rounded-xl p-3 mb-4 text-xs font-bold text-red-300 flex items-center gap-2">
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">{fileToDelete.name}</span>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteFile}
                disabled={isDeletingFile}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeletingFile ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
