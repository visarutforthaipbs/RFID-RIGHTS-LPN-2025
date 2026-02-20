#!/usr/bin/env python3
"""Extract translations from my_translations_2026-02-21.json and generate code updates."""
import json, csv, re

with open('data/my_translations_2026-02-21.json', 'r') as f:
    data = json.load(f)
trans = data['translations']

def get_my(section, key):
    """Get the 'my' value from a translation entry, stripping trailing whitespace/newlines."""
    val = section[key]['my']
    return val.strip() if isinstance(val, str) else val

# ============================================================
# 1. Generate i18n.ts mm locale
# ============================================================
ui = trans['ui_labels']
hp = trans['home_page']
help_p = trans['help_page']
tp = trans['topics_page']
cat = trans['categories']
sp = trans['settings_page']

# Build the mm locale object
mm_lines = []
mm_lines.append('  mm: {')
# UI labels
mm_lines.append(f'    title: "{get_my(ui, "title")}",')
mm_lines.append(f'    search: "{get_my(ui, "search")}",')
mm_lines.append(f'    categories: "{get_my(ui, "categories")}",')
mm_lines.append(f'    topics: "{get_my(ui, "topics")}",')
mm_lines.append(f'    help: "{get_my(ui, "help")}",')
mm_lines.append(f'    knowYourRights: "{get_my(ui, "knowYourRights")}",')
mm_lines.append(f'    howToIdentify: "{get_my(ui, "howToIdentify")}",')
mm_lines.append(f'    selfHelp: "{get_my(ui, "selfHelp")}",')
mm_lines.append(f'    law: "{get_my(ui, "law")}",')
mm_lines.append(f'    contact: "{get_my(ui, "contact")}",')
mm_lines.append(f'    settings: "{get_my(ui, "settings")}",')
mm_lines.append(f'    about: "{get_my(ui, "about")}",')
mm_lines.append(f'    privacy: "{get_my(ui, "privacy")}",')
# Home page
mm_lines.append(f'    // Home page')
mm_lines.append(f'    chooseYourSituation: "{get_my(hp, "chooseYourSituation")}",')
mm_lines.append(f'    chooseDescription:')
mm_lines.append(f'      "{get_my(hp, "chooseDescription")}",')
mm_lines.append(f'    orSearchDirectly: "{get_my(hp, "orSearchDirectly")}",')
mm_lines.append(f'    orChooseBelow: "{get_my(hp, "orChooseBelow")}",')
mm_lines.append(f'    commonSituations: "{get_my(hp, "commonSituations")}",')
mm_lines.append(f'    chooseClosest: "{get_my(hp, "chooseClosest")}",')
mm_lines.append(f'    backToSituations: "{get_my(hp, "backToSituations")}",')
mm_lines.append(f'    searchPlaceholder: "{get_my(hp, "searchPlaceholder")}",')
mm_lines.append(f'    noResults: "{get_my(hp, "noResults")}",')
mm_lines.append(f'    tryDifferentKeywords: "{get_my(hp, "tryDifferentKeywords")}",')
mm_lines.append(f'    tip: "{get_my(hp, "tip")}",')
mm_lines.append(f'    urgentAction:')
mm_lines.append(f'      "{get_my(hp, "urgentAction")}",')
mm_lines.append(f'    emergencyContact:')
mm_lines.append(f'      "{get_my(hp, "emergencyContact")}",')
mm_lines.append(f'    relatedTopics: "{get_my(hp, "relatedTopics")}",')
mm_lines.append(f'    found: "{get_my(hp, "found")}",')
mm_lines.append(f'    topicsCount: "{get_my(hp, "topicsCount")}",')
mm_lines.append(f'    searchResults: "{get_my(hp, "searchResults")}",')
mm_lines.append(f'    resultsCount: "{get_my(hp, "resultsCount")}",')
mm_lines.append(f'    notFoundYet: "{get_my(hp, "notFoundYet")}",')
mm_lines.append(f'    tryOtherOrSearch:')
mm_lines.append(f'      "{get_my(hp, "tryOtherOrSearch")}",')
mm_lines.append(f'    chooseNewSituation: "{get_my(hp, "chooseNewSituation")}",')
mm_lines.append(f'    viewAllTopics: "{get_my(hp, "viewAllTopics")}",')
mm_lines.append(f'    cantFind: "{get_my(hp, "cantFind")}",')
mm_lines.append(f'    getHelp: "{get_my(hp, "getHelp")}",')
mm_lines.append(f'    emergencyHotline: "{get_my(hp, "emergencyHotline")}",')
mm_lines.append(f'    learnMore: "{get_my(hp, "learnMore")}",')
mm_lines.append(f'    readMore: "{get_my(ui, "readMore")}",')
mm_lines.append(f'    settingsAndDisplay: "{get_my(hp, "settingsAndDisplay")}",')
# Help page
mm_lines.append(f'    // Help page')
mm_lines.append(f'    home: "{get_my(ui, "home")}",')
mm_lines.append(f'    helpPageTitle: "{get_my(help_p, "helpPageTitle")}",')
mm_lines.append(f'    helpPageDescription:')
mm_lines.append(f'      "{get_my(help_p, "helpPageDescription")}",')
mm_lines.append(f'    emergency: "{get_my(help_p, "emergency")}",')
mm_lines.append(f'    emergencyDescription:')
mm_lines.append(f'      "{get_my(help_p, "emergencyDescription")}",')
mm_lines.append(f'    callPolice: "{get_my(help_p, "callPolice")}",')
mm_lines.append(f'    callAmbulance: "{get_my(help_p, "callAmbulance")}",')
mm_lines.append(f'    importantHotlines: "{get_my(help_p, "importantHotlines")}",')
mm_lines.append(f'    helpfulOrganizations: "{get_my(help_p, "helpfulOrganizations")}",')
mm_lines.append(f'    additionalTips: "{get_my(help_p, "additionalTips")}",')
mm_lines.append(f'    website: "{get_my(help_p, "website")}",')
mm_lines.append(f'    availableHours: "{get_my(help_p, "availableHours")}",')
mm_lines.append(f'    hours24: "{get_my(help_p, "hours24")}",')
mm_lines.append(f'    weekdayHours: "{get_my(help_p, "weekdayHours")}",')
# Topics page
mm_lines.append(f'    // Topics page')
mm_lines.append(f'    allTopics: "{get_my(tp, "allTopics")}",')
mm_lines.append(f'    topicsPageDescription:')
mm_lines.append(f'      "{get_my(tp, "topicsPageDescription")}",')
mm_lines.append(f'    searchTopicsPlaceholder: "{get_my(tp, "searchTopicsPlaceholder")}",')
mm_lines.append(f'    all: "{get_my(tp, "all")}",')
mm_lines.append(f'    totalTopics: "{get_my(tp, "totalTopics")}",')
mm_lines.append(f'    foundTopicsOf: "တွေ့ရှိ",')
mm_lines.append(f'    topicsOf: "ခေါင်းစဉ်မှ",')
mm_lines.append(f'    noTopicsFound: "{get_my(tp, "noTopicsFound")}",')
mm_lines.append(f'    tryDifferentSearchOrCategory:')
mm_lines.append(f'      "{get_my(tp, "tryDifferentSearchOrCategory")}",')
mm_lines.append(f'    showAllTopics: "{get_my(tp, "showAllTopics")}",')
# Topic detail page
mm_lines.append(f'    // Topic detail page')
mm_lines.append(f'    relatedLaws: "{get_my(ui, "relatedLaws")}",')
mm_lines.append(f'    remarks: "{get_my(ui, "remarks")}",')
mm_lines.append(f'    readFullLaw: "{get_my(ui, "readFullLaw")}",')
mm_lines.append(f'    backToHome: "{get_my(ui, "backToHome")}",')
mm_lines.append(f'    topicNotFound: "{get_my(tp, "topicNotFound")}",')
mm_lines.append(f'    loadError: "{get_my(tp, "loadError")}",')
# Categories
mm_lines.append(f'    // Categories')
mm_lines.append(f'    categoryDocuments: "{get_my(cat, "categoryDocuments2")}",')
mm_lines.append(f'    categoryWork: "{get_my(cat, "categoryWork2")}",')
mm_lines.append(f'    categoryFamily: "{get_my(cat, "categoryFamily2")}",')
# Settings page
mm_lines.append(f'    // Settings page')
mm_lines.append(f'    settingsPageTitle: "{get_my(sp, "settingsPageTitle")}",')
mm_lines.append(f'    settingsPageDescription:')
mm_lines.append(f'      "{get_my(sp, "settingsPageDescription")}",')
mm_lines.append(f'    language: "{get_my(sp, "language")}",')
mm_lines.append(f'    selectLanguage: "{get_my(sp, "selectLanguage")}",')
mm_lines.append(f'    changeLanguageDisplay: "{get_my(sp, "changeLanguageDisplay")}",')
mm_lines.append(f'    display: "{get_my(sp, "display")}",')
mm_lines.append(f'    fontSize: "{get_my(sp, "fontSize")}",')
mm_lines.append(f'    small: "{get_my(sp, "small")}",')
mm_lines.append(f'    medium: "{get_my(sp, "medium")}",')
mm_lines.append(f'    large: "{get_my(sp, "large")}",')
mm_lines.append(f'    darkMode: "{get_my(sp, "darkMode")}",')
mm_lines.append(f'    darkModeDescription:')
mm_lines.append(f'      "{get_my(sp, "darkModeDescription")}",')
mm_lines.append(f'    notifications: "{get_my(sp, "notifications")}",')
mm_lines.append(f'    notificationsDescription: "{get_my(sp, "notificationsDescription")}",')
mm_lines.append(f'    dataAndStorage: "{get_my(sp, "dataAndStorage")}",')
mm_lines.append(f'    dataUsage: "{get_my(sp, "dataUsage")}",')
mm_lines.append(f'    dataUsageDescription: "{get_my(sp, "dataUsageDescription")}",')
mm_lines.append(f'    cacheData: "{get_my(sp, "cacheData")}",')
mm_lines.append(f'    cacheDataDescription: "{get_my(sp, "cacheDataDescription")}",')
mm_lines.append(f'    clearCache: "{get_my(sp, "clearCache")}",')
mm_lines.append(f'    aboutSection: "{get_my(sp, "aboutSection")}",')
mm_lines.append(f'    appName: "{get_my(sp, "appName")}",')
mm_lines.append(f'    version: "{get_my(sp, "version")}",')
mm_lines.append(f'    appDescription: "{get_my(sp, "appDescription")}",')
mm_lines.append(f'    appDescriptionDetail: "{get_my(sp, "appDescriptionDetail")}",')
mm_lines.append(f'    designedBy: "{get_my(sp, "designedBy")}",')
mm_lines.append(f'    designedByDetail:')
mm_lines.append(f'      "{get_my(sp, "designedByDetail")}",')
mm_lines.append(f'    supportedBy: "{get_my(sp, "supportedBy")}",')
mm_lines.append(f'    resetAllSettings: "{get_my(sp, "resetAllSettings")}",')
mm_lines.append(f'    confirmReset: "{get_my(sp, "confirmReset")}",')
mm_lines.append(f'    settingsReset: "{get_my(sp, "settingsReset")}",')
mm_lines.append(f'    cacheCleared: "{get_my(sp, "cacheCleared")}",')
# Volunteer page
mm_lines.append(f'    // Volunteer page')
mm_lines.append(f'    volunteer: "{get_my(ui, "volunteer")}",')
mm_lines.append(f'  }},')

with open('/tmp/mm_locale.txt', 'w') as f:
    f.write('\n'.join(mm_lines))

# ============================================================
# 2. Generate scenarios updates
# ============================================================
scenarios = trans['scenarios']
scenario_data = [
    ('new_worker', 'new-worker'),
    ('workplace', 'workplace-problem'),
    ('document', 'document-expiring'),
    ('family', 'family-issues'),
    ('health', 'healthcare'),
    ('community', 'community-life'),
    ('emergency', 'emergency-help'),
    ('rights', 'legal-rights'),
]

scenario_updates = []
for key, scenario_id in scenario_data:
    title = get_my(scenarios, f'scenario_{key}_title')
    desc = get_my(scenarios, f'scenario_{key}_desc')
    scenario_updates.append(f'{scenario_id}|{title}|{desc}')

with open('/tmp/scenario_updates.txt', 'w') as f:
    f.write('\n'.join(scenario_updates))

# ============================================================
# 3. Generate myanmar-content.csv
# ============================================================
category_map = {
    1: get_my(cat, 'categoryDocuments'),
    2: get_my(cat, 'categoryDocuments'),
    3: get_my(cat, 'categoryDocuments'),
    4: get_my(cat, 'categoryWork'),
    5: get_my(cat, 'categoryWork'),
    6: get_my(cat, 'categoryWork'),
    7: get_my(cat, 'categoryWork'),
    8: get_my(cat, 'categoryFamily'),
    9: get_my(cat, 'categoryFamily'),
    10: get_my(cat, 'categoryFamily'),
    11: get_my(cat, 'categoryFamily'),
    12: get_my(cat, 'categoryFamily'),
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

topic_titles = trans['topic_titles']

def extract_my(val):
    if isinstance(val, dict):
        return val.get('my', '').strip()
    return str(val).strip()

new_rows = []
for i in range(1, 13):
    topic_title = get_my(topic_titles, f'topic_{i}')
    ct = trans[f'content_topic_{i}']

    law = extract_my(ct[f't{i}_law_rights'])
    know = extract_my(ct[f't{i}_know_rights'])
    observe = extract_my(ct[f't{i}_observe'])
    self_help = extract_my(ct[f't{i}_self_help'])

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

# ============================================================
# Verify
# ============================================================
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
            print(f"WARNING Row {i+1}: Thai text in [{col[:30]}]")

if not thai_found:
    print("CSV OK: No Thai text in content columns!")

print(f"CSV: Wrote {len(new_rows)} rows")
print(f"i18n: Generated mm locale -> /tmp/mm_locale.txt")
print(f"Scenarios: Generated updates -> /tmp/scenario_updates.txt")

# Print scenario updates for verification
print("\n--- Scenario Updates ---")
for line in scenario_updates:
    parts = line.split('|')
    print(f"  {parts[0]}: title={parts[1][:30]}...")
