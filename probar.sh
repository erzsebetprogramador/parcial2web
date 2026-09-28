#!/usr/bin/env bash
# Prueba rápida de los endpoints. Requiere el servidor corriendo en :3000
B="http://localhost:3000/api/v1"
H="Authorization: Bearer demo"

echo "== 1. Todas las tareas";        curl -s -H "$H" "$B/tareas"; echo
echo "== 2. Filtrar pendientes";      curl -s -H "$H" "$B/tareas?estado=pendiente"; echo
echo "== 3. Una tarea";               curl -s -H "$H" "$B/tareas/t-1024"; echo
echo "== 4. Marcar completada";       curl -s -X PATCH -H "$H" -H "Content-Type: application/json" -d '{"estado":"completado"}' "$B/tareas/t-1024"; echo
echo "== Error 400 (estado inválido)";curl -s -H "$H" "$B/tareas?estado=xyz"; echo
echo "== Error 404";                  curl -s -H "$H" "$B/tareas/t-9999"; echo
echo "== Error 422";                  curl -s -X PATCH -H "$H" -H "Content-Type: application/json" -d '{"estado":"pendiente"}' "$B/tareas/t-1030"; echo
echo "== Error 401";                  curl -s "$B/tareas"; echo
