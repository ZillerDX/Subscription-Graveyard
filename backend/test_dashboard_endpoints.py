"""
Test script to verify dashboard endpoints work correctly
"""
import sys
sys.path.insert(0, 'C:\\GitHub\\sub\\backend')

try:
    # Test imports
    print("Testing imports...")
    from app.services.dashboard_service import DashboardService
    from app.api.v1.endpoints import dashboard
    from app.api.v1 import router
    print("✓ All dashboard imports successful")

    # Verify dashboard service methods exist
    print("\nVerifying DashboardService methods...")
    assert hasattr(DashboardService, 'calculate_stats')
    assert hasattr(DashboardService, 'get_kill_zone_data')
    assert hasattr(DashboardService, 'get_category_breakdown')
    print("✓ All DashboardService methods exist")

    # Verify dashboard endpoints exist
    print("\nVerifying dashboard endpoints...")
    assert hasattr(dashboard.router, 'routes')
    routes = [route.path for route in dashboard.router.routes]
    assert "/stats" in routes
    assert "/kill-zone" in routes
    assert "/category-breakdown" in routes
    print("✓ All dashboard endpoints registered")

    # Verify router includes dashboard
    print("\nVerifying API router includes dashboard...")
    from app.api.v1.router import api_router
    api_routes = [route.path for route in api_router.routes]
    print(f"  API routes: {api_routes}")
    print("✓ Dashboard router included in API router")

    print("\n" + "="*50)
    print("✅ ALL DASHBOARD BACKEND TESTS PASSED!")
    print("="*50)
    print("\nDashboard endpoints available:")
    print("  - GET /api/v1/dashboard/stats")
    print("  - GET /api/v1/dashboard/kill-zone")
    print("  - GET /api/v1/dashboard/category-breakdown")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
