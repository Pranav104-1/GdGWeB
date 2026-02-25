# GitHub Setup Instructions

Follow these steps to push your GdG Website to GitHub:

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the '+' icon in the top right corner
3. Select "New repository"
4. Name your repository: `GdG_Website`
5. Add description: "A modern website for Google Developer Group communities"
6. Choose "Public" (so others can see it)
7. Click "Create repository"
8. Copy the repository URL (HTTPS)

## Step 2: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Add Remote and Push

In your terminal, navigate to the project directory and run:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/GdG_Website.git

# Stage all files
git add .

# Commit the changes
git commit -m "Initial commit: Create GdG website with HTML/CSS/JS"

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages (Optional - for live website)

If you want your website to be live on the internet:

1. Go to your repository on GitHub
2. Click "Settings" (gear icon)
3. Scroll down to "GitHub Pages"
4. Select "main" as the source branch
5. Choose "/" (root) as the folder
6. Click "Save"
7. Your site will be live at: `https://YOUR_USERNAME.github.io/GdG_Website`

## Troubleshooting

### Error: "fatal: A git directory already exists"
The git repo is already initialized. Continue with Step 3.

### Error: "Permission denied (publickey)"
You need to set up SSH keys. Use HTTPS URL instead (as shown in Step 3).

### Error: "origin already exists"
Run: `git remote remove origin` then re-add it.

## Commands Reference

```bash
# Check status
git status

# View commit history
git log

# Create a new branch
git checkout -b feature-name

# Push updates after changes
git add .
git commit -m "Description of changes"
git push origin main
```

## Making Updates

After the initial push, always follow this workflow:

```bash
git add .
git commit -m "Brief description of changes"
git push origin main
```

## Next Steps

After pushing to GitHub:

1. **Share the link** with others
2. **Enable GitHub Pages** for a live website
3. **Add collaborators** if working with a team
4. **Create branches** for new features
5. **Write issues** to track improvements

## Tips

- Keep commit messages clear and descriptive
- Make regular commits as you make changes
- Use branches for experimental features
- Keep your repository clean and organized

---

**Need help?** Check out [GitHub's documentation](https://docs.github.com/en/get-started)
