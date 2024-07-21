# MixDelta tool for Spotify playlist managmenet

Welcome! For now this is a Spotify-only tool and it'll probably remain that way for a while.

Spotify is my primary choice for music streaming. I maintain a master playlist and several smaller playlists that are subsets of that master playlist. These sub-playlists must only contain tracks that are in the master playlist; if the master doesn't have a track, it can't exist on a sub-playlist. Typically, all these playlists are fairly large (>200 tracks).

I change my master playlist a lot, and I don't typically know which of the sub-playlists contain tracks I remove from the master, so I created this tool to easily diff and compare my playlists. Hopefuly this is useful for you, too.

You can either use [the live version](https://mixdeltatool.vercel.app) or clone this repo and run it locally. This project **does** require several .env variables, specifically for the auth functionality, so make sure to search for 'process.env' to find the ones you need.

## Changelog

### 1.0.0 -

- Simplify tailwind parsing with tailwind-merge
- Metadata
- Final hydration error workaround

### 0.27.0 - Pre-release

- Move from pages to app router
- Significantly improve code modularity
- Streamline auth flow
  - Handle access token refresh gracefully
  - ACID many db transactions
- Tailwindify everything

### 0.26.1

- Alter footer layout
- Add panel for action type in review stage of differ

### 0.26.0

- Unite differ form stages / previews
- Add review stage
- Clean up mobile styling a little bit
- Control some form inputs

### 0.25.1

- Adjust playlist sanitization
- Add reduce animation toggle to tool
- Fix IP logic and rl all relevant routes

### 0.25.0

- Adapt component tree to Redux
  - Replace useRef with useState in specificAdder
  - Remove useMemo in playlist displays since Redux is sliced
  - Refactor DifferForm
    - Each stage has its own component to update redux
    - Simplify form submission logic
  - Remove useMemo in options displays since Redux is sliced
  - When diff completes, display new playlist in PendingWindow

### 0.24.0

- Reduce promise boilerplate
- Make async/await approach more consistent
- Implement thumbnail persistence
- Define redux store

### 0.23.2

- Auth flow patch and bugfix

### 0.23.1

- Simplify login flow

### 0.23.0

- Switch to yarn

### 0.22.2

- Fix incorrect imports for sanitization
- Add dev stuff for bundle analysis

### 0.22.1

- Add \_document to fix a small SEO issue
- Reduce the size on some copy

### 0.22.0

- Add terms page
- Attempt to reduce bundle size

### 0.21.0

- Narrow CORS scope dramatically
- Fix issues with adder heading
- Fix various copy issues
- Fix global loading status bug

### 0.20.3

- Fix serverside sanitization issue

### 0.20.2

- Address CORS issues with page revalidation

### 0.20.1

- Move homepage revalidation to correct location

### 0.20.0

- Simplify route names
- Reduce rate limiting boilerplate

### 0.19.0

- Switch routers to buttons just in case of accessibility

### 0.18.0

- Disable specific ESLint stuff
- Fix privacy policy copy

### 0.17.0

- Add animated logo variation
- Make differ disclaimer more apparent
- Add contact info to relevant area in privacy policy

### 0.16.0

- API Routes
  - Add rate limiting
  - createDiffPlaylist
    - Clarify return messages

### 0.15.0

- API Routes
  - Modify a few promises
  - Simplify parsers so that unnecessary keys get stripped
  - createDiffPlaylist
    - Allow user to customize name
    - Upload logo
    - Allow for slight variation based on object type when getting from Spotify API
- Contexts
  - Add global loading state to relevant contexts
- Turn larger components in the Adder tree to layouts
  - Separation between controls interacting with contexts and playlist display
- Differ Form
  - Make the form multi-stage
  - Add interactive progress bar

### 0.14.0

- Privacy Policy
  - Update contact info
  - Escape HTML entities
  - Use consts
  - Add IP address stipulation
- Home
  - Add good copy
  - Add global status indicator
  - Add minor styling

### 0.13.0

- Header
- Improve button styling / responsiveness
- Fix focus / blur issues
- Global
  - Styling adjustments for `body`
  - Some default styling for text elements
  - Add global color palette
  - Add global button `\[disabled\]` styling + more
- Make Spotify page more of a layout
- MongoDB
  - Change mongoose schemas to the correct types to fix linting
  - Add models for global status and contact form

### 0.12.0

- Simplify some consts
- Add global `canvas` background and FPS limit it
- Modify Spotify OAuth scopes
- Clarify EUA language and add links

### 0.11.0

- Separate playlist lists from parent
- Separate differ styling from adder's styling entirely

### 0.10.0

- Implement very basic rate limiting via Redis (a drop-in promise for routes)
- Implement account deletion dialog
- Implement universal clear playlist button
- Implement route to update global status
- Implement contact form

### 0.9.0

- Abstract differ logic to a context so it persists when the view changes
- Differ form now just consumes and updates context by rotating inputs
- Move the pending state of the diff operation to its own component
- Add global loading state that anything can trigger to prevent actions globally

### 0.8.0

- Implement basic footer
- Implement base logo for animation
- Implement animated logo
- Implement component to display status of the various getters
- Implement component to display a global service status
- Implement component to handle image loading

### 0.7.0

- Add some static assets
- Remove tRPC
- Prepare for rate limiting with redis

### 0.6.0

- Add background
- Improve styling
- Rewrite API to race promises following clarification of how promises handle exceptions

### 0.5.0

- Add EUA
- Add privacy policy
- Continue styling

### 0.4.0

- Begin styling
- Implement delete account info feature
- Sanitize certain data
- Cleanup route flow and error handling

### 0.3.0

- Implement timeout functionality for all routes

### 0.2.0

- Begin to reduce the amount of data returned to user from Spotify API through the handler
- Begin to compartmentalize state related to playlists

### 0.1.0

- Initial commit
- Next-auth + small modifications to the signIn flow to allow for API interaction
