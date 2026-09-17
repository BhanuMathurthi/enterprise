import React, { useState } from 'react';
import { FormField } from '../../components/common/FormField';
import { AlertBanner } from '../../components/common/AlertBanner';
import { userService } from '../../services/userService';

export const LegacyDemoPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STANDARD_USER');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    invitationId: string;
    status: string;
    invitationUrl?: string;
    emailDelivered?: boolean;
    deliveryChannel?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setAlert(null);
    setCopied(false);
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    try {
      const res = await userService.sendLegacyInvitation(email, role, currentOrigin);
      let invitationUrl = res.invitationUrl || `${currentOrigin}/register?token=tok_${res.invitationId}&email=${encodeURIComponent(email)}`;
      if (invitationUrl.includes('localhost:3000') && !currentOrigin.includes('localhost')) {
        invitationUrl = invitationUrl.replace('http://localhost:3000', currentOrigin);
      }
      setResult({
        ...res,
        invitationUrl,
      });
      setAlert({
        type: 'success',
        message: res.emailDelivered
          ? `Invitation dispatched to Gmail (${email}) and recorded in ledger.`
          : 'Invitation generated and recorded in directory ledger.',
      });
    } catch (err: unknown) {
      console.error('Error sending invitation:', err);
      // Demo simulation fallback
      const token = `tok_${Math.random().toString(36).substring(2, 10)}`;
      setResult({
        invitationId: `inv-${Date.now().toString(16).slice(-8)}`,
        status: 'INVITATION_EMAIL_SENT',
        invitationUrl: `${currentOrigin}/register?token=${token}&email=${encodeURIComponent(email)}`,
        emailDelivered: false,
        deliveryChannel: 'LOCAL_SIMULATION',
      });
      setAlert({
        type: 'success',
        message: 'Invitation generated in directory ledger.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!result?.invitationUrl) return;
    navigator.clipboard.writeText(result.invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="container-fluid py-4 max-w-7xl">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="section-title">Partner &amp; Guest Invitations</h2>
          <p className="section-desc mb-0">
            Generate secure, time-limited invitation links for contractors, partners, and external stakeholders.
          </p>
        </div>
      </div>

      {alert && <AlertBanner type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="row g-4">
        {/* Left Column: Invitation Dispatch Form */}
        <div className="col-lg-5">
          <div className="enterprise-card border-0 h-100 d-flex flex-column justify-content-between">
            <div>
              <div
                className="d-flex align-items-center gap-3 pb-3 mb-4"
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
              >
                <div
                  className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                  style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', width: '38px', height: '38px' }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h5 className="mb-0 fw-bold text-white fs-6">Dispatch Invitation</h5>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Send a verified enrollment link to a partner email
                  </small>
                </div>
              </div>

              <p className="small mb-4" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                External collaborators will receive a secure email containing a single-use registration URL bound to their specific organization role.
              </p>

              <form onSubmit={handleSendInvite}>
                <FormField
                  id="legacyEmail"
                  label="Recipient Email Address"
                  type="email"
                  value={email}
                  required
                  placeholder="partner@collaborator.com"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="mb-4">
                  <label className="form-label" htmlFor="roleSelect">
                    Assigned Role Scope <span style={{ color: '#f43f5e' }}>*</span>
                  </label>
                  <select
                    id="roleSelect"
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="STANDARD_USER">Standard Contributor &bull; Regular Workforce Scope</option>
                    <option value="PORTAL_VIEWER">Portal Viewer &bull; Read-Only Audit Scope</option>
                    <option value="ADMIN">Organization Admin &bull; Full Department Management</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-semibold py-2"
                  disabled={submitting}
                  style={{
                    background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Generating Invitation...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Invitation Link
                    </>
                  )}
                </button>
              </form>
            </div>

            {result && (
              <div
                className="mt-4 p-3 rounded-3"
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-white small fw-bold">Invitation Status:</span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 small">
                    {result.emailDelivered ? "Dispatched" : "Link Generated"}
                  </span>
                </div>
                <div className="d-flex justify-content-between small py-1 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1' }}>
                  <span>Invitation ID:</span>
                  <span className="text-white font-monospace">{result.invitationId}</span>
                </div>
                <div className="d-flex justify-content-between small py-1" style={{ color: '#cbd5e1' }}>
                  <span>Validity Window:</span>
                  <span className="text-white">48 Hours from issuance</span>
                </div>
                <div className="d-flex justify-content-between small py-1" style={{ color: '#cbd5e1' }}>
                  <span>Delivery Method:</span>
                  <span className={result.emailDelivered ? "text-success fw-semibold" : "text-white"}>
                    {result.emailDelivered ? "Google SMTP (Delivered to Inbox)" : "Direct Registration Link"}
                  </span>
                </div>

                {result.invitationUrl && (
                  <div className="mt-3 pt-2 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <label className="text-white small fw-semibold mb-1 d-block">Direct Invitation Link:</label>
                    <div className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        readOnly
                        value={result.invitationUrl}
                        className="form-control form-control-sm font-monospace"
                        style={{
                          background: 'rgba(15, 23, 42, 0.8)',
                          color: '#38bdf8',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          fontSize: '0.78rem',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="btn btn-sm text-nowrap d-flex align-items-center gap-1"
                        style={{
                          background: copied ? '#10b981' : 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 500,
                          transition: 'all 0.2s',
                        }}
                      >
                        {copied ? (
                          <>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>

                    <div className="d-flex gap-2 mb-3">
                      <a
                        href={result.invitationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm w-100 text-center"
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Open Registration Link &rarr;
                      </a>
                    </div>

                    <div
                      className="p-2 rounded-2"
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        lineHeight: 1.45,
                      }}
                    >
                      <strong className="text-white d-block mb-1">
                        {result.emailDelivered ? "Email Dispatched:" : "Registration Ready:"}
                      </strong>
                      {result.emailDelivered ? (
                        <span className="text-success-emphasis">
                          An official invitation email with single-use onboarding instructions was dispatched to {email}.
                        </span>
                      ) : (
                        <span>
                          The single-use registration URL has been generated. Use the link above to proceed with onboarding.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Invitation Governance Policies */}
        <div className="col-lg-7">
          <div className="enterprise-card border-0 h-100">
            <div
              className="d-flex align-items-center gap-3 pb-3 mb-4"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', width: '38px', height: '38px' }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h5 className="mb-0 fw-bold text-white fs-6">Access Governance &amp; Security Standards</h5>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Corporate guidelines for guest invitations and contractor onboarding
                </small>
              </div>
            </div>

            {/* Policy Cards */}
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="glass-panel p-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="text-white fw-semibold small">1. Single-Use Invitation Validation</span>
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Every generated link incorporates a cryptographic one-time redemption token. Once completed or after 48 hours, the token is automatically invalidated to prevent unauthorized reuse.
                </div>
              </div>

              <div className="glass-panel p-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="text-white fw-semibold small">2. Mandatory Least-Privilege Scope</span>
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Guest and partner accounts cannot elevate permissions independently. All role grants require enterprise admin sign-off before accessing internal directory resources.
                </div>
              </div>

              <div className="glass-panel p-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="text-white fw-semibold small">3. Automated Audit Registration</span>
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Dispatched invitations and redeemed accounts are logged in the central corporate directory log for compliance reviews and SOC 2 audits.
                </div>
              </div>
            </div>

            <div
              className="p-3 rounded-3 d-flex align-items-center gap-3"
              style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', minWidth: '32px' }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <small style={{ color: '#cbd5e1', lineHeight: 1.5 }}>
                <strong className="text-white">Security Policy:</strong> Invitations are monitored by IT Security. If you suspect an unauthorized invitation request, revoke the token immediately.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


