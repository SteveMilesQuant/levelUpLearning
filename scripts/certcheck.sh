docker run --rm --env-file ~/lul.env -v "/usr/local/nginx/conf/leveluplearningnc.com:/etc/letsencrypt" --user $(id -u):$(id -g) lul-email python3 ./certcheck.py
