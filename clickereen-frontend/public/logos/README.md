# 🎨 Clickereen Logo Files

## 📁 File Structure
Place your logo files in this directory with the following naming convention:

```
logos/
├── logo.svg              # Main logo (vector, scalable)
├── logo.png              # Main logo (PNG, high resolution)
├── logo-white.svg        # White version for dark backgrounds
├── logo-white.png        # White version (PNG)
├── favicon.ico           # 32x32 favicon
├── apple-touch-icon.png  # 180x180 for iOS
├── icon-192x192.png      # 192x192 for Android
└── icon-512x512.png      # 512x512 for Android
```

## 🎯 Recommended Specifications

### **Main Logo (logo.svg & logo.png):**
- **Format**: SVG (preferred) + PNG fallback
- **Size**: 200x60px (recommended)
- **Background**: Transparent
- **Colors**: Your brand colors
- **Usage**: Header, login page, main branding

### **White Logo (logo-white.svg & logo-white.png):**
- **Format**: SVG (preferred) + PNG fallback
- **Size**: 200x60px (recommended)
- **Background**: Transparent
- **Colors**: White/light colors
- **Usage**: Dark backgrounds, footer

### **Favicon (favicon.ico):**
- **Format**: ICO
- **Size**: 32x32px
- **Background**: Transparent or solid
- **Usage**: Browser tab icon

### **App Icons:**
- **apple-touch-icon.png**: 180x180px (iOS home screen)
- **icon-192x192.png**: 192x192px (Android home screen)
- **icon-512x512.png**: 512x512px (Android app store)

## 🚀 How to Add Your Logo

1. **Save your logo files** in this directory with the exact names above
2. **Update the manifest.json** to reference your new icons
3. **Update the layout.tsx** to use your new favicon
4. **Update components** to use your new logo

## 💡 Tips

- **SVG is preferred** for scalability
- **Keep file sizes small** for better performance
- **Test on different backgrounds** (light/dark)
- **Ensure readability** at small sizes (favicon)
- **Use consistent colors** with your brand

## 🔧 Next Steps

Once you add your logo files, I'll help you:
- Update all references in the code
- Optimize the files for web
- Test across different devices
- Update the manifest and metadata
