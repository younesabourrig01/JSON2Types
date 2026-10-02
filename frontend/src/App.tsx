import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import RequestDetail from "./components/RequestDetail";
import RequestList from "./components/RequestList";
import TsTypeViewer from "./components/TsTypeViewer";
import {
  useCreateBinMutation,
  useDeleteBinMutation,
  useGetBinRequestsQuery,
} from "./services/webhookApi";
import type { CapturedRequest } from "./types/api";

function App() {
  const [binId, setBinId] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<CapturedRequest>();
  const [createBin, createState] = useCreateBinMutation();
  const [deleteBin, deleteState] = useDeleteBinMutation();
  const binQuery = useGetBinRequestsQuery(binId, {
    skip: !binId,
    pollingInterval: 4000,
  });

  useEffect(() => {
    const requests = binQuery.data?.requests ?? [];
    setSelectedRequest((current) =>
      requests.find((request) => request.requestId === current?.requestId) ??
      requests[0],
    );
  }, [binQuery.data]);

  const handleCreate = async () => {
    try {
      const result = await createBin().unwrap();
      setBinId(result.binId);
      setEndpointUrl(result.endpointUrl);
    } catch {
      // The mutation error is displayed below.
    }
  };

  const handleDelete = async () => {
    if (!binId || !window.confirm("Delete this bin and all captured requests?")) {
      return;
    }
    try {
      await deleteBin(binId).unwrap();
      setBinId("");
      setEndpointUrl("");
      setSelectedRequest(undefined);
    } catch {
      // The mutation error is displayed below.
    }
  };

  const error = createState.error ?? deleteState.error ?? binQuery.error;

  return (
    <div className="app-shell">
      <Header
        binId={binId}
        endpointUrl={endpointUrl}
        isCreating={createState.isLoading}
        isDeleting={deleteState.isLoading}
        onCreate={() => void handleCreate()}
        onDelete={() => void handleDelete()}
      />
      <main className="workspace">
        {!binId ? (
          <section className="welcome">
            <span className="eyebrow">Webhook inspector</span>
            <h1>See what your integrations are sending.</h1>
            <p>
              Create a temporary endpoint, send it a webhook, and turn its JSON
              payload into TypeScript types.
            </p>
            <button
              className="button button-primary"
              onClick={() => void handleCreate()}
              disabled={createState.isLoading}
            >
              {createState.isLoading ? "Creating endpoint…" : "Create endpoint"}
            </button>
          </section>
        ) : (
          <div className="dashboard">
            <RequestList
              requests={binQuery.data?.requests ?? []}
              totalRequests={binQuery.data?.totalRequests ?? 0}
              selectedRequestId={selectedRequest?.requestId}
              isLoading={binQuery.isFetching}
              onSelect={setSelectedRequest}
              onRefresh={() => void binQuery.refetch()}
            />
            <RequestDetail request={selectedRequest} />
            <TsTypeViewer
              binId={binId}
              requestId={selectedRequest?.requestId}
            />
          </div>
        )}
        {error && (
          <p className="error-banner" role="alert">
            The API request failed. Check that the backend is running and try
            again.
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
