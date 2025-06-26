"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Eye, Code, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function MarkdownConverter() {
  const [markdownInput, setMarkdownInput] = useState(`# Welcome to Markdown Converter

This is a **bold** text and this is *italic* text.

## Features

- Convert Markdown to HTML
- Live preview
- Copy converted HTML
- Sample templates

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Links and Images

[Visit Example](https://example.com)

![Sample Image](https://via.placeholder.com/300x200)

### Tables

| Name | Age | City |
|------|-----|------|
| John | 30  | NYC  |
| Jane | 25  | LA   |

&gt; This is a blockquote with some important information.

---

**Thank you for using our Markdown converter!**`)

  const [htmlOutput, setHtmlOutput] = useState("")

  const convertToHTML = () => {
    // Simple Markdown to HTML converter (for demo - use marked.js in production)
    let html = markdownInput

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>")
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>")
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>")

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

    // Links
    html = html.replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2">$1</a>')

    // Images
    html = html.replace(/!\[([^\]]*)\]$$([^)]+)$$/g, '<img src="$2" alt="$1" />')

    // Lists
    html = html.replace(/^- (.+$)/gim, "<li>$1</li>")
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")

    // Tables
    html = html.replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split("|").map((cell: string) => cell.trim())
      return "<tr>" + cells.map((cell: string) => `<td>${cell}</td>`).join("") + "</tr>"
    })
    html = html.replace(/(<tr>.*<\/tr>)/s, "<table>$1</table>")

    // Blockquotes
    html = html.replace(/^> (.+$)/gim, "<blockquote>$1</blockquote>")

    // Horizontal rules
    html = html.replace(/^---$/gim, "<hr>")

    // Line breaks
    html = html.replace(/\n/g, "<br>")

    // Clean up multiple br tags
    html = html.replace(/(<br>){2,}/g, "<br><br>")

    setHtmlOutput(html)
    toast({
      title: "Success!",
      description: "Markdown converted to HTML",
    })
  }

  const convertToMarkdown = (html: string) => {
    // Simple HTML to Markdown converter
    let markdown = html

    // Headers
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, "# $1")
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, "## $1")
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, "### $1")

    // Bold and Italic
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, "*$1*")

    // Code
    markdown = markdown.replace(/<code>(.*?)<\/code>/g, "`$1`")
    markdown = markdown.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gs, "```\n$1\n```")

    // Links
    markdown = markdown.replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")

    // Images
    markdown = markdown.replace(/<img src="([^"]+)" alt="([^"]*)"[^>]*>/g, "![$2]($1)")

    // Lists
    markdown = markdown.replace(/<li>(.*?)<\/li>/g, "- $1")
    markdown = markdown.replace(/<\/?ul>/g, "")

    // Blockquotes
    markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/g, "> $1")

    // Horizontal rules
    markdown = markdown.replace(/<hr>/g, "---")

    // Line breaks
    markdown = markdown.replace(/<br>/g, "\n")

    // Clean up HTML tags
    markdown = markdown.replace(/<[^>]+>/g, "")

    return markdown
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  const loadTemplate = (template: string) => {
    const templates = {
      readme: `# Project Name

A brief description of your project.

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`javascript
const project = require('project-name');
project.doSomething();
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License`,

      documentation: `# API Documentation

## Overview

This API provides access to our service endpoints.

### Authentication

All requests require an API key:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

### Endpoints

#### GET /users

Returns a list of users.

**Parameters:**
- \`limit\` (optional): Number of users to return
- \`offset\` (optional): Number of users to skip

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\``,

      blog: `# Blog Post Title

*Published on ${new Date().toLocaleDateString()}*

## Introduction

Welcome to this blog post where we'll explore...

## Main Content

### Section 1

Here's some important information about...

### Section 2

Let's dive deeper into...

## Conclusion

In summary, we've learned that...

---

*Tags: #technology #tutorial #guide*`,
    }

    setMarkdownInput(templates[template as keyof typeof templates])
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Markdown Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={convertToHTML}>
              <Code className="w-4 h-4 mr-2" />
              Convert to HTML
            </Button>
            <Button variant="outline" onClick={() => loadTemplate("readme")}>
              README Template
            </Button>
            <Button variant="outline" onClick={() => loadTemplate("documentation")}>
              Docs Template
            </Button>
            <Button variant="outline" onClick={() => loadTemplate("blog")}>
              Blog Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Editor and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Markdown Input */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Markdown Input</CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(markdownInput, "Markdown")}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={markdownInput}
              onChange={(e) => setMarkdownInput(e.target.value)}
              placeholder="Enter your Markdown here..."
              className="min-h-[500px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="html" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  HTML
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <div
                  className="min-h-[450px] p-4 border rounded-lg bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlOutput || "Click 'Convert to HTML' to see preview" }}
                />
              </TabsContent>

              <TabsContent value="html" className="mt-4">
                <div className="relative">
                  <Textarea
                    value={htmlOutput}
                    readOnly
                    placeholder="HTML output will appear here..."
                    className="min-h-[450px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                  />
                  {htmlOutput && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(htmlOutput, "HTML")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Markdown Cheat Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>Markdown Cheat Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Headers</h4>
              <div className="space-y-1 font-mono text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div># H1</div>
                <div>## H2</div>
                <div>### H3</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Emphasis</h4>
              <div className="space-y-1 font-mono text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div>**bold**</div>
                <div>*italic*</div>
                <div>\`code\`</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Lists</h4>
              <div className="space-y-1 font-mono text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div>- Item 1</div>
                <div>- Item 2</div>
                <div>1. Numbered</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Links</h4>
              <div className="space-y-1 font-mono text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div>[Link](url)</div>
                <div>![Image](url)</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Code</h4>
              <div className="space-y-1 font-mono text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div>\`\`\`language</div>
                <div>code block</div>
                <div>\`\`\`</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Other</h4>
              <div className="space-y-1 font-mono text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div>&gt; Blockquote</div>
                <div>---</div>
                <div>| Table | Cell |</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
