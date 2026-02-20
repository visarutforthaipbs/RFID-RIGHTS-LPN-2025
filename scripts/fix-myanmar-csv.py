#!/usr/bin/env python3
import json, csv, re

# Load JSON
with open('data/myanmar_translations_2026-02-20.json', 'r') as f:
    data = json.load(f)
trans = data['translations']

# Category mapping
category_map = {
    1: trans['categories']['categoryDocuments']['myanmar'],
    2: trans['categories']['categoryDocuments']['myanmar'],
    3: trans['categories']['categoryDocuments']['myanmar'],
    4: trans['categories']['categoryWork']['myanmar'].strip(),
    5: trans['categories']['categoryWork']['myanmar'].strip(),
    6: trans['categories']['categoryWork']['myanmar'].strip(),
    7: trans['categories']['categoryWork']['myanmar'].strip(),
    8: trans['categories']['categoryFamily']['myanmar'],
    9: trans['categories']['categoryFamily']['myanmar'],
    10: trans['categories']['categoryFamily']['myanmar'],
    11: trans['categories']['categoryFamily']['myanmar'],
    12: trans['categories']['categoryFamily']['myanmar'],
}

# Load source CSV for law URLs
with open('data/source.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    source_rows = list(reader)

columns = [
    'အမျိုးအစား',
    'ချို့တဲ့ချက် / ချို့သောအကြောင်းအရာ',
    'အခွင့်အရေးပေးသည့်ဥပဒေ',
    'သင်၏အခွင့်အရေးများကို သိရှိပါ',
    'ချိုးဖောက်မှုလက္ခဏာများကို မည်သို့သိနိုင်မလဲ',
    'ကိုယ်တိုင်ကယ်နိုင်သောနည်းလမ်းများ',
    'ကိုးကားသည့်ဥပဒေ',
    'မှတ်ချက်',
]

def extract_myanmar(val):
    """Extract only the myanmar text from a dict value."""
    if isinstance(val, dict):
        return val.get('myanmar', '')
    return str(val)

new_rows = []
for i in range(1, 13):
    topic_title = trans['topic_titles'][f'topic_{i}']['myanmar']
    ct = trans[f'content_topic_{i}']

    law = extract_myanmar(ct[f't{i}_law_rights'])
    know = extract_myanmar(ct[f't{i}_know_rights'])
    observe = extract_myanmar(ct[f't{i}_observe'])
    self_help = extract_myanmar(ct[f't{i}_self_help'])

    src = source_rows[i - 1] if i - 1 < len(source_rows) else {}
    law_url = src.get('\u0e01\u0e0e\u0e2b\u0e21\u0e32\u0e22\u0e17\u0e35\u0e48\u0e2d\u0e49\u0e32\u0e07\u0e2d\u0e34\u0e07', '')
    note = src.get('remark', '')

    row = {
        'အမျိုးအစား': category_map[i],
        'ချို့တဲ့ချက် / ချို့သောအကြောင်းအရာ': topic_title,
        'အခွင့်အရေးပေးသည့်ဥပဒေ': law,
        'သင်၏အခွင့်အရေးများကို သိရှိပါ': know,
        'ချိုးဖောက်မှုလက္ခဏာများကို မည်သို့သိနိုင်မလဲ': observe,
        'ကိုယ်တိုင်ကယ်နိုင်သောနည်းလမ်းများ': self_help,
        'ကိုးကားသည့်ဥပဒေ': law_url,
        'မှတ်ချက်': note,
    }
    new_rows.append(row)

with open('data/myanmar-content.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=columns)
    writer.writeheader()
    writer.writerows(new_rows)

print(f"Wrote {len(new_rows)} rows")

# Verify
thai_pattern = re.compile(r'[\u0E01-\u0E7F]')
with open('data/myanmar-content.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

thai_found = False
for i, row in enumerate(rows):
    for col, val in row.items():
        if col in ['ကိုးကားသည့်ဥပဒေ', 'မှတ်ချက်']:
            continue
        if thai_pattern.search(val):
            thai_found = True
            matches = thai_pattern.findall(val)
            print(f"WARNING Row {i+1}, Col [{col[:30]}]: {len(matches)} Thai chars")

if not thai_found:
    print("SUCCESS: No Thai text in content columns!")

for i, r in enumerate(rows):
    topic = r['ချို့တဲ့ချက် / ချို့သောအကြောင်းအရာ'][:40]
    law_len = len(r['အခွင့်အရေးပေးသည့်ဥပဒေ'])
    know_len = len(r['သင်၏အခွင့်အရေးများကို သိရှိပါ'])
    obs_len = len(r['ချိုးဖောက်မှုလက္ခဏာများကို မည်သို့သိနိုင်မလဲ'])
    self_len = len(r['ကိုယ်တိုင်ကယ်နိုင်သောနည်းလမ်းများ'])
    print(f"  {i+1}. {topic} (law:{law_len}, know:{know_len}, obs:{obs_len}, self:{self_len})")
