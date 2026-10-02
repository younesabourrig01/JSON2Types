import { useState } from "react";

interface HeaderProps {
  binId: string;
  endpointUrl: string;
  isCreating: boolean;
  isDeleting: boolean;
  onCreate: () => void;
  onDelete: () => void;
}

export default function Header({
  binId,
  endpointUrl,
  isCreating,
  isDeleting,
  onCreate,
  onDelete,
}: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyEndpoint = async () => {
    if (!endpointUrl || !navigator.clipboard) return;
    await navigator.clipboard.writeText(endpointUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="topbar">
      <div className="brand" aria-label="JSON2Types">
        <span className="brand-icon">{"{}"}</span>
        <span>JSON<span className="brand-accent">2</span>Types</span>
      </div>
      {binId ? (
        <div className="endpoint-controls">
          <span className="status-dot" aria-label="Endpoint active" />
          <code className="endpoint-url">{endpointUrl}</code>
          <button className="button button-secondary" onClick={() => void copyEndpoint()}>
            {copied ? "Copied" : "Copy URL"}
          </button>
          <button
            className="button button-danger"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      ) : (
        <button
          className="button button-primary"
          onClick={onCreate}
          disabled={isCreating}
        >
          {isCreating ? "Creating…" : "New endpoint"}
        </button>
      )}
    </header>
  );
}
