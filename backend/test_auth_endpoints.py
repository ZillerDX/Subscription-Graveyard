import requests
import random
import string

BASE_URL = "http://127.0.0.1:8000"

def generate_random_email():
    """Generate a random email for testing"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_str}@example.com"

def test_registration():
    """Test user registration"""
    print("\n=== Testing Registration ===")

    email = generate_random_email()
    password = "TestPassword123!"

    registration_data = {
        "email": email,
        "password": password,
        "full_name": "Test User"
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register",
            json=registration_data
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code in [200, 201]:
            print("✓ Registration successful!")
            return email, password
        else:
            print("✗ Registration failed!")
            return None, None

    except Exception as e:
        print(f"✗ Error during registration: {e}")
        return None, None

def test_login(email, password):
    """Test user login"""
    print("\n=== Testing Login ===")

    login_data = {
        "email": email,
        "password": password
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json=login_data
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                print("✓ Login successful!")
                print(f"Access Token: {data['access_token'][:50]}...")
                return data["access_token"]
            else:
                print("✗ Login response missing access_token!")
                return None
        else:
            print("✗ Login failed!")
            return None

    except Exception as e:
        print(f"✗ Error during login: {e}")
        return None

def test_protected_endpoint(token):
    """Test accessing a protected endpoint with the token"""
    print("\n=== Testing Protected Endpoint ===")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/auth/me",
            headers=headers
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code == 200:
            print("✓ Protected endpoint access successful!")
            return True
        else:
            print("✗ Protected endpoint access failed!")
            return False

    except Exception as e:
        print(f"✗ Error accessing protected endpoint: {e}")
        return False

if __name__ == "__main__":
    print("Starting Authentication Tests...")
    print(f"Base URL: {BASE_URL}")

    # Test Registration
    email, password = test_registration()

    if email and password:
        # Test Login
        token = test_login(email, password)

        if token:
            # Test Protected Endpoint
            test_protected_endpoint(token)

    print("\n=== Tests Completed ===")
