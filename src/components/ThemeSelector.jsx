import React from 'react';
import { Palette, Sun, Sparkles } from 'lucide-react';

export default function ThemeSelector({ currentTheme, onSelectTheme }) {
  const themes = [
    { id: 'purple', name: 'Cyberpunk', color: '#8b5cf6' },
    { id: 'cyan', name: 'Electric Cyan', color: '#06b6d4' },
    { id: 'sunset', name: 'Neon Sunset', color: '#f43f5e' }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {themes.map((t) => {
        const isSelected = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelectTheme(t.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: isSelected ? `1.5px solid ${t.color}` : '1px solid rgba(255,255,255,0.1)',
              background: isSelected ? `${t.color}25` : 'rgba(255,255,255,0.04)',
              color: isSelected ? '#fff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title={`Switch to ${t.name} Theme`}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: t.color
            }} />
            <span>{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}
