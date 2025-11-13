"""Quick script to test if all imports work correctly"""
import sys
print("Testing imports...")

try:
    from app.main import app
    print("✓ FastAPI app imported successfully")

    from app.core.config import settings
    print(f"✓ Settings loaded: {settings.PROJECT_NAME}")

    from app.core.database import Base, get_db
    print("✓ Database configuration imported successfully")

    from app.core.security import hash_password, verify_password, create_access_token
    print("✓ Security utilities imported successfully")

    # Test JWT token creation
    test_token = create_access_token({"sub": "test_user"})
    print(f"✓ JWT token creation works correctly (length: {len(test_token)})")

    print("\n✓ All imports successful! Backend is ready.")
    print(f"\nAPI Info:")
    print(f"  Name: {settings.PROJECT_NAME}")
    print(f"  Version: {settings.VERSION}")
    print(f"  Environment: {settings.ENVIRONMENT}")
    print(f"  Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'configured'}")

except Exception as e:
    print(f"\n✗ Import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
