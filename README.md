# BlueTeam Hub
Blue team alətləri üçün tək veb panel. Hər menyu `modules/` altında ayrı qovluqdadır.

## Quraşdırma / yeniləmə
    git clone https://github.com/Isa-Isgandarov/blueteam-hub.git && cd blueteam-hub
    sudo bash install.sh
Uzaqdan baxmaq: `ssh -L 3000:127.0.0.1:3000 istifadeci@server_ip` → brauzerdə http://localhost:3000

## Qovluq quruluşu
- `modules/wazuh1, wazuh2, grafana, zabbix, opencti, integration, ilo, kerio, mikrotik` — alət menyuları
- `modules/dashboard, docker, notification` — xüsusi menyular
- `modules/_sablon` — yeni menyu üçün nümunə (içindəki izaha bax)
- `core/` — ortaq hissə (şifrələmə, giriş), toxunmayın
Hər faylın başında Azərbaycan dilində izah var. Menyu silmək: qovluğu silin → `sudo systemctl restart blueteam-hub`.
