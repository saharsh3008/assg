"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import axios from 'axios';

interface UploadProps {
    onUploadSuccess: (filename: string) => void;
}

export const FileUpload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
    const [dragActive, setDragActive] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files[0]);
        }
    };

    const handleFiles = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/upload`, formData);
            if (response.status === 200) {
                onUploadSuccess(file.name);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="h-full border-dashed border-2 bg-muted/50 hover:bg-muted/80 transition-colors">
            <CardHeader>
                <CardTitle className="text-lg">Upload Documents</CardTitle>
                <CardDescription>Drag & drop or click to upload</CardDescription>
            </CardHeader>
            <CardContent
                className="flex flex-col items-center justify-center p-6 space-y-4"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="relative w-full h-32 flex flex-col items-center justify-center cursor-pointer">
                    <input type="file" className="absolute w-full h-full opacity-0 cursor-pointer" onChange={handleChange} />
                    <div className="flex flex-col items-center">
                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">
                            {uploading ? "Uploading..." : "Support for PDF, DOCX, CSV"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
