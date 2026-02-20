#!/usr/bin/env python3
"""Update scenarios.ts with Myanmar translations from new JSON."""
import json, re

# Load the new translations
with open('data/my_translations_2026-02-21.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

scenarios = data['translations']['scenarios']

# Read scenarios.ts
with open('lib/scenarios.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Map JSON keys to scenario IDs
# Keys in JSON: scenario_new_worker_title, scenario_new_worker_desc, etc.
key_map = {
    'scenario_new_worker': 'new-worker',
    'scenario_workplace': 'workplace-problem',
    'scenario_document': 'document-expiring',
    'scenario_family': 'family-issues',
    'scenario_health': 'healthcare',
    'scenario_community': 'community-life',
    'scenario_emergency': 'emergency-help',
    'scenario_rights': 'legal-rights',
}

for json_key, scenario_id in key_map.items():
    entry = scenarios.get(json_key + '_title', {})
    title_my = entry.get('my', '').strip().replace('\n', ' ')

    # Get description from _desc variant
    desc_entry = scenarios.get(json_key + '_desc', {})
    desc_my = desc_entry.get('my', '').strip().replace('\n', ' ')
    # Normalize whitespace in desc
    desc_my = re.sub(r'\s+', ' ', desc_my)

    if title_my:
        # Replace titleMm for this scenario
        pattern = r'(id:\s*"' + re.escape(scenario_id) + r'".*?titleMm:\s*)"[^"]*"'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            content = content[:match.start(1)] + match.group(1) + '"' + title_my + '"' + content[match.end():]
            print(f'{scenario_id} titleMm: {title_my[:40]}')

    if desc_my:
        # Replace descriptionMm - handle multiline quoted strings
        pattern = r'(id:\s*"' + re.escape(scenario_id) + r'".*?descriptionMm:\s*\n?\s*)"[^"]*"'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            content = content[:match.start(1)] + match.group(1) + '\n      "' + desc_my + '"' + content[match.end():]
            print(f'{scenario_id} descMm: {desc_my[:50]}')
        else:
            print(f'WARN: could not find descriptionMm for {scenario_id}')

with open('lib/scenarios.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('SUCCESS: Updated scenarios.ts')
