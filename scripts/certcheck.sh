CHECK_DISK_PCT=$(df --output=pcent / | tail -n 1 | tr -dc '0-9')
docker run --rm --env-file ~/lul.env -e CHECK_DISK_PCT="$CHECK_DISK_PCT" -v "/usr/local/nginx/conf/leveluplearningnc.com:/etc/letsencrypt" --user $(id -u):$(id -g) lul-email python3 ./certcheck.py
