# EduManage — Student Management System

A responsive student management website built with HTML, CSS and vanilla JavaScript. It is designed to publish directly on **GitHub Pages**.

## Features
- Dashboard with student statistics
- Add, edit and delete student records
- Search by student name, email, course or ID
- Filter by active/inactive status
- Export student records as CSV
- Responsive beige and brown design
- Browser local storage (records stay in the same browser)

## Files
- `index.html` — website structure
- `style.css` — design and responsive layout
- `script.js` — app functionality
- `.nojekyll` — tells GitHub Pages not to run Jekyll processing

## Publish on GitHub Pages

1. Create a **public** GitHub repository, for example `edumanage-student-system`.
2. Upload all four project files to the **root** of the repository (not inside another folder).
3. Open the repository's **Settings**.
4. Select **Pages** from the left sidebar.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch **main** and folder **/(root)**, then click **Save**.
7. Wait a few minutes. Your site URL will look like:
   `https://YOUR-USERNAME.github.io/edumanage-student-system/`

## Run on your computer
Double-click `index.html` to open it in a browser. No Python installation or build step is required.

## Important data note
This demo stores records in browser `localStorage`. Data is local to that browser/device and is not a secure shared database. Do not enter sensitive personal information or real confidential student records. Clearing browser data can erase saved records.

## License
MIT
