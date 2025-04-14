"use client";

import { Tabs, Tab, Textarea, ScrollShadow } from "@heroui/react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function ContentTabs({ content, setContent }) {
    const [activeTab, setActiveTab] = useState('write');
    return (
        <Tabs
            aria-label="Post Content Tabs"
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
        >
            <Tab key="write" title="Write">
                <Textarea
                    placeholder="Write your post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    minRows={10}
                    className="w-full"
                />
            </Tab>
            <Tab key="preview" title="Preview">
                <ScrollShadow className="h-[400px] w-full">
                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-headings:font-bold prose-headings:text-warning prose-p:text-foreground prose-a:text-warning prose-a:underline hover:prose-a:text-warning prose-strong:text-warning-700 prose-ul:list-disc prose-ol:list-decimal prose-pre:bg-background prose-pre:text-foreground-700 prose-code:font-mono prose-code:text-warning-800 prose-code:bg-background-200 prose-blockquote:font-light prose-blockquote:border-l-4 prose-blockquote:border-warning prose-blockquote:pl-4 prose-blockquote:italic prose-hr:border-warning-300">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </ScrollShadow>
            </Tab>
        </Tabs>
    );
}