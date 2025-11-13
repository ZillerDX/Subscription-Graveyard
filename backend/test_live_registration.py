"""
Test registration with the live frontend URL
"""
import requests
import random
import string

def generate_random_email():
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"frontend_test_{random_str}@example.com"

# Test with CORS headers like the browser would send
email = generate_random_email()
password = "TestPassword123!"

print(f"Testing registration with email: {email}")

# First, test OPTIONS (preflight)
options_response = requests.options(
    "http://127.0.0.1:8000/api/v1/auth/register",
    headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
    }
)

print(f"\n=== OPTIONS Preflight ===")
print(f"Status: {options_response.status_code}")
print(f"Headers: {dict(options_response.headers)}")

# Then test POST
post_response = requests.post(
    "http://127.0.0.1:8000/api/v1/auth/register",
    json={"email": email, "password": password},
    headers={
        "Origin": "http://localhost:5173",
        "Content-Type": "application/json",
    }
)

print(f"\n=== POST Registration ===")
print(f"Status: {post_response.status_code}")
if post_response.status_code == 201:
    print(f"✓ SUCCESS! Token received: {post_response.json()['access_token'][:50]}...")
else:
    print(f"✗ FAILED! Response: {post_response.text}")
