"use client"

import { useEffect, useRef } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { useState } from "react"

interface CodePreviewProps {
  code: string
  codeType: "html" | "react"
}

type ViewportSize = "desktop" | "tablet" | "mobile"

export default function CodePreview({ code, codeType }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [viewport, setViewport] = useState<ViewportSize>("desktop")

  useEffect(() => {
    if (!iframeRef.current || !code) return

    const iframe = iframeRef.current
    const document = iframe.contentDocument || iframe.contentWindow?.document

    if (!document) return

    if (codeType === "html") {
      // For HTML, inject the code directly
      document.open()
      document.write(code)
      document.close()
    } else {
      // For React, create a preview with the component rendered
      const reactPreview = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Component Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Component />);
  </script>
</body>
</html>
      `
      document.open()
      document.write(reactPreview)
      document.close()
    }
  }, [code, codeType])

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Live Preview
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-2 rounded ${
              viewport === "desktop"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-2 rounded ${
              viewport === "tablet"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            title="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-2 rounded ${
              viewport === "mobile"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 overflow-auto">
        <div
          className="mx-auto bg-white transition-all duration-300"
          style={{ width: viewportWidths[viewport], minHeight: "100%" }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full min-h-[600px] border-0"
            title="Code Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  )
}
