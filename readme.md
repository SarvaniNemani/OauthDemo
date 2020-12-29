OAUTH:
--   https://appitchat.slack.com/archives/D01FPDJAP36/p1608615891004300

--   https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps

STEP 1: client_id and redirect_uri

code param is generated. it will expire in 10 min

STEP 2: redirect route with code, client_id, client_secret param

generates access_token

POST https://github.com/login/oauth/access_token

STEP 3: use the access token to access API


