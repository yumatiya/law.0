# Law.Gen Brand Guidelines

## 🎨 Color Palette

### Primary Colors
- **Navy Slate** (#1E293B): Trust, authority, professionalism
- **Blue Accent** (#3B82F6): Technology, innovation, AI
- **White** (#FFFFFF): Clarity, cleanliness
- **Soft Gray** (#F1F5F9): Background, subtle elements

### Secondary Colors
- **Success Green** (#10B981): Positive actions, correct answers
- **Alert Red** (#EF4444): Errors, warnings, critical actions
- **Warning Amber** (#F59E0B): Caution, pending states

## 📝 Typography

### Font Families
- **Primary**: Inter (Headings & Body)
- **Monospace**: JetBrains Mono (Code, technical content)

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700
- ExtraBold: 800
- Black: 900

## 🎯 Design System

### Border Radius
- Small: 0.25rem (4px)
- Medium: 0.5rem (8px)
- Large: 1rem (16px) - Primary radius
- Extra Large: 1.5rem (24px)

### Shadows
- Light: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- Medium: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- Heavy: `0 10px 15px -3px rgb(0 0 0 / 0.1)`

### Spacing Scale
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)
- 16: 4rem (64px)

## 🏷️ Logo Usage

### Logo Variants
1. **Full Logo**: Icon + Text (Primary usage)
2. **Icon Only**: LG monogram (Favicons, app icons)
3. **Text Only**: Law.Gen (When icon context is clear)

### Logo Clear Space
- Minimum clear space: Equal to logo height
- Never modify colors or proportions
- Minimum size: 24px height

## 🎯 Component Guidelines

### Buttons
- Primary: Navy background, white text
- Secondary: Blue border, blue text
- Success: Green background, white text
- Danger: Red background, white text

### Cards
- White background
- 1rem border radius
- Light shadow
- 1rem padding

### Forms
- Input height: 2.5rem (40px)
- Border radius: 0.5rem
- Focus state: Blue ring

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Grid System
- Container max-width: 1400px
- Padding: 2rem on mobile, 4rem on desktop

## ♿ Accessibility

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio

### Focus States
- Blue ring: 2px solid #3B82F6
- Visible on all interactive elements

### Semantic HTML
- Use proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support

## 🚀 Implementation

### CSS Custom Properties
```css
:root {
  --brand-navy: #1E293B;
  --brand-blue: #3B82F6;
  --brand-white: #FFFFFF;
  --brand-gray: #F1F5F9;
  --brand-success: #10B981;
  --brand-alert: #EF4444;
  --brand-warning: #F59E0B;
}
```

### Tailwind Classes
```js
brand: {
  navy: "#1E293B",
  blue: "#3B82F6",
  white: "#FFFFFF",
  gray: "#F1F5F9",
  success: "#10B981",
  alert: "#EF4444",
  warning: "#F59E0B",
}
```

## 📋 Usage Examples

### Logo Implementation
```tsx
<Logo variant="full" size="lg" />
<Logo variant="icon" size="md" />
<Logo variant="text" size="xl" />
```

### Color Usage
```tsx
<div className="bg-brand-navy text-brand-white">
  <p className="text-brand-blue">AI-Powered Learning</p>
</div>
```

### Typography
```tsx
<h1 className="font-bold text-3xl text-brand-navy">Welcome to Law.Gen</h1>
<p className="font-medium text-brand-blue">Your AI Education Companion</p>
