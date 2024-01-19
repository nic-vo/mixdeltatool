Welcome! For now this is a Spotify-only tool and it'll probably remain that way for a while.

This will essentially be a glorified playlist cleanup / diffing / combining tool.

# Changelog
(the commit history sucks because this started out as an experiment)

## 0.7.0
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

### 0.3.0 ???
  - Implement timeout functionality for all routes

### 0.2.0
  - Begin to reduce the amount of data returned to user from Spotify API through the handler
  - Begin to compartmentalize state related to playlists

### 0.1.0
  - Initial commit
  - Next-auth + small modifications to the signIn flow to allow for API interaction
