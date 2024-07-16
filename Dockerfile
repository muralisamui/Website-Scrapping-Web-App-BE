# FROM ghcr.io/puppeteer/puppeteer:22.13.0

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# CMD [ "node", "dist/main.js" ]

FROM ghcr.io/puppeteer/puppeteer:22.13.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy package files and set correct permissions
COPY package*.json ./
RUN chown -R pptruser:pptruser /usr/src/app

# Switch to non-root user
USER pptruser

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY --chown=pptruser:pptruser . .

# Build the application
RUN npm run build

CMD [ "node", "dist/main.js" ]
