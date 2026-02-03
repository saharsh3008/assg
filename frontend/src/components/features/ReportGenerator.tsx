"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // We need to create this or use a simple input for now
import { Download } from "lucide-react";
import axios from 'axios';

// Simple Checkbox component since we didn't add the shadcn one yet to minimize file count
const SimpleCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
    <div className="flex items-center space-x-2">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
        </label>
    </div>
);

export const ReportGenerator: React.FC = () => {
    const [sections, setSections] = useState({
        "Introduction": true,
        "Clinical Findings": true,
        "Treatment Plan": false,
        "Summary": true
    });
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        const selectedSections = Object.entries(sections)
            .filter(([_, checked]) => checked)
            .map(([name, _]) => name);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/report/generate_report`, {
                sections: selectedSections
            });

            const { filename } = response.data;

            // Trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/report/download/${filename}`;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

        } catch (error) {
            console.error("Report generation failed", error);
            alert("Failed to generate report.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generate Report</CardTitle>
                <CardDescription>Select sections to include in the automated report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.keys(sections).map((section) => (
                    <SimpleCheckbox
                        key={section}
                        label={section}
                        checked={sections[section as keyof typeof sections]}
                        onChange={(val) => setSections(prev => ({ ...prev, [section]: val }))}
                    />
                ))}
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleGenerate} disabled={generating}>
                    {generating ? (
                        "Generating PDF..."
                    ) : (
                        <>
                            <Download className="mr-2 w-4 h-4" /> Generate & Download
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};
