import { useState, useRef, useEffect } from "react";

// ─── Config ───────────────────────────────────────────────────────────
const API_URL = "/api/analyze";

const FISH_STATES = {
  idle: "🐟",
  thinking: "🤔",
  safe: "✅",
  fishy: "🐡",
  dangerous: "🚨",
};

// ─── Input Modes ──────────────────────────────────────────────────────
const INPUT_MODES = [
  { id: "paste", label: "Paste", desc: "Paste a message" },
  { id: "email", label: "Email", desc: "Forward an email" },
  { id: "screenshot", label: "Photo", desc: "Upload a photo" },
  { id: "audio", label: "Voice", desc: "Record or upload" },
  { id: "sms", label: "Text", desc: "Copy a text" },
];

// ─── Auto-Account ─────────────────────────────────────────────────────
function getUserId() {
  let id = localStorage.getItem("fishy_uid");
  if (!id) {
    id = "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("fishy_uid", id);
  }
  return id;
}

function getUserName() {
  return localStorage.getItem("fishy_name") || "";
}

function setUserName(name) {
  localStorage.setItem("fishy_name", name);
}

// ─── Live Chat (Coming Soon) ─────────────────────────────────────────

// ─── Styles ───────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes wobble {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-8deg) scale(1.05); }
    75% { transform: rotate(8deg) scale(1.05); }
  }
  @keyframes pop {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes bubbleFloat {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
    50% { transform: translateY(-30px) scale(1.1); opacity: 0.25; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes recording {
    0%, 100% { box-shadow: 0 0 0 0 rgba(220,60,60,0.4); }
    50% { box-shadow: 0 0 0 16px rgba(220,60,60,0); }
  }

  textarea:focus, input:focus { outline: none; border-color: #4A90D9 !important; box-shadow: 0 0 0 4px rgba(74,144,217,0.15) !important; }
  button { -webkit-tap-highlight-color: transparent; }

  @media (max-width: 480px) {
    .fishy-title { font-size: 36px !important; }
    .fishy-subtitle { font-size: 16px !important; }
  }
`;

// ─── AI Analyze ───────────────────────────────────────────────────────
const analyzeMessage = async (content, contentType = "text") => {
  let userMessage;
  if (contentType === "image") {
    userMessage = [
      {
        type: "image",
        source: { type: "base64", media_type: content.mediaType, data: content.data },
      },
      {
        type: "text",
        text: "Please analyze this screenshot I received and tell me if it's a scam or suspicious.",
      },
    ];
  } else {
    userMessage = `Please analyze this message I received and tell me if it's a scam:\n\n"${content}"`;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are "isFishy", a friendly scam detection assistant designed for older adults. Analyze the message or image the user shares and determine if it's a scam, suspicious, or safe.

Respond ONLY in this JSON format with no markdown or backticks:
{
  "verdict": "safe" | "fishy" | "dangerous",
  "confidence": 1-10,
  "title": "A short 3-6 word title summarizing your verdict",
  "explanation": "A warm, clear, jargon-free explanation in 2-3 sentences about why this is or isn't a scam. Speak like a kind, patient friend. Use simple language.",
  "red_flags": ["list", "of", "specific", "red", "flags", "found"],
  "advice": "One clear sentence telling them what to do next."
}`,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await response.json();
  const raw = data.content
    .map((c) => c.text || "")
    .join("")
    .replace(/```json|```/g, "")
    .trim();
  return JSON.parse(raw);
};

// ─── Components ───────────────────────────────────────────────────────

const FishMascot = ({ state, size = 80 }) => (
  <div
    style={{
      fontSize: size,
      lineHeight: 1,
      display: "inline-block",
      animation:
        state === "thinking"
          ? "wobble 0.6s ease-in-out infinite"
          : state === "idle"
          ? "float 3s ease-in-out infinite"
          : "pop 0.4s ease-out",
      filter:
        state === "dangerous"
          ? "drop-shadow(0 0 12px rgba(220, 60, 60, 0.6))"
          : state === "safe"
          ? "drop-shadow(0 0 12px rgba(46, 160, 90, 0.5))"
          : state === "fishy"
          ? "drop-shadow(0 0 12px rgba(230, 160, 30, 0.6))"
          : "none",
      transition: "filter 0.5s ease",
    }}
  >
    {FISH_STATES[state]}
  </div>
);

// ─── Back Button ─────────────────────────────────────────────────────
const BackButton = ({ onClick, label = "Back" }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "8px 14px",
      marginBottom: 12,
      fontFamily: "'Nunito', sans-serif",
      fontSize: 15,
      fontWeight: 700,
      color: "#4A90D9",
      background: "none",
      border: "none",
      cursor: "pointer",
    }}
  >
    ← {label}
  </button>
);

// ─── Input Mode Selector ─────────────────────────────────────────────
const InputModeSelector = ({ mode, setMode }) => (
  <div
    style={{
      display: "flex",
      gap: 6,
      marginBottom: 16,
    }}
  >
    {INPUT_MODES.map((m) => (
      <button
        key={m.id}
        onClick={() => setMode(m.id)}
        style={{
          flex: 1,
          padding: "10px 4px",
          fontFamily: "'Nunito', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: mode === m.id ? "#1A5276" : "#7A9BB5",
          background: mode === m.id ? "white" : "transparent",
          border: mode === m.id ? "2px solid #4A90D9" : "2px solid #D0E4F2",
          borderRadius: 10,
          cursor: "pointer",
          transition: "all 0.15s ease",
          lineHeight: 1.3,
        }}
      >
        {m.label}
      </button>
    ))}
  </div>
);

// ─── Screenshot Upload ───────────────────────────────────────────────
const ScreenshotInput = ({ onImageReady, disabled }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      const mediaType = file.type || "image/png";
      onImageReady({ data: base64, mediaType });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
        disabled={disabled}
      />
      {preview ? (
        <div style={{ marginBottom: 12 }}>
          <img
            src={preview}
            alt="Screenshot preview"
            style={{
              maxWidth: "100%",
              maxHeight: 260,
              borderRadius: 16,
              border: "3px solid #B0D4F1",
            }}
          />
          <button
            onClick={() => {
              setPreview(null);
              onImageReady(null);
            }}
            style={{
              display: "block",
              margin: "8px auto 0",
              padding: "6px 16px",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#D32F2F",
              background: "white",
              border: "2px solid #EF9A9A",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          style={{
            width: "100%",
            minHeight: 160,
            padding: 24,
            fontFamily: "'Nunito', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#5D7D95",
            background: "rgba(255,255,255,0.7)",
            border: "3px dashed #B0D4F1",
            borderRadius: 20,
            cursor: disabled ? "default" : "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 48 }}>📷</span>
          <span>Tap to take a photo or choose from your gallery</span>
          <span style={{ fontSize: 14, color: "#9CB8CE" }}>
            Screenshot a suspicious message, email, or website
          </span>
        </button>
      )}
    </div>
  );
};

// ─── Email Forward Input ─────────────────────────────────────────────
const FORWARD_EMAIL = "check@isfishy.com";

const EmailForwardInput = ({ onPasteFallback, disabled }) => {
  const [tab, setTab] = useState("forward");
  const [copied, setCopied] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(FORWARD_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const sty = { fontFamily: "'Nunito', sans-serif" };

  return (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 12 }}>
        {[
          { id: "forward", label: "Forward it" },
          { id: "paste", label: "Paste it" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "10px",
              ...sty,
              fontSize: 14,
              fontWeight: 700,
              color: tab === t.id ? "#1A5276" : "#7A9BB5",
              background: tab === t.id ? "white" : "transparent",
              border: tab === t.id ? "2px solid #4A90D9" : "2px solid #D0E4F2",
              borderRadius: t.id === "forward" ? "10px 0 0 10px" : "0 10px 10px 0",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "forward" ? (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "2px solid #D0E4F2",
            padding: 20,
          }}
        >
          <p style={{ ...sty, fontSize: 16, fontWeight: 700, color: "#1A5276", margin: "0 0 12px", textAlign: "center" }}>
            Forward the suspicious email to:
          </p>
          <div
            onClick={copyEmail}
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              ...sty,
              fontSize: 20,
              fontWeight: 800,
              color: "#4A90D9",
              background: "#F8FBFF",
              borderRadius: 10,
              cursor: "pointer",
              border: "1px dashed #B0D4F1",
              textAlign: "center",
              wordBreak: "break-all",
              userSelect: "all",
            }}
          >
            {FORWARD_EMAIL}
          </div>
          <p style={{ ...sty, fontSize: 13, fontWeight: 600, color: copied ? "#2E7D32" : "#9CB8CE", textAlign: "center", margin: "8px 0 0" }}>
            {copied ? "Copied!" : "Tap to copy"}
          </p>

          <div style={{ marginTop: 16, padding: "12px", background: "#F8FBFF", borderRadius: 10 }}>
            <p style={{ ...sty, fontSize: 14, color: "#5D7D95", margin: "2px 0", lineHeight: 1.6 }}>
              1. Open the suspicious email
            </p>
            <p style={{ ...sty, fontSize: 14, color: "#5D7D95", margin: "2px 0", lineHeight: 1.6 }}>
              2. Tap <strong>Forward</strong>
            </p>
            <p style={{ ...sty, fontSize: 14, color: "#5D7D95", margin: "2px 0", lineHeight: 1.6 }}>
              3. Paste the address above in the "To" field
            </p>
            <p style={{ ...sty, fontSize: 14, color: "#5D7D95", margin: "2px 0", lineHeight: 1.6 }}>
              4. Send — you'll get a reply with results
            </p>
          </div>

          <p style={{ ...sty, fontSize: 13, fontWeight: 600, color: "#9CB8CE", textAlign: "center", margin: "14px 0 0" }}>
            Your reply email will include a link to view all your results on the dashboard.
          </p>
        </div>
      ) : (
        <div>
          <textarea
            value={pasteText}
            onChange={(e) => {
              setPasteText(e.target.value);
              onPasteFallback(e.target.value);
            }}
            placeholder={"From: someone@example.com\nSubject: You've won!\n\nPaste the full email here..."}
            disabled={disabled}
            style={{
              width: "100%",
              minHeight: 180,
              padding: 16,
              ...sty,
              fontSize: 17,
              lineHeight: 1.6,
              border: "3px solid #B0D4F1",
              borderRadius: 16,
              background: "white",
              color: "#333",
              resize: "vertical",
            }}
          />
        </div>
      )}
    </div>
  );
};

// ─── Audio Input ─────────────────────────────────────────────────────
const AudioInput = ({ onTranscript, disabled }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState("");
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      setRecording(true);
    } catch {
      alert("Could not access your microphone. Please check your settings.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 16,
          color: "#5D7D95",
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        Record yourself reading the suspicious message aloud, or describe what happened.
        Then type or paste what you said below.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16 }}>
        {!recording ? (
          <button
            onClick={startRecording}
            disabled={disabled}
            style={{
              padding: "14px 28px",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "white",
              background: "#EF5350",
              border: "none",
              borderRadius: 14,
              cursor: disabled ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>🎙️</span> Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              padding: "14px 28px",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "white",
              background: "#333",
              border: "none",
              borderRadius: 14,
              cursor: "pointer",
              animation: "recording 1.5s ease-in-out infinite",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>⏹️</span> Stop Recording
          </button>
        )}
      </div>

      {audioUrl && (
        <audio controls src={audioUrl} style={{ width: "100%", marginBottom: 12 }} />
      )}

      <textarea
        value={transcript}
        onChange={(e) => {
          setTranscript(e.target.value);
          onTranscript(e.target.value);
        }}
        placeholder="Type or paste what the suspicious message said here..."
        disabled={disabled}
        style={{
          width: "100%",
          minHeight: 120,
          padding: 16,
          fontFamily: "'Nunito', sans-serif",
          fontSize: 17,
          lineHeight: 1.6,
          border: "3px solid #B0D4F1",
          borderRadius: 16,
          background: "white",
          color: "#333",
          resize: "vertical",
        }}
      />
    </div>
  );
};

// ─── Ask a Young Person (Coming Soon) ────────────────────────────────
const AskYoungPerson = ({ directMode = false }) => {
  if (!directMode) {
    return (
      <div
        style={{
          display: "block",
          width: "100%",
          marginTop: 12,
          padding: "16px",
          fontFamily: "'Nunito', sans-serif",
          fontSize: 17,
          fontWeight: 700,
          color: "#999",
          background: "#F8F8F8",
          border: "2px solid #E0E0E0",
          borderRadius: 14,
          textAlign: "center",
        }}
      >
        Live Chat — Coming Soon
        <span
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "#BBB",
            marginTop: 2,
          }}
        >
          Chat live with a real person for extra help
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FAFAFA",
        border: "2px solid #E0E0E0",
        borderRadius: 20,
        padding: 24,
        textAlign: "center",
        animation: "slideUp 0.4s ease-out",
      }}
    >
      <h3
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 20,
          fontWeight: 800,
          color: "#1A5276",
          margin: "0 0 8px",
        }}
      >
        Live Chat — Coming Soon
      </h3>
      <p
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 16,
          color: "#5D7D95",
          lineHeight: 1.6,
          margin: "0 0 16px",
        }}
      >
        Soon you'll be able to connect directly with a friendly, tech-savvy
        young person who can help you figure out if something is a scam.
      </p>
      <div
        style={{
          padding: "14px 40px",
          fontFamily: "'Nunito', sans-serif",
          fontSize: 17,
          fontWeight: 800,
          color: "#999",
          background: "#E8E8E8",
          border: "none",
          borderRadius: 14,
          display: "inline-block",
        }}
      >
        Coming Soon
      </div>
    </div>
  );
};

// ─── Verdict Card ────────────────────────────────────────────────────
const VerdictCard = ({ result, onReset, originalContent }) => {
  const colors = {
    safe: { bg: "#E8F5E9", border: "#66BB6A", accent: "#2E7D32", badge: "#C8E6C9" },
    fishy: { bg: "#FFF8E1", border: "#FFA726", accent: "#E65100", badge: "#FFE0B2" },
    dangerous: { bg: "#FFEBEE", border: "#EF5350", accent: "#C62828", badge: "#FFCDD2" },
  };
  const c = colors[result.verdict];
  const labels = {
    safe: "Looks Safe!",
    fishy: "Something's Fishy...",
    dangerous: "This is a Scam!",
  };

  return (
    <div>
      <BackButton onClick={onReset} label="Check another message" />
      <div
        style={{
          animation: "slideUp 0.5s ease-out",
          background: c.bg,
          border: `3px solid ${c.border}`,
          borderRadius: 24,
          padding: "32px 24px",
          maxWidth: 540,
          width: "100%",
          margin: "0 auto",
        }}
      >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <FishMascot state={result.verdict} size={64} />
        <h2
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: c.accent,
            margin: "8px 0 4px",
          }}
        >
          {labels[result.verdict]}
        </h2>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            color: "#666",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {result.title}
        </p>
      </div>

      <p
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 19,
          lineHeight: 1.6,
          color: "#333",
          margin: "0 0 20px",
        }}
      >
        {result.explanation}
      </p>

      {result.red_flags?.length > 0 && (
        <div
          style={{
            background: c.badge,
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: c.accent,
              margin: "0 0 8px",
            }}
          >
            🚩 Red Flags Found:
          </p>
          {result.red_flags.map((flag, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 17,
                color: "#444",
                margin: "6px 0",
                paddingLeft: 8,
              }}
            >
              • {flag}
            </p>
          ))}
        </div>
      )}

      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: "16px 20px",
          border: `2px solid ${c.border}44`,
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: c.accent,
            margin: "0 0 4px",
          }}
        >
          💡 What to do:
        </p>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 17,
            color: "#444",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {result.advice}
        </p>
      </div>

      <AskYoungPerson />
      </div>
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────
export default function FishyApp() {
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState(null);
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState("paste");
  const [originalContent, setOriginalContent] = useState(null);
  const [askHumanDirect, setAskHumanDirect] = useState(false);
  const textareaRef = useRef(null);
  const userId = useRef(getUserId());

  useEffect(() => {
    if (state === "idle" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [state, inputMode]);

  const handleAnalyze = async () => {
    let content, contentType;

    if (inputMode === "screenshot" && imageData) {
      content = imageData;
      contentType = "image";
    } else if (text.trim()) {
      content = text.trim();
      contentType = "text";
    } else {
      return;
    }

    setOriginalContent(content);
    setState("thinking");
    setError("");
    setResult(null);

    try {
      const res = await analyzeMessage(content, contentType);
      setResult(res);
      setState(res.verdict);

      fetch("/api/log-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.current,
          inputType: contentType === "image" ? "screenshot" : inputMode,
          content: contentType === "image" ? "(screenshot)" : content,
          verdict: res.verdict,
          confidence: res.confidence,
          title: res.title,
          redFlags: res.red_flags,
          advice: res.advice,
          explanation: res.explanation,
        }),
      }).catch(() => {});
    } catch {
      setError("Oops! Something went wrong. Please try again.");
      setState("idle");
    }
  };

  const handleReset = () => {
    setText("");
    setImageData(null);
    setResult(null);
    setState("idle");
    setError("");
    setOriginalContent(null);
    setAskHumanDirect(false);
  };

  const canAnalyze =
    inputMode === "screenshot" ? !!imageData : !!text.trim();

  const exampleScams = [
    {
      label: "Fake bank text",
      text: 'URGENT: Your Chase account has been locked due to suspicious activity. Click here to verify your identity immediately: http://chase-secure-login.xyz/verify',
    },
    {
      label: "Prize scam",
      text: "Congratulations! You've been selected as a winner of $1,000,000 in the International Lottery. To claim your prize, send your full name, address, and bank details to claims@intl-lottery-winner.com",
    },
    {
      label: "Grandparent scam",
      text: "Hi grandma, it's me. I'm in trouble and I need you to send $2000 through Western Union right away. Please don't tell mom and dad. I'll explain everything later.",
    },
  ];

  const placeholders = {
    paste: "Paste the text message, email, or voicemail transcript here...",
    email: "",
    sms: "Copy and paste the text message here — include the phone number if you can...",
    audio: "",
    screenshot: "",
  };

  const showTextarea = ["paste", "sms"].includes(inputMode);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #E3F2FD 0%, #F0F7FF 40%, #FFFEF5 100%)",
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{GLOBAL_STYLES}</style>

      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            width: [80, 50, 120, 40, 90, 60][i],
            height: [80, 50, 120, 40, 90, 60][i],
            borderRadius: "50%",
            background: ["#90CAF9", "#81D4FA", "#80DEEA", "#A5D6A7", "#CE93D8", "#FFCC80"][i],
            opacity: 0.12,
            top: ["10%", "30%", "60%", "80%", "20%", "70%"][i],
            left: ["5%", "85%", "90%", "15%", "75%", "40%"][i],
            animation: `bubbleFloat ${3 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "40px 20px 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <FishMascot state={state} size={state === "idle" ? 72 : 56} />
          <h1
            className="fishy-title"
            style={{
              fontFamily: "'Baloo 2', 'Nunito', sans-serif",
              fontSize: 48,
              fontWeight: 800,
              color: "#1A5276",
              margin: "4px 0 0",
              letterSpacing: "-1px",
            }}
          >
            fishy
          </h1>
          <p
            className="fishy-subtitle"
            style={{
              fontSize: 19,
              color: "#5D7D95",
              fontWeight: 600,
              margin: "4px 0 0",
              lineHeight: 1.4,
            }}
          >
            Share a suspicious message, email, screenshot, or recording.
            <br />
            I'll tell you if something's fishy!
          </p>
        </div>

        {askHumanDirect ? (
          <div style={{ animation: "slideUp 0.4s ease-out" }}>
            <BackButton onClick={handleReset} label="Back" />
            <AskYoungPerson directMode={true} />
          </div>
        ) : !result ? (
          <div style={{ animation: state === "idle" ? "slideUp 0.4s ease-out" : "none" }}>
            <InputModeSelector mode={inputMode} setMode={setInputMode} />

            {showTextarea && (
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholders[inputMode]}
                disabled={state === "thinking"}
                style={{
                  width: "100%",
                  minHeight: 180,
                  padding: 20,
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 18,
                  lineHeight: 1.6,
                  border: "3px solid #B0D4F1",
                  borderRadius: 20,
                  background: "white",
                  color: "#333",
                  resize: "vertical",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  opacity: state === "thinking" ? 0.6 : 1,
                }}
              />
            )}

            {inputMode === "email" && (
              <EmailForwardInput
                onPasteFallback={(t) => setText(t)}
                disabled={state === "thinking"}
              />
            )}

            {inputMode === "screenshot" && (
              <ScreenshotInput
                onImageReady={setImageData}
                disabled={state === "thinking"}
              />
            )}

            {inputMode === "audio" && (
              <AudioInput
                onTranscript={(t) => setText(t)}
                disabled={state === "thinking"}
              />
            )}

            {error && (
              <p
                style={{
                  color: "#D32F2F",
                  fontSize: 16,
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "12px 0 0",
                }}
              >
                {error}
              </p>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || state === "thinking"}
              style={{
                display: "block",
                width: "100%",
                marginTop: 16,
                padding: "18px 32px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: 21,
                fontWeight: 800,
                color: "white",
                background:
                  !canAnalyze || state === "thinking"
                    ? "#B0C4D8"
                    : "#4A90D9",
                border: "none",
                borderRadius: 16,
                cursor: !canAnalyze || state === "thinking" ? "default" : "pointer",
                transition: "all 0.25s ease",
                boxShadow:
                  canAnalyze && state !== "thinking"
                    ? "0 4px 16px rgba(74,144,217,0.35)"
                    : "none",
              }}
            >
              {state === "thinking" ? "🔍 Analyzing..." : "🐟 Is This Fishy?"}
            </button>

            {state === "idle" && !text && !imageData && inputMode === "paste" && (
              <div style={{ marginTop: 32 }}>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#8EAFC1",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    margin: "0 0 12px",
                  }}
                >
                  Try an example
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {exampleScams.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setText(ex.text)}
                      style={{
                        padding: "14px 18px",
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#4A7A9B",
                        background: "transparent",
                        border: "1px solid #D0E4F2",
                        borderRadius: 14,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <VerdictCard
            result={result}
            onReset={handleReset}
            originalContent={originalContent}
          />
        )}

        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          {!askHumanDirect && !result && (
            <div
              style={{
                display: "block",
                width: "100%",
                padding: "16px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: 17,
                fontWeight: 700,
                color: "#999",
                background: "#F8F8F8",
                border: "2px solid #E0E0E0",
                borderRadius: 14,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Live Chat — Coming Soon
              <span
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#BBB",
                  marginTop: 2,
                }}
              >
                Chat live with a real person for extra help
              </span>
            </div>
          )}

          <p
            style={{
              fontSize: 14,
              color: "#9CB8CE",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            isFishy uses AI to help spot scams. When in doubt,
            <br />
            always check with someone you trust.
          </p>
        </div>

        <InstallPrompt />
      </div>
    </div>
  );
}

// ─── PWA Install Prompt ──────────────────────────────────────────────
function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone;

  if (isStandalone) return null;

  if (isIOS) {
    return (
      <div
        style={{
          marginTop: 20,
          padding: "16px 20px",
          background: "rgba(255,255,255,0.8)",
          borderRadius: 16,
          border: "2px solid #D0E4F2",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#4A7A9B",
            margin: "0 0 4px",
          }}
        >
          📱 Add isFishy to your Home Screen
        </p>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14,
            color: "#7A9BB5",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Tap the <strong>Share</strong> button, then tap{" "}
          <strong>"Add to Home Screen"</strong>
        </p>
      </div>
    );
  }

  if (!showInstall) return null;

  return (
    <button
      onClick={handleInstall}
      style={{
        display: "block",
        width: "100%",
        marginTop: 20,
        padding: "16px",
        fontFamily: "'Nunito', sans-serif",
        fontSize: 17,
        fontWeight: 800,
        color: "#4A90D9",
        background: "rgba(255,255,255,0.8)",
        border: "2px solid #4A90D9",
        borderRadius: 16,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      📱 Install isFishy on Your Device
    </button>
  );
}
