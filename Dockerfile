###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM public.ecr.aws/docker/library/node:20.9.0-alpine As development
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV python /usr/bin/python3
# Create app directory
WORKDIR /usr/src/app

RUN apk add --update --no-cache \
python3 \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake
# Set environment variable for Python

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci -f

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM public.ecr.aws/docker/library/node:20.9.0-alpine  As build
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV python /usr/bin/python3

WORKDIR /usr/src/app

RUN apk add --update --no-cache \
    python3 \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake
# Set environment variable for Python


COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci -f --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM public.ecr.aws/docker/library/node:20.9.0-alpine As production
# Set environment variable for Python
ENV python /usr/bin/python3

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    python3 \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Puppeteer v13.5.0 works with Chromium 100.
RUN yarn add puppeteer@13.5.0

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/public ./public
COPY --chown=node:node --from=build /usr/src/app/public ./home/ubuntu/code/Main/main/public
COPY --chown=node:node --from=build /usr/src/app/public ./home/node/code/Main/main/public

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
