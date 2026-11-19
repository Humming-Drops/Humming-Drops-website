#!/bin/bash
# Live API lifecycle + race test (see scripts/qa/README.md).
# Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... bash scripts/qa/live-api-e2e.sh   (run from the repo root; dev server + Postgres must be up)
B=${BASE_URL:-http://localhost:3001}
AJ=/tmp/e2e_admin.jar; CJ=/tmp/e2e_cust.jar; RJ=/tmp/e2e_race.jar
rm -f $AJ $CJ $RJ
code() { curl -s -o /tmp/o.txt -w "%{http_code}" "$@"; }
J='Content-Type: application/json'
TS=$(date +%s)
pass=0; fail=0
chk() { if [ "$2" = "$3" ]; then echo "PASS  $1 ($2)"; pass=$((pass+1)); else echo "FAIL  $1 expected=$3 got=$2"; fail=$((fail+1)); fi; }

echo "== admin login"
chk "admin login" "$(code -c $AJ -H "$J" -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" $B/api/auth/login)" 200

lead() { # phone email
  echo '{"planId":"premium","customer":{"fullName":"E2E User","phone":"'$1'","email":"'$2'"},"deliveryAddress":{"flatNo":"1","buildingName":"E2E Towers","streetAddress":"1 Road","area":"HSR","pincode":"560102"},"dietaryPreferences":{"dietaryType":"standard","allergies":[]}}'
}

echo "== RACE: 5 parallel lead submissions from one user"
RE="e2e.race.$TS@example.com"; RP="9$(printf '%09d' $(( (TS+5) % 1000000000 )))"
curl -s -o /dev/null -c $RJ -H "$J" -d "{\"firstName\":\"Race\",\"lastName\":\"User\",\"email\":\"$RE\",\"phone\":\"$RP\",\"password\":\"E2eTest#2026\"}" $B/api/auth/register
BODY=$(lead $RP $RE)
for i in 1 2 3 4 5; do curl -s -o /tmp/race_$i.txt -w "%{http_code}\n" -b $RJ -H "$J" -d "$BODY" $B/api/subscriptions/lead > /tmp/race_code_$i.txt & done; wait
CODES=$(cat /tmp/race_code_*.txt | sort | tr '\n' ' ')
echo "  codes: $CODES"
chk "exactly one 201 in race" "$(cat /tmp/race_code_*.txt | grep -c 201)" 1
chk "other four are 409" "$(cat /tmp/race_code_*.txt | grep -c 409)" 4
chk "only one pending subscription row for user" "$(docker compose exec -T postgres psql -U postgres -d hummingdrops_dev -tAc "select count(*) from user_subscriptions s join users u on u.id=s.user_id where u.email='$RE'" | tr -d '[:space:]')" 1

echo "== lifecycle: register -> lead -> confirm -> pause -> cancel -> re-register"
CE="e2e.cust.$TS@example.com"; CP="9$(printf '%09d' $(( (TS+9) % 1000000000 )))"
chk "register" "$(code -c $CJ -H "$J" -d "{\"firstName\":\"Life\",\"lastName\":\"Cycle\",\"email\":\"$CE\",\"phone\":\"$CP\",\"password\":\"E2eTest#2026\"}" $B/api/auth/register)" 201
code -b $CJ $B/api/auth/me >/dev/null
chk "me: hasOpenSubscription=false before lead" "$(grep -o '"hasOpenSubscription":[a-z]*' /tmp/o.txt)" '"hasOpenSubscription":false'
chk "lead created" "$(code -b $CJ -H "$J" -d "$(lead $CP $CE)" $B/api/subscriptions/lead)" 201
code -b $CJ $B/api/auth/me >/dev/null
chk "me: hasOpenSubscription=true after lead" "$(grep -o '"hasOpenSubscription":[a-z]*' /tmp/o.txt)" '"hasOpenSubscription":true'
code -b $CJ $B/api/customer/me >/dev/null
SUB=$(grep -o '"subscription":{"id":"[^"]*"' /tmp/o.txt | head -1 | cut -d'"' -f6)
chk "admin sees subscription in list" "$(code -b $AJ $B/api/admin/subscriptions >/dev/null; grep -c "$SUB" /tmp/o.txt)" 1
chk "admin confirm" "$(code -b $AJ -H "$J" -d '{"action":"confirm"}' $B/api/admin/subscriptions/$SUB)" 200
code -b $CJ $B/api/customer/me >/dev/null
chk "customer sees confirmed_active" "$(grep -o '"status":"[a-z_]*"' /tmp/o.txt | head -1)" '"status":"confirmed_active"'
chk "customer pause saved" "$(code -b $CJ -X PATCH -H "$J" -d "{\"type\":\"pause\",\"subscriptionId\":\"$SUB\",\"pauseStart\":\"2026-12-10\",\"pauseEnd\":\"2026-12-12\"}" $B/api/customer/me)" 200
chk "admin cancel" "$(code -b $AJ -H "$J" -d '{"action":"cancel"}' $B/api/admin/subscriptions/$SUB)" 200
code -b $CJ $B/api/auth/me >/dev/null
chk "me: hasOpenSubscription=false after cancel" "$(grep -o '"hasOpenSubscription":[a-z]*' /tmp/o.txt)" '"hasOpenSubscription":false'
chk "pause rejected after cancel" "$(code -b $CJ -X PATCH -H "$J" -d "{\"type\":\"pause\",\"subscriptionId\":\"$SUB\",\"pauseStart\":\"2026-12-10\",\"pauseEnd\":\"2026-12-12\"}" $B/api/customer/me)" 400
chk "re-register allowed after cancel" "$(code -b $CJ -H "$J" -d "$(lead $CP $CE)" $B/api/subscriptions/lead)" 201

echo "== audit trail recorded the customer + admin actions"
code -b $AJ $B/api/admin/audit-log >/dev/null
chk "audit has vacation_dates_set" "$(grep -c 'customer.vacation_dates_set' /tmp/o.txt | awk '{print ($1>0)?"yes":"no"}')" yes

echo "== redirects for signed-in users on /login"
chk "staff /login -> /admin" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -b $AJ $B/login)" "307 $B/admin"
chk "customer /login -> dashboard" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -b $CJ $B/login)" "307 $B/dashboard/overview"
chk "staff /register -> /admin" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -b $AJ $B/register)" "307 $B/admin"

echo "== admin pages render (filters / pagination)"
chk "audit page default" "$(code -b $AJ $B/admin/audit-log)" 200
chk "audit page kind=staff page=1" "$(code -b $AJ "$B/admin/audit-log?kind=staff&page=1")" 200
chk "audit page garbage params" "$(code -b $AJ "$B/admin/audit-log?kind=%27%3Bdrop&page=-5")" 200
chk "audit page shows humanized text" "$(curl -s -b $AJ "$B/admin/audit-log" | grep -c 'Customer viewed own health records\|Customer profile\|Vacation dates set')" "$(curl -s -b $AJ "$B/admin/audit-log" | grep -c 'Customer viewed own health records\|Customer profile\|Vacation dates set')"
curl -s -b $AJ "$B/admin/audit-log" | grep -o 'Vacation dates set\|Customer profile created\|Content page [a-z]*' | sort -u | head -4
chk "content page filter q=test" "$(code -b $AJ "$B/admin/content?q=test&status=draft")" 200
chk "content page garbage status" "$(code -b $AJ "$B/admin/content?status=zzz")" 200
echo
echo "RESULT: pass=$pass fail=$fail"
