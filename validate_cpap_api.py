#!/usr/bin/env python3
"""
Validation script for CPAP Sleep API endpoint
Verifies structure, fields, data count, and date range
"""

import json
import sys
from datetime import datetime
from urllib.request import urlopen
from urllib.error import URLError

API_URL = "https://rib-recovery-dashboard-61b9d4.gitlab.io/api/cpap-sleep.json"
EXPECTED_NIGHTS = 436
EXPECTED_START_DATE = "2024-11-20"
EXPECTED_END_DATE = "2026-02-10"

REQUIRED_FIELDS = [
    "usage_hours",
    "ahi",
    "mask_events",
    "avg_leak",
    "compliance_rate",
    "7_day_averages"
]

def validate_api():
    print(f"Validating CPAP Sleep API: {API_URL}\n")
    
    # 1. Check accessibility
    print("1. Checking endpoint accessibility...")
    try:
        response = urlopen(API_URL, timeout=10)
        data = json.loads(response.read().decode('utf-8'))
        print("   ✓ Endpoint is accessible")
    except URLError as e:
        print(f"   ✗ Failed to access endpoint: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"   ✗ Invalid JSON: {e}")
        return False
    
    # 2. Validate JSON structure and required fields
    print("\n2. Validating JSON structure...")
    
    # Check top-level structure
    if "nights" not in data:
        print("   ✗ Missing 'nights' array")
        return False
    print("   ✓ 'nights' array present")
    
    if "data_range" not in data:
        print("   ✗ Missing 'data_range' object")
        return False
    print("   ✓ 'data_range' object present")
    
    if "summary" not in data:
        print("   ✗ Missing 'summary' object")
        return False
    print("   ✓ 'summary' object present")
    
    # Check required fields in night entries
    print("\n3. Validating required fields in night entries...")
    if len(data["nights"]) == 0:
        print("   ✗ No night entries found")
        return False
    
    sample_night = data["nights"][0]
    missing_fields = []
    
    # Check for standard fields (not the special ones mentioned in requirements)
    standard_fields = ["usage_hours", "ahi", "mask_events", "avg_leak"]
    for field in standard_fields:
        if field in sample_night:
            print(f"   ✓ '{field}' field present")
        else:
            missing_fields.append(field)
            print(f"   ✗ '{field}' field missing")
    
    # Check for compliance_rate and 7_day_averages in summary
    print("\n4. Validating summary fields...")
    if "compliance_rate_30d" in data["summary"]:
        print("   ✓ 'compliance_rate' (compliance_rate_30d) present in summary")
    else:
        print("   ✗ 'compliance_rate' missing from summary")
        missing_fields.append("compliance_rate")
    
    # Check for 7-day averages
    seven_day_fields = ["avg_usage_7d", "avg_ahi_7d"]
    has_7day = all(field in data["summary"] for field in seven_day_fields)
    if has_7day:
        print("   ✓ '7_day_averages' data present in summary")
    else:
        print("   ✗ '7_day_averages' data missing from summary")
        missing_fields.append("7_day_averages")
    
    if missing_fields:
        print(f"\n   Missing required fields: {', '.join(missing_fields)}")
        return False
    
    # 3. Validate number of nights
    print(f"\n5. Validating data count...")
    actual_nights = len(data["nights"])
    if actual_nights == EXPECTED_NIGHTS:
        print(f"   ✓ Correct number of nights: {actual_nights}")
    else:
        print(f"   ✗ Expected {EXPECTED_NIGHTS} nights, found {actual_nights}")
        return False
    
    # 4. Validate date range
    print(f"\n6. Validating date range...")
    
    # Check data_range metadata
    if data["data_range"]["start"] != EXPECTED_START_DATE:
        print(f"   ✗ Start date mismatch: expected {EXPECTED_START_DATE}, found {data['data_range']['start']}")
        return False
    print(f"   ✓ Start date correct: {EXPECTED_START_DATE}")
    
    if data["data_range"]["end"] != EXPECTED_END_DATE:
        print(f"   ✗ End date mismatch: expected {EXPECTED_END_DATE}, found {data['data_range']['end']}")
        return False
    print(f"   ✓ End date correct: {EXPECTED_END_DATE}")
    
    if data["data_range"]["total_nights"] != EXPECTED_NIGHTS:
        print(f"   ✗ Total nights mismatch: expected {EXPECTED_NIGHTS}, found {data['data_range']['total_nights']}")
        return False
    print(f"   ✓ Total nights correct: {EXPECTED_NIGHTS}")
    
    # Verify actual first and last entries
    first_entry_date = data["nights"][-1]["date"]  # nights are in reverse chronological order
    last_entry_date = data["nights"][0]["date"]
    
    if first_entry_date != EXPECTED_START_DATE:
        print(f"   ✗ First entry date mismatch: expected {EXPECTED_START_DATE}, found {first_entry_date}")
        return False
    print(f"   ✓ First entry date verified: {first_entry_date}")
    
    if last_entry_date != EXPECTED_END_DATE:
        print(f"   ✗ Last entry date mismatch: expected {EXPECTED_END_DATE}, found {last_entry_date}")
        return False
    print(f"   ✓ Last entry date verified: {last_entry_date}")
    
    print("\n" + "="*60)
    print("✓ ALL VALIDATIONS PASSED")
    print("="*60)
    return True

if __name__ == "__main__":
    success = validate_api()
    sys.exit(0 if success else 1)
