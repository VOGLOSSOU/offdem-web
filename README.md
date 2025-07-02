Offdem - Website Blocker Extension
Overview
Offdem is a browser extension that helps improve focus by blocking distracting websites for a specified duration. Once a site is blocked, it cannot be accessed until the blocking period expires.
Features

Block websites for a specified duration (minutes or hours)
Simple, modern UI for adding sites to block
Motivation messages when attempting to access blocked sites
No option to remove sites before the blocking period expires
Persistence across browser restarts

Installation
Chrome/Edge

Download or clone this repository
Open Chrome/Edge and navigate to chrome://extensions/
Enable "Developer mode" in the top-right corner
Click "Load unpacked" and select the folder containing the extension files
The Offdem extension will appear in your browser toolbar

Firefox

Download or clone this repository
Open Firefox and navigate to about:debugging#/runtime/this-firefox
Click "Load Temporary Add-on" and select the manifest.json file from the extension folder
The Offdem extension will appear in your browser toolbar

How to Use

Click on the Offdem icon in your browser toolbar
Enter the domain of the website you want to block (e.g., facebook.com, youtube.com)
Set the duration for which you want to block the site
Choose between minutes or hours as the time unit
Click "Block Website"
The site will now be blocked for the specified duration
If you try to access the blocked site, you'll see a motivation message instead

File Structure

manifest.json: Configuration file for the extension
popup.html: User interface for the extension popup
popup.js: Script handling the popup logic
background.js: Background script for monitoring and blocking sites
content.js: Content script for replacing blocked site content
icons/: Directory containing extension icons

Notes

You cannot unblock a site before the specified duration expires
The extension will continue to block sites even if you restart your browser
All data is stored locally, no internet connection is required
Compatible with Chrome, Edge, and Firefox

Development
To modify the extension:

Make your changes to the files
Reload the extension in your browser
Test your changes

For styling, the extension uses Tailwind CSS via CDN.
License
This project is open source and available for anyone to use and modify.