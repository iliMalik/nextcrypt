import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { get_screening } from "@/data/data_sceening"; // Adjust import

interface ScreeningResult {
  flag: boolean;
  core_matched: number[];
  others_matched: number[];
  severity: number;
  matched_count: number;
  total_required: number;
  note?: string;
}

interface ScreeningResponse {
  status: string;
  session_id: string;
  results: Record<string, ScreeningResult>;
}

interface ScreeningDialogProps {
  visible: boolean;
  sessionId: string;
  onHide: () => void;
}

// Map disorder codes to full names
const disorderFullNames: Record<string, string> = {
  MDD: "Major Depressive Disorder (MDD)",
  GAD: "Generalized Anxiety Disorder (GAD)",
  Panic: "Panic Disorder",
  Bipolar: "Bipolar Disorder",
  // Add more as needed
};

const ScreeningDialog: React.FC<ScreeningDialogProps> = ({
  visible,
  sessionId,
  onHide,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screeningData, setScreeningData] = useState<ScreeningResponse | null>(
    null
  );

  useEffect(() => {
    if (visible && sessionId) {
      const fetchScreeningResults = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await get_screening(sessionId);
          setScreeningData(data);
        } catch (err) {
          setError("Failed to fetch screening results. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchScreeningResults();
    }
  }, [visible, sessionId]);

  const matchedQuestionsText = (result: ScreeningResult) => {
    const allMatched = [...result.core_matched, ...result.others_matched];
    return allMatched.length === 0
      ? "None"
      : allMatched.map((id) => `Q${id}`).join(", ");
  };

  return (
    <Dialog
      header={`Screening Results for Session ${sessionId}`}
      visible={visible}
      onHide={onHide}
      style={{ width: "95vw", maxWidth: "1000px", height: "80vh" }}
      className="p-4"
      modal
      blockScroll
    >
      {loading && <div className="text-center p-4">Loading...</div>}
      {error && <div className="text-red-600 p-4">{error}</div>}
      {!loading && !error && screeningData && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            maxHeight: "calc(80vh - 80px)",
            overflowY: "auto",
          }}
        >
          {Object.entries(screeningData.results).map(([code, result]) => {
            const name = disorderFullNames[code] || code;
            return (
              <div
                key={code}
                style={{
                  flex: "1 1 300px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  backgroundColor: result.flag ? "#ffd6e8" : "#fff", // Pink if flagged, else white
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: "8px" }}>{name}</h3>
                <p>
                  <strong>Flagged: </strong>
                  <span
                    style={{
                      color: result.flag ? "darkred" : "gray",
                      fontWeight: "600",
                    }}
                  >
                    {result.flag ? "Yes" : "No"}
                  </span>
                </p>
                <p style={{ marginBottom: "4px" }}>
                  <strong>Severity: </strong> {result.severity}%
                </p>
                {/* Progress bar */}
                <div
                  style={{
                    height: "12px",
                    width: "100%",
                    backgroundColor: "#eee",
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${result.severity}%`,
                      backgroundColor:
                        result.severity > 50 ? "#d9534f" : "#5cb85c",
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </div>
                <p>
                  <strong>Matched Questions: </strong>
                  {matchedQuestionsText(result)}
                </p>
                {result.note && (
                  <p style={{ color: "darkred", fontWeight: "600" }}>
                    <strong>Note: </strong>
                    {result.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Dialog>
  );
};

export default ScreeningDialog;
