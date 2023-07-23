#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
DB_DIR=${SCRIPT_DIR}/db

# If you are running other daemons or require firewall rules to depend on
# zerotier interfaces being available at startup, you may need to uncomment
# the following line.
#
# This avoids a race condition where zerotier interfaces are created, but
# not up, prior to firewalls and services trying to use them.
#
# sysctl net.link.tap.up_on_open=1

# Remove the zerotier_enable rc.conf entry if you already
# have it. This will be set by our start script, as zerotier
# might start before the mountpoint is available, making
# zerotier create new keys at each boot. This is prevented by
# only enabling the service after the mountpoint is available.
if [ ! -f /etc/rc.conf.d/zerotier ]
then
    touch /etc/rc.conf.d/zerotier
    sysrc -f /etc/rc.conf.d/zerotier zerotier_enable=YES
fi

if [ ! -f /usr/local/etc/rc.d/zerotier ]
then
    ln -s ${SCRIPT_DIR}/zerotier.rc.d /usr/local/etc/rc.d/zerotier
    chmod +x /usr/local/etc/rc.d/zerotier
fi

# Stop zerotier so we can modify the db directory location
service zerotier stop

# Use the zfs pool to store the db (to survive reboots)
mkdir -p ${DB_DIR}
mkdir -p /var/db/zerotier-one
/sbin/mount_nullfs ${DB_DIR} /var/db/zerotier-one

# Start zerotier service
service zerotier start