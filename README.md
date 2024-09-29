
# Job Search Aggregator

A tool for aggregating job listings from various platforms, providing users with a centralized place to search and manage job postings.

## Project Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/levhakobyan/job-search-aggregator.git
   cd job-search-aggregator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

4. **Run Tests**
   To execute the test suite:
   ```bash
   npm test
   ```

## Deployment Instructions

### Custom Server Setup

1. **Build the Application for Production**
   ```bash
   npm run build
   ```

2. **Run with PM2 Using an `ecosystem.config.js` File**

   Create an `ecosystem.config.js` file in the root of your project:
   ```js
   module.exports = {
     apps: [
       {
         name: 'job-search-aggregator',
         script: 'npm',
         args: 'start',
         instances: 1,
         autorestart: true,
         watch: false,
         max_memory_restart: '1G',
         env: {
           NODE_ENV: 'production',
         },
       },
     ],
   };
   ```

   **Start the Application with PM2**
   ```bash
   pm2 start ecosystem.config.js
   ```

3. **View PM2 Process Status**
   ```bash
   pm2 status
   ```

4. **Restart or Stop the Application**
    - To restart the app:
      ```bash
      pm2 restart job-search-aggregator
      ```
    - To stop the app:
      ```bash
      pm2 stop job-search-aggregator
      ```

5. **Set up PM2 to Start on Boot**
   ```bash
   pm2 startup
   pm2 save
   ```

## Demo

[Live Demo](https://job-search-aggregator.hakobyan.live/) <!-- Add the demo URL here when available -->

---
