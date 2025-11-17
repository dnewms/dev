"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageSelect: (file: File, base64: string) => void
  disabled?: boolean
}

export default function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setPreview(base64)
        onImageSelect(file, base64)
      }
      reader.readAsDataURL(file)
    },
    [onImageSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled,
  })

  const clearImage = () => {
    setPreview(null)
  }

  return (
    <div className="w-full">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Upload className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isDragActive
                  ? "Drop your screenshot here"
                  : "Drag & drop a screenshot"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                or click to browse (PNG, JPG, WebP)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4">
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ImageIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                Screenshot uploaded
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ready to generate code
              </p>
            </div>
          </div>
          <img
            src={preview}
            alt="Screenshot preview"
            className="mt-4 rounded-lg max-h-64 object-contain mx-auto"
          />
        </div>
      )}
    </div>
  )
}
