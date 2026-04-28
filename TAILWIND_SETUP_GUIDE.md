# 🎨 Tailwind CSS Setup Guide

**Status:** Complete Tailwind CSS configuration for modern/minimalist UI  
**Date:** 2026-04-28

---

## ✅ What's Been Created

Four essential files have been set up:

### 1. **tailwind.config.js** ✨
Complete Tailwind configuration with:
- **Extended Color Palette** - Primary, Secondary, Success, Error, Warning, Info, Neutral colors
- **Custom Spacing Scale** - 8px-based grid system (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)
- **Typography System** - Font sizes with proper line heights and letter spacing
- **Border Radius** - Consistent rounded corner scales
- **Box Shadows** - Design-system shadows (xs, sm, base, md, lg, xl)
- **Transition Durations** - Fast (150ms), Base (200ms), Slow (300ms)

### 2. **postcss.config.js** ⚙️
PostCSS configuration for:
- Tailwind CSS processing
- Autoprefixer for browser compatibility

### 3. **src/index.css** 🎯
Custom Tailwind directives including:
- **Base Layer** - Global HTML element styling (h1-h6, p, a, etc.)
- **Component Layer** - Reusable component classes:
  - Button variants (primary, secondary, ghost, danger)
  - Card styles (normal, elevated)
  - Form inputs with states (focus, hover, disabled, error)
  - Badge variants
  - Alert variants
  - Dividers
  - Form groups and labels
- **Utilities Layer** - Custom utilities for spacing and styling

### 4. **TAILWIND_SETUP_GUIDE.md** 📖
This guide with installation and usage instructions

---

## 📦 Installation Steps

### Step 1: Install Tailwind Dependencies

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Step 2: Verify Files Are in Place

Check that these files exist in your project root:
- ✅ `tailwind.config.js`
- ✅ `postcss.config.js`
- ✅ `src/index.css` (updated with Tailwind directives)

### Step 3: Import Index CSS

Update **src/main.jsx** to include the Tailwind CSS:

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // ← Add this line

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Step 4: Update Vite Config (if needed)

Your vite.config.js should already work, but verify it includes:

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
})
```

### Step 5: Start Development Server

```bash
npm run dev
```

Tailwind CSS will now be available in your project! 🎉

---

## 🎨 How to Use Tailwind Classes

### Button Examples

```jsx
// Primary Button
<button className="btn-primary">
  Create Plan
</button>

// Secondary Button
<button className="btn-secondary">
  Cancel
</button>

// Ghost Button
<button className="btn-ghost">
  Learn More
</button>

// Danger Button
<button className="btn-danger">
  Delete
</button>
```

### Form Example

```jsx
<div className="form-group">
  <label className="form-label">
    Email Address
  </label>
  <input
    type="email"
    className="input-field"
    placeholder="you@example.com"
  />
  <p className="form-hint">We'll never share your email.</p>
</div>
```

### Card Example

```jsx
<div className="card">
  <h3 className="text-xl font-semibold mb-4">
    Your Plans
  </h3>
  <p className="text-neutral-600 mb-6">
    Create and manage your guidance plans here.
  </p>
  <button className="btn-primary">
    New Plan
  </button>
</div>
```

### Alert Example

```jsx
<div className="alert alert-success">
  <span className="text-lg">✓</span>
  <div>
    <h4 className="font-semibold">Success!</h4>
    <p className="text-sm mt-1">Your plan has been saved.</p>
  </div>
</div>
```

### Layout Example

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="card">
    <h4 className="font-semibold">Plans</h4>
    <p className="text-2xl font-bold text-primary-500">12</p>
  </div>
  <div className="card">
    <h4 className="font-semibold">Goals</h4>
    <p className="text-2xl font-bold text-success-500">8</p>
  </div>
  {/* More cards... */}
</div>
```

### Badge Example

```jsx
<div className="flex gap-2 flex-wrap">
  <span className="badge badge-primary">Active</span>
  <span className="badge badge-success">Completed</span>
  <span className="badge badge-error">Blocked</span>
</div>
```

---

## 📐 Custom Spacing Scale

Use the custom spacing tokens defined in tailwind.config.js:

| Class | Value | Use Case |
|-------|-------|----------|
| `p-3xs` | 4px | Tiny padding |
| `p-2xs` | 6px | Extra small |
| `p-xs` | 8px | Small padding |
| `p-sm` | 12px | Small component padding |
| `p-md` | 16px | Default padding |
| `p-lg` | 24px | Large sections |
| `p-xl` | 32px | Extra large |
| `p-2xl` | 40px | Page sections |
| `p-3xl` | 48px | Major sections |
| `p-4xl` | 56px | Page-level padding |
| `p-5xl` | 64px | Large containers |

**Apply to all sides:** `p-md` (padding), `m-lg` (margin), `gap-sm` (flex gap)

**Apply to specific sides:** `px-md` (horizontal), `py-lg` (vertical), `pt-sm` (top), `pb-md` (bottom)

---

## 🎨 Color Usage Examples

### Primary (Brand Blue)
```html
<!-- Background -->
<div class="bg-primary-500">Primary background</div>
<div class="bg-primary-50">Light primary</div>

<!-- Text -->
<p class="text-primary-600">Primary text</p>
<p class="text-primary-900">Dark primary text</p>

<!-- Border -->
<div class="border border-primary-300">Primary border</div>

<!-- Ring (focus states) -->
<input class="ring-2 ring-primary-100" />
```

### Semantic Colors
```html
<!-- Success -->
<div class="bg-success-100 text-success-700">Success message</div>

<!-- Error -->
<div class="bg-error-100 text-error-700">Error message</div>

<!-- Warning -->
<div class="bg-warning-100 text-warning-700">Warning message</div>

<!-- Info -->
<div class="bg-info-100 text-info-700">Info message</div>
```

---

## 📝 Converting Old Classes to Tailwind

### Before (Old CSS)
```jsx
<button className="primary-button">
  Create Plan
</button>

<style>
.primary-button {
  padding: 14px 18px;
  color: #fff;
  background: #2d6f5b;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 800;
  transition: all 200ms ease;
}

.primary-button:hover {
  transform: translateY(-1px);
}
</style>
```

### After (Tailwind CSS)
```jsx
<button className="btn-primary">
  Create Plan
</button>

<!-- Or use raw utilities -->
<button className="px-5 py-3 bg-primary-500 text-white rounded-md font-semibold hover:bg-primary-600 transition-all duration-200">
  Create Plan
</button>
```

---

## 🔧 Common Tailwind Patterns

### Responsive Design
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Hover Effects
```jsx
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-colors">
  Click me
</button>
```

### Flex Layout
```jsx
<div className="flex items-center justify-between gap-4">
  {/* flex items with space between */}
</div>
```

### Grid Layout
```jsx
<div className="grid grid-cols-4 gap-4 auto-rows-max">
  {/* 4-column grid with automatic row sizing */}
</div>
```

### Text Truncation
```jsx
<p className="truncate">Long text that gets cut off...</p>
<p className="line-clamp-2">Two lines max...</p>
```

### Opacity & Colors
```jsx
<div className="bg-primary-500 bg-opacity-50">50% opacity</div>
<div className="bg-neutral-900 bg-opacity-75">75% opacity</div>
```

---

## 🚀 Next Steps

1. ✅ Install dependencies (`npm install -D tailwindcss postcss autoprefixer`)
2. ✅ Verify all config files are in place
3. ✅ Update `src/main.jsx` to import `./index.css`
4. ✅ Start development server (`npm run dev`)
5. 📝 Start converting components to use Tailwind classes
6. 🗑️ Once converted, you can delete `src/App.css` (backup first!)
7. 🎨 Build amazing modern UI!

---

## 📚 Useful Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) (VS Code extension)
- [Tailwind CSS Playground](https://play.tailwindcss.com/)
- [Tailwind CSS Color Tool](https://www.tailwindshades.com/)

---

## ⚠️ Important Notes

1. **Keep App.css for now** - Don't delete your old CSS until you've migrated all components
2. **Both can coexist** - You can use both Tailwind and custom CSS simultaneously
3. **Specificity matters** - Tailwind classes have standard specificity; custom CSS can override them
4. **Build optimization** - Tailwind automatically purges unused classes in production builds
5. **Development mode** - CSS will be slower in development (scanning all files). This is normal!

---

**Happy building with Tailwind CSS! 🚀**
