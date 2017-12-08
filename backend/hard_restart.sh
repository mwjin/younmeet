kill -9 `pidof uwsgi` && sudo /etc/init.d/nginx restart && uwsgi --ini younmeet_uwsgi.ini
