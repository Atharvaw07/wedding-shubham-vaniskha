'use client';

export default function RsvpModal({ open, type, onClose }) {
  const success = type === 'success';

  return (
    <div
      id="rsvp-modal"
      className={open ? 'open' : ''}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div className="modal-card">
        <div
          className="modal-icon-ring"
          id="modal-icon"
          style={{ background: success ? 'rgba(184,89,64,0.1)' : 'rgba(220,38,38,0.08)' }}
        >
          <svg
            id="modal-success-svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ display: success ? '' : 'none' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <svg
            id="modal-error-svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ display: success ? 'none' : '', color: '#dc2626' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="modal-title" id="modal-title">
          {success ? 'Thank You!' : 'Oops!'}
        </h3>
        <p className="modal-msg" id="modal-msg">
          {success ? "We can't wait to celebrate with you!" : 'Error submitting RSVP. Please try again.'}
        </p>
        <button type="button" className="modal-close-btn" id="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
