import sys

sys.path.insert(0, "/Users/zhangpeng/workspace/liaohe/Spotlight/backend")

from app.domain.services.log_format import parse_log_line

for i in range(3):
    print(i, repr(parse_log_line("tick-20", "")))
print("with ts:", repr(parse_log_line("2026-10-20T03:45:12.123456Z stdout F tick-20", "")))
