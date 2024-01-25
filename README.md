Welcome! For now this is a Spotify-only tool and it'll probably remain that way for a while.

This will essentially be a glorified playlist cleanup / diffing / combining tool.

# Changelog

## 0.20.2
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
  -  Header
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
