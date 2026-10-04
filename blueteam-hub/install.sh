#!/usr/bin/env bash
# İstifadə: sudo ./install.sh   (Ubuntu/Debian)
set -euo pipefail
[ "$EUID" -eq 0 ] || { echo "root ilə işlədin"; exit 1; }
DIR=/opt/blueteam-hub
apt-get update -y && apt-get install -y curl rsync ca-certificates
command -v node >/dev/null && [ "$(node -v | cut -c2-3)" -ge 18 ] || { curl -fsSL https://deb.nodesource.com/setup_20.x | bash -; apt-get install -y nodejs; }
id bthub &>/dev/null || useradd -r -s /usr/sbin/nologin bthub
getent group docker >/dev/null && usermod -aG docker bthub   # Docker idarəsi üçün
mkdir -p $DIR && rsync -a --exclude data --exclude node_modules ./ $DIR/
cd $DIR && npm install --omit=dev
mkdir -p data && chown -R bthub:bthub $DIR && chmod 700 data
cat > /etc/systemd/system/blueteam-hub.service <<UNIT
[Unit]
Description=BlueTeam Hub
After=network.target docker.service
[Service]
User=bthub
WorkingDirectory=$DIR
Environment=HOST=127.0.0.1 PORT=3000
ExecStart=/usr/bin/node server.js
Restart=always
NoNewPrivileges=true
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload && systemctl enable --now blueteam-hub
echo "Hazırdır: http://127.0.0.1:3000 (uzaqdan giriş üçün nginx + HTTPS və ya SSH tunnel istifadə edin)"
