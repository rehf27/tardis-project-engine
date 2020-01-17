#!/bin/sh

exec curl --fail http://localhost:${APP_PORT}/ping
