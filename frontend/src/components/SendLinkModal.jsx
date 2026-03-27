import { useState, useEffect } from "react";
import { X, Send, Mail, User, Search, Loader2 } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function SendLinkModal({ isOpen, onClose, session }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(null); // Track which candidate we are sending to
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCandidates();
    }
  }, [isOpen]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sessions/candidates");
      setCandidates(res.data);
    } catch (err) {
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (candidate) => {
    setSending(candidate._id);
    try {
      const interviewLink = `${window.location.origin}/interview/${session.shareableToken}`;
      
      // Add a 25-second timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      
      await api.post("/sessions/send-link", {
        email: candidate.email,
        candidateName: candidate.name,
        jobTitle: session.jobTitle,
        interviewLink
      }, { signal: controller.signal });
      
      clearTimeout(timeoutId);
      toast.success(`Invite sent to ${candidate.name}!`);
    } catch (err) {
      if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
        toast.error("Request timed out. Please check email settings and try again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to send email");
      }
    } finally {
      setSending(null);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)",
      padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card"
        style={{ width: "100%", maxWidth: 600, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Invite Candidates</h2>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Sharing link for: {session?.jobTitle}</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 14, top: 13, color: "var(--text-muted)" }} />
            <input 
              className="input-field" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", paddingLeft: 42 }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div className="spinner" style={{ margin: "0 auto" }} />
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              No candidates found.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredCandidates.map(c => (
                <div key={c._id} style={{ 
                  display: "flex", alignItems: "center", justifyContent: "space-between", 
                  padding: "12px 16px", background: "rgba(15, 15, 30, 0.4)", 
                  border: "1px solid var(--border-color)", borderRadius: 12 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={20} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                        <Mail size={12} /> {c.email}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSend(c)} 
                    disabled={sending === c._id}
                    className="btn btn-primary btn-sm"
                    style={{ minWidth: 100 }}
                  >
                    {sending === c._id ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} /> Invite</>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
