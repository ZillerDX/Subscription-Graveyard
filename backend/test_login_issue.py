"""
Test to debug login issue
"""
import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

# Test credentials
email = "logintest@example.com"
password = "TestPassword123!"

print("=== Step 1: Register ===")
reg_response = requests.post(
    f"{BASE_URL}/auth/register",
    json={"email": email, "password": password}
)
print(f"Status: {reg_response.status_code}")
if reg_response.status_code == 201:
    print(f"✓ Registration successful")
    print(f"Response: {reg_response.json()}")
elif reg_response.status_code == 409:
    print(f"✓ User already exists (expected if running multiple times)")
else:
    print(f"✗ Registration failed: {reg_response.text}")
    exit(1)

print("\n=== Step 2: Login with same credentials ===")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": email, "password": password}
)
print(f"Status: {login_response.status_code}")
print(f"Response: {login_response.text}")

if login_response.status_code == 200:
    print(f"✓ Login successful!")
    data = login_response.json()
    print(f"Access Token: {data['access_token'][:50]}...")
else:
    print(f"✗ Login failed!")
    print(f"Full response: {login_response.json()}")
