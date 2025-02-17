"use client"

import * as React from "react"
import { Trash2, FileUp, File } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FileUploadProps {
    onChange?: (file: File | null) => void
    value?: File | null
    preview?: boolean
    maxSize?: number // in bytes
    className?: string
    accept?: string
    name?: string
}

export function FileUpload({
    onChange,
    value,
    preview = true,
    maxSize = 3 * 1024 * 1024, // 5MB default
    accept,
    className,
    name,
}: FileUploadProps) {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > maxSize) {
                alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
                return
            }
            onChange?.(file)
            if (preview && file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setPreviewUrl(reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const handleRemove = () => {
        onChange?.(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className={cn("rounded-lg", className)}>
            <div className="border border-dashed border-input rounded-md transition-colors">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    name={name}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="flex p-6 items-center justify-center gap-1 cursor-pointer text-muted-foreground">
                    <FileUp size={16} />
                    <p>Click to upload image</p>
                </label>
            </div>

            <div className="mt-2 flex justify-between">
                <p className="text-xs text-muted-foreground">Only images are supported</p>
                <p className="text-xs text-muted-foreground">Maximum file size: 3MB</p>
            </div>

            {value && (
                <div className="border rounded-md p-3 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <File size={32} strokeWidth={1.5} className="text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground text-xs font-medium">{value.name}</p>
                            <p className="text-muted-foreground text-xs">{(value.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={handleRemove}
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>
    )
}

