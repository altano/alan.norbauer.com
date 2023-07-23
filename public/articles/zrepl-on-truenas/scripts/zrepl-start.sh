#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Enable the service
if [ ! -f /etc/rc.conf.d/zrepl ]
then
    touch /etc/rc.conf.d/zrepl
    sysrc -f /etc/rc.conf.d/zrepl zrepl_enable=YES
fi

# Symlink the service rc.d script
if [ ! -f /usr/local/etc/rc.d/zrepl ]
then
    ln -s ${SCRIPT_DIR}/zrepl.rc.d /usr/local/etc/rc.d/zrepl
    chmod +x /usr/local/etc/rc.d/zrepl
fi

# Symlink the zrepl.yml job file
mkdir -p /usr/local/etc/zrepl
if [ ! -f /usr/local/etc/zrepl/zrepl.yml ]
then
    ln -s ${SCRIPT_DIR}/zrepl.yml /usr/local/etc/zrepl/zrepl.yml
fi

# Start zrepl service
service zrepl start