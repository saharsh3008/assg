"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/features/FileUpload";
import { ChatInterface } from "@/components/features/ChatInterface";
import { ReportGenerator } from "@/components/features/ReportGenerator";

export default function Home() {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    const handleUploadSuccess = (filename: string) => {
        setUploadedFiles(prev => [...prev, filename]);
    };

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="w-full border-b bg-white dark:bg-slate-950 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                        H
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">GenAI Healthcare Assistant</h1>
                </div>
                <div className="text-sm text-muted-foreground">
                    Connected to Secure RAG Engine
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="flex-1 container mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Sidebar: Uploads & Report */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">Data Sources</h2>
                        <FileUpload onUploadSuccess={handleUploadSuccess} />
                        {uploadedFiles.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border shadow-sm">
                                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Active Context</h3>
                                <ul className="space-y-2">
                                    {uploadedFiles.map((file, i) => (
                                        <li key={i} className="flex items-center text-sm p-2 bg-muted rounded-md text-foreground">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                            {file}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">Report Actions</h2>
                        <ReportGenerator />
                    </section>
                </div>

                {/* Right Main Area: Chat */}
                <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
                    <ChatInterface />
                </div>
            </div>
        </main>
    );
}
