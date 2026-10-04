# BlueTeam Hub
Blue team alətləri (Wazuh, Grafana, Zabbix, OpenCTI, iLO, Kerio, MikroTik …) üçün tək veb panel.
- Hər alət üçün URL / istifadəçi / parol-API açarı (AES-256-GCM ilə şifrələnir, `data/.key`)
- Dashboard-da online/offline statusu, Docker start/stop/restart/log, Telegram bildirişi

## Quraşdırma
    git clone https://github.com/Isa-Isgandarov/blueteam-hub.git && cd blueteam-hub
    sudo ./install.sh
İlk açılışda admin parolunu yaradın. Defolt olaraq yalnız `127.0.0.1:3000`-də dinləyir.
Uzaqdan giriş: `ssh -L 3000:127.0.0.1:3000 user@server` və ya nginx reverse proxy + HTTPS
(HTTPS-də `SECURE_COOKIE=1` mühit dəyişənini systemd faylına əlavə edin).

## Təhlükəsizlik
`data/` qovluğunu backup edin, git-ə əlavə etməyin (`.gitignore`-da var).
