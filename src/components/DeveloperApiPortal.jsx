import React, { useState } from 'react';
import { X, Code, Copy, Check, Terminal, Key, ShieldCheck, Zap } from 'lucide-react';

export default function DeveloperApiPortal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('curl'); // 'curl' | 'js' | 'python'
  const [apiKey, setApiKey] = useState('sk_live_sonic_88f92a4b0c1e89df3a');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const codeSnippets = {
    curl: `curl -X GET "http://localhost:5000/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" \\
  -H "Authorization: Bearer ${apiKey}"`,
    js: `// Node.js / JavaScript Axios Integration
import axios from 'axios';

const response = await axios.get('http://localhost:5000/api/info', {
  params: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  headers: { 'Authorization': 'Bearer ${apiKey}' }
});

console.log('Media Info:', response.data);`,
    python: `# Python Requests Integration
import requests

url = "http://localhost:5000/api/info"
params = {"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
headers = {"Authorization": "Bearer ${apiKey}"}

response = requests.get(url, params=params, headers=headers)
print(response.json())`
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleGenerateNewKey = () => {
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`sk_live_sonic_${randomHex}`);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 13, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '750px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Code size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>SonicMedia Developer API Portal</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Integrate social media video/audio extraction REST APIs directly into your own apps.
            </p>
          </div>
        </div>

        {/* API Key Box */}
        <div style={{
          background: 'rgba(10, 12, 22, 0.7)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--border-color)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Your Secret API Key</span>
            <button
              onClick={handleGenerateNewKey}
              style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}
            >
              Generate New Key
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              className="input-field"
              value={apiKey}
              style={{ fontFamily: 'monospace', fontSize: '0.9rem', padding: '10px 14px' }}
            />
            <button
              onClick={handleCopyKey}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.85rem' }}
            >
              {copiedKey ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Snippets Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('curl')}
                className={activeTab === 'curl' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveTab('js')}
                className={activeTab === 'js' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                JavaScript
              </button>
              <button
                onClick={() => setActiveTab('python')}
                className={activeTab === 'python' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                Python
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Copy size={14} />
              <span>{copiedCode ? 'Code Copied!' : 'Copy Snippet'}</span>
            </button>
          </div>

          <pre style={{
            background: '#090a0f',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            color: '#a7f3d0',
            fontSize: '0.85rem',
            fontFamily: 'Consolas, Monaco, monospace',
            overflowX: 'auto',
            lineHeight: 1.5
          }}>
            <code>{codeSnippets[activeTab]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
