# **📱 Social Portfolio: The Ultimate Interactive Developer Profile**

**"Not just a portfolio, it's a feed."**

This is a cutting-edge, interactive portfolio application built with **React** and **Framer Motion**. It reimagines the traditional developer resume by presenting it through the lens of popular social media interfaces (TikTok, Instagram, Facebook, Twitter/X).

It features a fully immersive 3D Project Hub, gamified elements (BitPet, Graffiti Mode), and complete English/German internationalization.

## **✨ Key Features**

### **🎨 Dynamic Themes**

Switch between four distinct UI modes, each with unique layouts and interactions:

* **TikTok Mode:** Vertical snap-scrolling, immersive video-style layout, and live stream simulation.  
* **Instagram Mode:** Grid/List views, stories, and a clean, photo-centric aesthetic.  
* **Facebook Mode:** Traditional timeline feed with friend requests and "memories."  
* **Twitter/X Mode:** Thread-based experience with "What's Happening" sidebars.

### **🚀 3D Project Hub**

A centerpiece interaction where your projects orbit in a 3D space.

* **Interactive Sphere:** Projects float as glossy 3D icons.  
* **Hover Effects:** Icons gently fade to reveal project titles.  
* **Physics-based Animation:** Smooth spring and damping effects using Framer Motion.

### **🎮 Gamification & Fun**

* **Graffiti Mode:** Draw anywhere on the screen with a spray can effect.  
* **Sticker Drawer:** Drag and drop "developer humor" stickers (e.g., "Works on my machine", "Legacy Code") anywhere.  
* **BitPet:** A virtual pet that follows your mouse, sleeps when idle, and eats when clicked.  
* **Music Player:** A draggable lo-fi beats player.  
* **Like System:** Interactive like buttons with confetti explosions and floating hearts.

### **🌍 Internationalization (i18n)**

* **Bilingual Support:** Instantly toggle between **English** and **German**.  
* **Deep Translation:** Translates UI labels, navigation, project titles, and content sections seamlessly.

## **🛠️ Tech Stack**

* **Core:** React.js (Hooks, Functional Components)  
* **Styling:** Tailwind CSS (Responsive, Glassmorphism, Gradients)  
* **Animation:** Framer Motion (Complex layout transitions, 3D transforms, Springs)  
* **Icons:** Lucide React  
* **Sound:** Web Audio API (Procedurally generated sound effects for clicks, pops, and interactions)

## **🚀 Quick Start**

1. **Clone the repository**  
   git clone \[https://github.com/yourusername/social-portfolio.git\](https://github.com/yourusername/social-portfolio.git)

2. **Install dependencies**  
   npm install  
   \# or  
   yarn install

3. **Run the development server**  
   npm start  
   \# or  
   yarn start

## **🕹️ Controls**

* **Top Left Menu:**  
  * **Theme Button:** Cycles through social media themes.  
  * **Lang (EN/DE):** Toggles language.  
  * **Code Icon:** Toggles "Developer Mode" (Matrix rain view showing raw JSON data).  
  * **Grip Icon:** Enables "Edit Mode" to drag and reorder sections vertically.  
  * **Pen Icon:** Activates Graffiti drawing mode.  
* **Project Hub:** Click the center button to expand/collapse the 3D orbit.  
* **BitPet:** Click to feed it\!

## **📝 Customization**

To personalize this portfolio, modify the constants at the top of index.html (or App.js):

1. **PROFILE**: Update avatar and cover images.  
2. **INITIAL\_SECTIONS**:  
   * **intro**: Name, handle, bio, and stats.  
   * **projects**: Add your own projects with titles, links, and icons.  
   * **experience / education**: Update your history.  
   * **skills**: Modify the tag list.  
3. **UI\_TRANSLATIONS**: Add or modify text for localization.

## **📄 License**

This project is open source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

*Created with ❤️ and a lot of caffeine by \[Warda Naeem\]*