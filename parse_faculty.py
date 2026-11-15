import os, re

files = [
    "faculty-gurumurthy.html",
    "faculty-muniraja.html",
    "faculty-sunil.html",
    "faculty-sushmitha.html",
    "faculty-geetha.html",
    "faculty-dawood.html",
]

for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        c = f.read()
    m_name = re.search(r'<h2 class="fac-name"[^>]*>([^<]+)</h2>', c)
    m_badge = re.search(r'<span class="badge badge-info"[^>]*>([^<]+)</span>', c)
    m_meta = re.findall(r'<li><i class="[^"]*"></i>\s*<span>(.*?)</span></li>', c)
    m_content = re.search(r'<div class="profile-main-content">([\s\S]*?)</div>\s*</div>\s*</div>', c)
    
    name = m_name.group(1).strip() if m_name else fn
    badge = m_badge.group(1).strip() if m_badge else ""
    print(f"=== {fn} -> {name} ({badge}) ===")
    print("Meta:", m_meta)
    if m_content:
        # print headings inside content
        headings = re.findall(r'<h3[^>]*>([\s\S]*?)</h3>', m_content.group(1))
        print("Sections:", [re.sub(r'<[^>]+>', '', h).strip() for h in headings])
