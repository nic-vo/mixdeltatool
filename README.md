Welcome! For now this is a Spotify-only tool and it'll probably remain that way for a while.

This will essentially be a glorified playlist cleanup / diffing / combining tool.

# Changelog
(the commit history sucks because this started out as an experiment)

## 0.12.0
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
