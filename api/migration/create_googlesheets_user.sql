CREATE USER 'googlesheets'@'%' IDENTIFIED BY 'strong_password_here';
GRANT SELECT ON lul.* TO 'googlesheets'@'%';
GRANT SHOW VIEW ON lul.* TO 'googlesheets'@'%';
FLUSH PRIVILEGES;

