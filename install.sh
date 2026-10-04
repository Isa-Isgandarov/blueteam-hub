#!/usr/bin/env bash
# ===== QURAŞDIRMA SKRİPTİ =====
# Nə edir: Node.js qurur, layihəni /opt/blueteam-hub qovluğuna köçürür, systemd xidməti kimi işə salır.
# İstifadə: sudo bash install.sh   (yeniləmə üçün də eyni əmr; data/ qovluğuna toxunmur)
set -euo pipefail
DIR=/opt/blueteam-hub
apt-get update -y && apt-get install -y curl rsync ca-certificates
command -v node >/dev/null && [ "$(node -v | cut -c2-3)" -ge 18 ] || { curl -fsSL https://deb.nodesource.com/setup_20.x | bash -; apt-get install -y nodejs; }
id bthub &>/dev/null || useradd -r -s /usr/sbin/nologin bthub
getent group docker >/dev/null && usermod -aG docker bthub
mkdir -p $DIR && rsync -a --exclude data --exclude node_modules --exclude .git ./ $DIR/
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
systemctl daemon-reload && systemctl enable blueteam-hub && systemctl restart blueteam-hub
echo "Hazırdır: http://127.0.0.1:3000"
