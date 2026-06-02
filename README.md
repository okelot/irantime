# Irantime (ایران‌تایم) 🕰️

**[Irantime.net](https://irantime.net)** is a modern, premium web application designed to show the accurate **Iran Time** and **Persian Calendar (Solar Hijri)**. It features a beautiful glassmorphic UI with animated "Persian Aurora" backgrounds.

![Irantime Preview](https://irantime.net/og-image.jpg)

## ✨ Features

- **Accurate Iran Time**: Displays the current time in Tehran (GMT+3:30) with second-level precision.
- **Multi-Calendar Support**:
  - ☀️ **Solar Hijri (Shamsi)**: The official calendar of Iran.
  - ✝️ **Gregorian**: International standard date.
  - 🌙 **Lunar Hijri**: Islamic date.
- **Time Machine (Converter)**: Built-in tool to convert dates between **Shamsi** and **Gregorian** calendars bi-directionally.
- **Prayer Times (اوقات شرعی)**: Daily prayer times using the official Tehran (University of Tehran) calculation method, with optional geolocation for your own city.
- **Today's Occasions (مناسبت‌ها)**: Persian-calendar national & religious occasions, with official-holiday badges.
- **Nowruz Countdown**: Live countdown to the next Persian New Year.
- **World Clock**: Iran time compared against major diaspora cities (LA, Toronto, London, Dubai, Sydney).
- **Premium Design**:
  - "Persian Aurora" floating background animations.
  - Glassmorphism 2.0 (Frosted glass effects).
  - Responsive "Bento Grid" layout.
- **SEO Optimized**: Fully optimized for search engines with JSON-LD structured data.

## 🛠️ Tech Stack

- **Vite**: Next Generation Frontend Tooling.
- **Vanilla JS**: Lightweight and fast performance without framework bloat.
- **Jalaali-js**: Accurate Jalali date conversion algorithms.
- **Adhan**: Precise prayer-time calculations (Tehran method).
- **CSS3**: Using modern features like CSS Variables, Flexbox/Grid, and Keyframe Animations.

## 🚀 Getting Started

To run this project locally on your machine:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/irantime.git
    cd irantime
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## 🌐 Deployment (GitHub Pages)

This project is configured to be deployed on **GitHub Pages**.

1.  Make sure your `vite.config.js` (if you create one) has the correct `base` path if you are not using a custom domain. Since we are using `irantime.net`, standard root `/` is fine.
2.  Push your code to GitHub.
3.  Go to **Settings** > **Pages**.
4.  Select `GitHub Actions` as the source or use the standard `Deploy from branch` (gh-pages) method.

### Build Command
To create a production build:
```bash
npm run build
```
The output will be in the `dist` folder.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Designed with ❤️ for Iranians worldwide.*
