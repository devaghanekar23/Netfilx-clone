# Netflix Clone (React + Vite + TMDB API)

Responsive Netflix-style web app.

## Features
- Hero banner with a random trending title
- Category rows (Trending, Top Rated, TV, Action, Comedy, Horror, Romance, Documentaries) with arrow scrolling / swipe
- Click any title for details + YouTube trailer
- Search (movies and TV) with debounce
- My List saved in localStorage
- Fully responsive (mobile, tablet, desktop)

## 1. Get a TMDB API key
1. Create a free account at https://www.themoviedb.org
2. Go to Settings → API → create an API key (v3 auth)

## 2. Run locally
```bash
npm install
cp .env.example .env      # then paste your key in .env
npm run dev
```
Open http://localhost:5173

## 3. Build
```bash
npm run build             # output in dist/
```

## 4. Deploy on AWS

### Option A: S3 + CloudFront (recommended, simplest)
1. Create an S3 bucket (e.g. `netflix-clone-yourname`), keep it private.
2. Create a CloudFront distribution with the bucket as origin using **Origin Access Control (OAC)**; set default root object `index.html`.
3. In CloudFront → Error pages, map 403 and 404 to `/index.html` with response code 200.
4. Upload manually to test:
   ```bash
   aws s3 sync dist/ s3://YOUR_BUCKET --delete
   aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
   ```
5. For auto deploy, push to GitHub and add these repository secrets:
   `VITE_TMDB_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`.
   The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
6. Optional: custom domain via Route 53 / Hostinger DNS + ACM certificate (certificate must be in us-east-1 for CloudFront).

### Option B: Docker on EC2 (or ECS)
```bash
docker build --build-arg VITE_TMDB_API_KEY=your_key -t netflix-clone .
docker run -d -p 80:80 netflix-clone
```
Or with compose: put `VITE_TMDB_API_KEY=...` in `.env` and run `docker compose up -d --build`.
Open port 80 in the EC2 security group.

> Note: Vite embeds env variables at build time, so the TMDB key will be visible in the browser bundle. This is normal for TMDB's free read-only keys.

## Project structure
```
src/
  api.js            TMDB calls + categories
  App.jsx           page layout and state
  hooks/useMyList.js
  components/       Navbar, Banner, Row, MovieCard, Grid, SearchResults, MovieModal, Footer
  styles.css        all styling + responsive rules
```
