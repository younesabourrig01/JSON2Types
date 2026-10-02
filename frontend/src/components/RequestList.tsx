import type { CapturedRequest } from "../types/api";

interface RequestListProps {
  requests: CapturedRequest[];
  totalRequests: number;
  selectedRequestId?: string;
  isLoading: boolean;
  onSelect: (request: CapturedRequest) => void;
  onRefresh: () => void;
}

export default function RequestList({
  requests,
  totalRequests,
  selectedRequestId,
  isLoading,
  onSelect,
  onRefresh,
}: RequestListProps) {
  return (
    <section className="panel request-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Inbox</span>
          <h2>Requests <span className="count">{totalRequests}</span></h2>
        </div>
        <button
          className="icon-button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh requests"
          title="Refresh requests"
        >
          ↻
        </button>
      </div>
      <div className="request-list">
        {requests.length === 0 ? (
          <div className="empty-note">
            <span className="empty-icon">⌁</span>
            <strong>Waiting for a request</strong>
            <p>Send a webhook to the endpoint above. New requests appear here automatically.</p>
          </div>
        ) : (
          requests.map((request) => (
            <button
              className={"request-row" + (selectedRequestId === request.requestId ? " selected" : "")}
              key={request.requestId}
              onClick={() => onSelect(request)}
            >
              <span className={"method method-" + request.method.toLowerCase()}>
                {request.method}
              </span>
              <span className="request-meta">
                <strong>{formatTime(request.timestamp)}</strong>
                <small>{request.ip}</small>
              </span>
              <span className="row-chevron">›</span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
