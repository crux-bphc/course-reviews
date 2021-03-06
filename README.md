# BPHC Course Reviews

The application is a simple Express.JS app. Database is SQLite3. Auth is provided by Passport.js

# Production Deployment

Assuming the app is deployed at `/home/ubuntu/cfb`

## Configure Launcher and Production Secrets

Create a file `launcher.sh` (chmod+x) in project root with contents as follows:

```sh
#!/bin/bash
export NODE_ENV=production # Comment this line to enable dev-mode.
export GOOGLE_CLIENT_ID="<replace>"
export GOOGLE_CLIENT_SECRET="<replace>"
export LOGIN_CALLBACK="https://reviews.bphc.xyz/auth/google/callback" # Replace with actual callback URL.
export PORT=3000
export ADMIN_USERS="[user@domain.com,john@gmail.com]" # List of admin emails, comma separated

echo "Node.js App starting in " $(pwd)
./bin/www
```

This will be used to launch the application in development, as well as production.

## Systemd Service for Express Application

Assuming the user the service runs as is named `ubuntu`, create the following service file and save it as `/lib/systemd/system/bphc-course-reviews.service`:

```
[Unit]
Description=BPHC Course Reviews website
After=network.target

[Service]
Environment=NODE_PORT=3000
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/cfb
ExecStart=/usr/bin/bash /home/ubuntu/cfb/launcher.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Configure NGINX Reverse Proxy ( systemd )

First, install NGINX using `sudo apt install nginx`. Create a file `bphc-reviews-proxy.conf` in `/etc/nginx/conf.d`.

In it, write:

```
server {
    listen 80;
    server_name bphc.xyz www.bphc.xyz reviews.bphc.xyz;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         http://127.0.0.1:3000;
    }
}
```

Then, run `systemctl daemon-reload` and then `systemctl enable nginx` and then `systemctl start nginx` ( as root ).

# License

This software is licensed under GNU Affero General Public License v3.0 or later.
