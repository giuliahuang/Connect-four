FROM redis:6.2.4-alpine
ADD redis.conf /usr/local/etc/redis/redis.conf
CMD ["redis-server", "/usr/local/etc/redis/redis.conf", "--requirepass", "mypassword"]
EXPOSE 6379