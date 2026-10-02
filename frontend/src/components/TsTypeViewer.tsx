import { useState } from "react";
import { useGetRequestTsTypesQuery } from "../services/webhookApi";

export default function TsTypeViewer({
  binId,
  requestId,
}: {
  binId: string;
  requestId?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { data, isFetching, error } = useGetRequestTsTypesQuery(
    { binId, requestId: requestId ?? "" },
    { skip: !requestId },
  );

  const copyTypes = async () => {
    if (!data || !navigator.clipboard) return;
    await navigator.clipboard.writeText(data);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="panel types-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">Generated output</span><h2>TypeScript types</h2></div>
        {data && (
          <button className="button button-secondary" onClick={() => void copyTypes()}>
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {!requestId ? (
        <div className="empty-note">Select a request to generate types from its body.</div>
      ) : isFetching ? (
        <div className="empty-note">Generating types…</div>
      ) : error ? (
        <div className="empty-note error-text">Could not generate types for this request.</div>
      ) : (
        <pre className="types-code"><code>{data}</code></pre>
      )}
    </section>
  );
}
