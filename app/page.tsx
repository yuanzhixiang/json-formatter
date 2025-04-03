'use client';

import { useState, useRef, useEffect } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

// Examples data
const examples = {
  simple: {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    isSubscribed: true,
    hobbies: ["reading", "hiking", "coding"]
  },
  nested: {
    person: {
      name: {
        first: "Jane",
        last: "Smith"
      },
      contact: {
        email: "jane@example.com",
        phone: {
          home: "555-1234",
          work: "555-5678"
        }
      },
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipcode: "12345"
      }
    }
  },
  array: [
    {
      id: 1,
      title: "Product A",
      price: 29.99,
      inStock: true
    },
    {
      id: 2,
      title: "Product B",
      price: 49.99,
      inStock: false
    },
    {
      id: 3,
      title: "Product C",
      price: 19.99,
      inStock: true
    }
  ],
  api: {
    status: "success",
    code: 200,
    data: {
      users: [
        {
          id: 101,
          username: "user1",
          email: "user1@example.com",
          role: "admin"
        },
        {
          id: 102,
          username: "user2",
          email: "user2@example.com",
          role: "editor"
        }
      ],
      pagination: {
        total: 57,
        page: 1,
        perPage: 10
      }
    },
    meta: {
      serverTime: "2023-05-15T14:32:28Z",
      apiVersion: "1.2.3"
    }
  }
};

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const formatJson = () => {
    try {
      const input = jsonInput.trim();
      if (!input) {
        showMessage('Please enter JSON data to format.', 'error');
        return;
      }
      
      const parsedJSON = JSON.parse(input);
      const formattedJSON = JSON.stringify(parsedJSON, null, 2);
      setJsonOutput(formattedJSON);
      showMessage('JSON formatted successfully!', 'success');
    } catch (error) {
      if (error instanceof Error) {
        showMessage(`Error: ${error.message}`, 'error');
      } else {
        showMessage('An unknown error occurred', 'error');
      }
    }
  };

  const validateJson = () => {
    try {
      const input = jsonInput.trim();
      if (!input) {
        showMessage('Please enter JSON data to validate.', 'error');
        return;
      }
      
      JSON.parse(input);
      showMessage('JSON is valid!', 'success');
    } catch (error) {
      if (error instanceof Error) {
        showMessage(`Invalid JSON: ${error.message}`, 'error');
      } else {
        showMessage('An unknown error occurred', 'error');
      }
    }
  };

  const minifyJson = () => {
    try {
      const input = jsonInput.trim();
      if (!input) {
        showMessage('Please enter JSON data to minify.', 'error');
        return;
      }
      
      const parsedJSON = JSON.parse(input);
      const minifiedJSON = JSON.stringify(parsedJSON);
      setJsonOutput(minifiedJSON);
      showMessage('JSON minified successfully!', 'success');
    } catch (error) {
      if (error instanceof Error) {
        showMessage(`Error: ${error.message}`, 'error');
      } else {
        showMessage('An unknown error occurred', 'error');
      }
    }
  };

  const copyOutput = () => {
    if (!jsonOutput) {
      showMessage('No formatted JSON to copy.', 'error');
      return;
    }
    
    if (outputRef.current) {
      outputRef.current.select();
      document.execCommand('copy');
      showMessage('Copied to clipboard!', 'success');
    }
  };

  const downloadJson = () => {
    if (!jsonOutput) {
      showMessage('No formatted JSON to download.', 'error');
      return;
    }
    
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-json.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('JSON file downloaded!', 'success');
  };

  const clearAll = () => {
    setJsonInput('');
    setJsonOutput('');
    setMessage({ text: '', type: '' });
  };

  const loadExample = (exampleType: keyof typeof examples) => {
    const exampleData = examples[exampleType];
    setJsonInput(JSON.stringify(exampleData));
    formatJson();
  };

  useEffect(() => {
    const handlePaste = () => {
      setTimeout(() => {
        const input = jsonInput.trim();
        if (input && (input.startsWith('{') || input.startsWith('['))) {
          try {
            JSON.parse(input);
            formatJson();
          } catch (error) {
            // Not valid JSON, don't auto-format
          }
        }
      }, 100);
    };

    const inputArea = document.getElementById('jsonInput');
    if (inputArea) {
      inputArea.addEventListener('paste', handlePaste);
    }

    return () => {
      if (inputArea) {
        inputArea.removeEventListener('paste', handlePaste);
      }
    };
  }, [jsonInput]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav>
            <h3 className="text-xl font-semibold">JSON Tools</h3>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        <section id="intro" className="mb-8">
          <h1 className="text-4xl font-bold mb-4">JSON Formatter & Validator Tool</h1>
          <p className="text-lg">
            The best free online JSON formatter and validator helps you format, beautify, and validate your JSON data instantly. 
            Save time and avoid errors with our powerful JSON tool that automatically formats messy JSON into a readable structure.
          </p>
        </section>

        <section id="tool" className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Format and Validate Your JSON</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Input JSON</h3>
              <textarea
                id="jsonInput"
                className="w-full h-[300px] p-4 border border-gray-300 rounded font-mono text-sm resize-y"
                placeholder="Paste your JSON here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Formatted JSON</h3>
              <textarea
                ref={outputRef}
                className="w-full h-[300px] p-4 border border-gray-300 rounded font-mono text-sm resize-y"
                readOnly
                value={jsonOutput}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={formatJson}
              className="px-4 py-2 bg-[#4a6ee0] text-white rounded font-medium hover:opacity-90"
            >
              Format JSON
            </button>
            <button
              onClick={validateJson}
              className="px-4 py-2 bg-[#e9ecef] text-gray-800 rounded font-medium hover:opacity-90"
            >
              Validate JSON
            </button>
            <button
              onClick={minifyJson}
              className="px-4 py-2 bg-[#e9ecef] text-gray-800 rounded font-medium hover:opacity-90"
            >
              Minify JSON
            </button>
            <button
              onClick={copyOutput}
              className="px-4 py-2 bg-[#e9ecef] text-gray-800 rounded font-medium hover:opacity-90"
            >
              Copy Output
            </button>
            <button
              onClick={downloadJson}
              className="px-4 py-2 bg-[#28a745] text-white rounded font-medium hover:opacity-90"
            >
              Download JSON
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-[#e9ecef] text-gray-800 rounded font-medium hover:opacity-90"
            >
              Clear
            </button>
          </div>
          {message.text && (
            <div
              className={`mt-4 p-3 rounded ${
                message.type === 'error'
                  ? 'bg-[#f8d7da] text-[#dc3545] border border-[#f5c6cb]'
                  : 'bg-[#d4edda] text-[#28a745] border border-[#c3e6cb]'
              }`}
            >
              {message.text}
            </div>
          )}
        </section>

        <section id="examples" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">JSON Format Examples</h2>
          <p className="mb-4">Not sure where to start? Click on any of these examples to see how our formatter works:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-transform hover:-translate-y-1"
              onClick={() => loadExample('simple')}
            >
              <h3 className="text-lg font-medium mb-2">Simple JSON Object</h3>
              <p className="text-gray-600">A basic JSON object with various data types</p>
            </div>
            <div
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-transform hover:-translate-y-1"
              onClick={() => loadExample('nested')}
            >
              <h3 className="text-lg font-medium mb-2">Nested JSON</h3>
              <p className="text-gray-600">Complex nested object structure</p>
            </div>
            <div
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-transform hover:-translate-y-1"
              onClick={() => loadExample('array')}
            >
              <h3 className="text-lg font-medium mb-2">JSON Array</h3>
              <p className="text-gray-600">Array of objects with consistent structure</p>
            </div>
            <div
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-transform hover:-translate-y-1"
              onClick={() => loadExample('api')}
            >
              <h3 className="text-lg font-medium mb-2">API Response</h3>
              <p className="text-gray-600">Typical REST API response format</p>
            </div>
          </div>
        </section>

        <section id="features" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Use Our JSON Formatter?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-medium mb-2">Easy to Use</h3>
              <p className="text-gray-600">Simply paste your JSON and click format. No complicated steps or settings required.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-medium mb-2">Instant Formatting</h3>
              <p className="text-gray-600">Our tool formats your JSON in milliseconds, saving you valuable time.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-medium mb-2">Detailed Error Detection</h3>
              <p className="text-gray-600">Find and fix syntax errors with precise error messages that highlight problematic sections.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-medium mb-2">Secure & Private</h3>
              <p className="text-gray-600">All processing happens in your browser. Your JSON data never leaves your computer.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-medium mb-2">Works Offline</h3>
              <p className="text-gray-600">Once loaded, our tool works without an internet connection.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-medium mb-2">Cross-Browser Compatible</h3>
              <p className="text-gray-600">Works perfectly on Chrome, Firefox, Safari, and all modern browsers.</p>
            </div>
          </div>
        </section>

        <section id="social-proof" className="bg-[#e9ecef] py-8 px-4 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Trusted by Developers Worldwide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-[#4a6ee0]">1M+</div>
              <p>JSON Documents Formatted</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#4a6ee0]">250K+</div>
              <p>Monthly Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#4a6ee0]">99.9%</div>
              <p>Uptime</p>
            </div>
          </div>
        </section>

        <section id="guide" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Format JSON - Complete Guide</h2>
          
          <h3 className="text-xl font-medium mt-6 mb-2">What is JSON?</h3>
          <p className="mb-4">JSON (JavaScript Object Notation) is a lightweight data interchange format that's easy for humans to read and write, and easy for machines to parse and generate. It's based on a subset of JavaScript but is language-independent, making it ideal for data exchange between different programming languages.</p>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Why Format JSON?</h3>
          <p className="mb-4">Raw JSON data often comes in a minified form without proper indentation or line breaks, making it difficult to read and understand. Formatting JSON adds proper indentation, line breaks, and spacing, transforming unreadable code into a structured, easy-to-navigate format.</p>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Common JSON Syntax Rules</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Data is represented in name/value pairs</li>
            <li className="mb-1">Curly braces {} hold objects</li>
            <li className="mb-1">Square brackets [] hold arrays</li>
            <li className="mb-1">Names must be strings, written with double quotes</li>
            <li className="mb-1">Values can be strings, numbers, objects, arrays, true, false, or null</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Step-by-Step JSON Formatting</h3>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-1">Paste your unformatted JSON into the input box above</li>
            <li className="mb-1">Click the "Format JSON" button</li>
            <li className="mb-1">Review the formatted JSON in the output box</li>
            <li className="mb-1">Copy or download the formatted result</li>
          </ol>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Example of Unformatted vs. Formatted JSON</h3>
          <p className="mb-2">Unformatted JSON:</p>
          <pre className="bg-[#f8f9fa] p-4 rounded border border-gray-300 mb-4 overflow-x-auto font-mono text-sm">
            {`{"name":"John","age":30,"skills":["JavaScript","HTML","CSS"],"address":{"street":"123 Main St","city":"Boston","state":"MA"}}`}
          </pre>
          
          <p className="mb-2">Formatted JSON:</p>
          <pre className="bg-[#f8f9fa] p-4 rounded border border-gray-300 mb-4 overflow-x-auto font-mono text-sm">
            {`{
  "name": "John",
  "age": 30,
  "skills": [
    "JavaScript",
    "HTML",
    "CSS"
  ],
  "address": {
    "street": "123 Main St", 
    "city": "Boston",
    "state": "MA"
  }
}`}
          </pre>

          <h3 className="text-xl font-medium mt-6 mb-2">Common JSON Formatting Errors</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Missing or extra commas between properties</li>
            <li className="mb-1">Using single quotes instead of double quotes for names</li>
            <li className="mb-1">Trailing commas after the last property</li>
            <li className="mb-1">Unmatched brackets or braces</li>
            <li className="mb-1">Invalid property names (not enclosed in quotes)</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">Advanced JSON Formatting Tips</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Use the "Validate JSON" option to check for syntax errors before formatting</li>
            <li className="mb-1">For large JSON files, use the download option to save the formatted result</li>
            <li className="mb-1">When sharing JSON data, consider using the minify option to reduce file size</li>
            <li className="mb-1">Save commonly used JSON structures as snippets for future use</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">Benefits of Well-Formatted JSON</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Easier to read and understand the data structure</li>
            <li className="mb-1">Faster debugging of issues in data format</li>
            <li className="mb-1">Improved code reviews with clear data visualization</li>
            <li className="mb-1">Better documentation when JSON appears in technical documents</li>
            <li className="mb-1">Reduced errors when manually editing JSON data</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-2">JSON vs. Other Data Formats</h3>
          <p className="mb-2">JSON has several advantages over other data interchange formats like XML or CSV:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Simpler syntax and structure compared to XML</li>
            <li className="mb-1">Native support in JavaScript and most modern programming languages</li>
            <li className="mb-1">More readable than CSV when dealing with nested data</li>
            <li className="mb-1">Typically more compact than equivalent XML</li>
            <li className="mb-1">Better support for complex data types and hierarchies</li>
          </ul>
        </section>

        <section id="faq" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Is this JSON formatter tool free to use?</h3>
          <p className="mb-4">Yes, our JSON formatter is completely free with no usage limitations. Format as much JSON as you need without any cost.</p>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Does your tool send my JSON data to a server?</h3>
          <p className="mb-4">No, our tool processes everything directly in your browser. Your JSON data never leaves your computer, ensuring complete privacy and security.</p>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Can I format large JSON files with this tool?</h3>
          <p className="mb-4">Yes, our formatter is optimized to handle JSON files of various sizes. However, very large files (over 10MB) might cause performance issues depending on your device.</p>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Does the formatter fix JSON errors?</h3>
          <p className="mb-4">Our tool validates JSON and highlights errors but doesn't automatically fix all issues. For valid JSON, it provides perfect formatting; for invalid JSON, it provides error details to help you fix the problems.</p>
          
          <h3 className="text-xl font-medium mt-6 mb-2">Can I customize the formatting style?</h3>
          <p className="mb-4">The current version uses standard 2-space indentation. We're working on adding customization options in future updates.</p>
          
          <h3 className="text-xl font-medium mt-6 mb-2">How does JSON validation work?</h3>
          <p className="mb-4">Our validator checks if your JSON follows the official JSON specification (RFC 8259), verifying proper syntax, correctly paired brackets, appropriate use of commas, and valid property names.</p>
        </section>

        <section id="related" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Related JSON Tools</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">JSON to XML Converter</li>
            <li className="mb-1">JSON Schema Validator</li>
            <li className="mb-1">JSON Path Finder</li>
            <li className="mb-1">JSON Diff Tool</li>
            <li className="mb-1">JSON to CSV Converter</li>
          </ul>
        </section>
      </main>

      <footer className="bg-[#343a40] text-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <p>&copy; 2023 JSON Formatter Tool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 