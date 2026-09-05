# website
Personal website and portfolio of Abhrankan Chakrabarti — projects, writing, and current work.

## Lab API

The site includes a small public API service for health checks, application metadata,
mathematical computations, and authenticated snapshots. See [API.md](API.md) for
complete endpoint documentation, examples, and deployment details.

## crypto-lab

The Lab page also includes a small frontend for the separate `crypto-lab` service.
It uses the public health and API information endpoints and prompts for Basic Auth
credentials only when calling protected hash and HMAC operations. Credentials are
not stored by the page.

The static site expects Nginx to proxy `/crypto-api/` to `127.0.0.1:8089`, with the
health and information routes left public and operation routes protected:

```nginx
location = /crypto-api/health {
	proxy_pass http://127.0.0.1:8089/health;
}

location = /crypto-api/v1/info {
	proxy_pass http://127.0.0.1:8089/v1/info;
}

location /crypto-api/ {
	auth_basic "crypto-lab";
	auth_basic_user_file /etc/nginx/.htpasswd;
	proxy_pass http://127.0.0.1:8089/;
}
```

Deploy the updated static files to the existing website root, then reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
