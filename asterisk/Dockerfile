
FROM andrius/asterisk:22

USER root

RUN apt-get update && apt-get install -y --no-install-recommends gettext-base netcat-openbsd procps

# Install ODBC and MariaDB ODBC driver
RUN apt-get install -y --no-install-recommends unixodbc odbcinst odbc-mariadb && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
