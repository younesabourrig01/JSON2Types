import type { CapturedRequest } from "../types/api";

export default function RequestDetail({
  request,
}: {
  request?: CapturedRequest;
}) {
  if (!request) {
    return (
      <section className="panel detail-panel">
        <div className="panel-heading">
          <div><span className="eyebrow">Request</span><h2>Details</h2></div>
        </div>
        <div className="empty-note">Select a request to inspect its payload.</div>
      </section>
    );
  }

  return (
    <section className="panel detail-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Request details</span>
          <h2><span className={"method method-" + request.method.toLowerCase()}>{request.method}</span> Payload</h2>
        </div>
        <time>{new Date(request.timestamp).toLocaleString()}</time>
      </div>
      <DataBlock title="Body" value={request.body} />
      <DataBlock title="Query parameters" value={request.queryParams} />
      <DataBlock title="Headers" value={request.headers} />
    </section>
  );
}

function DataBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="data-block">
      <h3>{title}</h3>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}
