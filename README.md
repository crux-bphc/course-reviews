# BPHC Course Reviews

# Configure Production Secrets

Create a file `launcher.sh` (chmod+x) in project root with contents as follows:

```sh
#!/bin/bash
export NODE_ENV=production
export GOOGLE_CLIENT_ID="<replace>"
export GOOGLE_CLIENT_SECRET="<replace>"
export LOGIN_CALLBACK="https://reviews.bphc.xyz/auth/google/callback" # Replace with actual callback URL.
export PORT=3000
echo "Node.js App starting in " $(pwd)
./bin/www
```

This will be used to launch the application in production.

# Systemd Service for Express Application

Assuming the user the service runs as is named `ubuntu`.

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

# Configure NGINX Reverse Proxy ( systemd )

Create a file `bphc-reviews-proxy.conf` in `/etc/nginx/conf.d`.

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
