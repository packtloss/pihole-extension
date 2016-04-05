Quick and Dirty chrome Extenstion and API for PiHole.

Code is messy and proof of concept. I'll update if there is interest.

1. Put server/apiext.php on your pihole server. (Ie. /var/www/html/admin/)
2. Edit apiext.php for your paths (if non-default) and change the apikey (default is 123456789)
3. Edit /etc/sudoers (as root), Adding (3 lines) to the end. (assumes www-data is your webserver user):

```
User_Alias WWW_USER = www-data
Cmnd_Alias WWW_COMMANDS = /usr/local/bin/pihole
WWW_USER ALL = (ALL) NOPASSWD: WWW_COMMANDS
```
This allows webserver user to execute the white/black/gravity scripts without being root. I couldn't think of an 'easier' way.

4. Install chrome extension. (use developer mode for now...)
5. Set chrome extension options - add url to apiext.php and your api key.

Now you can add/remove/edit your whitelist and blacklist.





